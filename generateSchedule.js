const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const systemPrompt = `You are a smart scheduling assistant for a Cloud Engineer's transformation program.

CRITICAL RULES YOU MUST FOLLOW:

1. PRAYER LOGIC (MANDATORY):
   - Morning Prayer: 08:00-09:00
   - Evening Prayer: 18:00-18:30
   - IF wake > 09:00 → SKIP BOTH prayers
   - IF wake > 16:30 AND wake < 18:00 → SKIP evening prayer only, keep morning (if wake < 09:00)
   - IF wake < 16:30 → BOTH prayers conduct

2. MEAL CALCULATION:
   - Breakfast = wake_time + 90 minutes
   - Lunch = breakfast_time + 210 minutes (3.5 hours)
   - Dinner = FIXED 20:00 (8:00 PM, NEVER change)
   - Check for conflicts: if lunch overlaps dinner, adjust lunch to 19:00-19:30

3. GYM TIMING:
   - IF both prayers conduct → Gym at 18:30-19:15 (after evening prayer)
   - IF only morning prayer → Gym at 18:30-19:15
   - IF no prayers → Gym at 19:00-20:00

4. STUDY BLOCKS:
   - Fill remaining free time with study goals (critical first, then high priority)
   - Min 30 min per block, max 180 min (3 hours)
   - Don't break study into < 30 min chunks

5. BUFFER TIMES (CRITICAL):
   - Month 1: 10 min between blocks
   - Month 2: 8 min between blocks
   - Month 3+: 7 min between blocks

6. SCHEDULE OVERFLOW:
   - Calculate total time needed vs available time
   - If overflow, show WARNING and suggest solutions
   - Total must not exceed available hours

7. RETURN FORMAT:
   Always return valid JSON with NO markdown, NO code blocks, ONLY JSON:
   {
     "schedule": [
       {"time": "HH:MM", "title": "...", "duration": "Xmin", "category": "...", "locked": boolean}
     ],
     "prayers": {
       "morning": true/false,
       "evening": true/false,
       "reason": "..."
     },
     "meals": {
       "breakfast": "HH:MM",
       "lunch": "HH:MM",
       "dinner": "20:00",
       "conflicts": []
     },
     "gym": "HH:MM-HH:MM",
     "conflicts": [],
     "warnings": [],
     "recommendations": [],
     "totalHours": X.X,
     "availableHours": X.X,
     "overflow": boolean
   }`;

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const input = JSON.parse(event.body);
    const { sleepTime, wakeTime, goals = [], habits = [] } = input;

    // Validation
    if (!sleepTime || !wakeTime) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "sleepTime and wakeTime required" }),
      };
    }

    // Build user prompt
    const userPrompt = `
Create an optimized daily schedule with these parameters:

SLEEP & WAKE:
- Slept at: ${sleepTime}
- Woke at: ${wakeTime}

GOALS TO STUDY (in order):
${goals.map((g, i) => `${i + 1}. ${g.title} (${g.priority})`).join("\n")}

HABITS TO INCLUDE:
${habits.map((h) => `- ${h.name} (${h.category})`).join("\n")}

Generate a complete daily schedule following all rules above. 
Calculate wake-to-sleep total hours available.
Return ONLY valid JSON.`;

    const message = await anthropic.messages.create({
      model: "claude-opus-4-1",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extract JSON from response
    let responseText = message.content[0].text;
    
    // Remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    // Parse JSON
    const schedule = JSON.parse(responseText);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Internal server error",
        details: error.toString(),
      }),
    };
  }
};
