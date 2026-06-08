const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

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
   - Dinner = FIXED 20:00
   - Check for conflicts: if lunch overlaps dinner, adjust lunch to 19:00-19:30

3. GYM TIMING: 
   - IF both prayers conduct → Gym at 18:30-19:15
   - IF only morning prayer → Gym at 18:30-19:15
   - IF no prayers → Gym at 19:00-20:00

4. STUDY BLOCKS: 
   - Fill remaining free time with study goals
   - Critical first, then high priority
   - Minimum 30 minutes
   - Maximum 180 minutes

5. BUFFER TIMES: 
   - Month 1: 10 min
   - Month 2: 8 min
   - Month 3+: 7 min

6. SCHEDULE OVERFLOW: 
   - Calculate total time needed vs available time
   - If overflow, show warnings
   - Total must not exceed available hours

7. RETURN FORMAT (MUST BE VALID JSON):

{
  "schedule": [
    {
      "time": "HH:MM",
      "title": "Task",
      "duration": "60min",
      "category": "Study",
      "locked": false
    }
  ],
  "prayers": {
    "morning": true,
    "evening": true,
    "reason": ""
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
  "totalHours": 0,
  "availableHours": 0,
  "overflow": false
}

IMPORTANT:
- Return ONLY valid JSON
- NO markdown, NO explanations, NO code fences
- All times in HH:MM format (24-hour)
- Duration format: "XXmin"
`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const input = JSON.parse(event.body);

    const {
      sleepTime,
      wakeTime,
      goals = [],
      habits = []
    } = input;

    if (!sleepTime || !wakeTime) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "sleepTime and wakeTime are required"
        })
      };
    }

    // Format goals
    const goalsFormatted = goals
      .map((g, i) => `${i + 1}. ${g.name} (Priority: ${g.priority})`)
      .join("\n");

    // Format habits
    const habitsFormatted = habits
      .map(h => `- ${h.name} (${h.category})`)
      .join("\n");

    const userPrompt = `
Create an optimized daily schedule with these parameters:

SLEEP & WAKE
- Slept at: ${sleepTime}
- Wake time: ${wakeTime}

GOALS
${goalsFormatted || "No specific goals"}

HABITS
${habitsFormatted || "No specific habits"}

Generate a complete daily schedule following all the rules in the system prompt.
Return ONLY valid JSON, no markdown, no explanations.
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: systemPrompt + "\n\n" + userPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        responseMimeType: "application/json"
      }
    });

    let responseText = result.response.text();

    // Clean up response
    responseText = responseText
      .replace(/^```json\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    let schedule;

    try {
      schedule = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", responseText);

      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "AI returned invalid JSON",
          raw: responseText,
          parseError: parseError.message
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule)
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error.message || "Internal server error",
        details: error.toString()
      })
    };
  }
};
