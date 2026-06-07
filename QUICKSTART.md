# 🚀 Quick Start - Deploy to Netlify in 5 Minutes

## Prerequisites
- GitHub account (https://github.com)
- Netlify account (https://netlify.com)
- Claude API key (https://console.anthropic.com)

---

## Step 1: Create GitHub Repository (2 min)

```bash
# Download all files (already in outputs folder)
# Create new GitHub repo: https://github.com/new
# Name: life-os-smart

git init
git add .
git commit -m "Life OS Smart - Claude AI Scheduler"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/life-os-smart.git
git push -u origin main
```

---

## Step 2: Connect Netlify (1 min)

1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Select GitHub
4. Choose `life-os-smart` repo
5. Click "Deploy" (settings auto-detected)

---

## Step 3: Set API Key (1 min)

1. Go to Netlify site dashboard
2. Site settings → Environment
3. Add new variable:
   - **Key**: `CLAUDE_API_KEY`
   - **Value**: (paste from https://console.anthropic.com)
4. Redeploy

---

## Step 4: Test (1 min)

Visit: `https://your-site.netlify.app`

1. Enter sleep time: `23:00`
2. Enter wake time: `06:00`
3. Click `🤖 Claude Schedule`
4. See AI-optimized schedule ✅

---

## 📋 File Structure

```
life-os-smart/
├── index.html                (main app)
├── netlify.toml             (config)
├── package.json             (dependencies)
└── functions/
    └── generateSchedule.js  (Claude AI)
```

---

## 🤖 How Claude Schedules

**Input**: Sleep time + Wake time
↓
**Claude Calculates**:
- Breakfast = wake + 90 min
- Lunch = breakfast + 210 min  
- Dinner = fixed 20:00
- Prayer times (if applicable)
- Gym timing
- Study blocks
- Meal conflicts
- Schedule overflow

**Output**: Complete optimized schedule ✅

---

## 📊 Scheduling Rules Claude Follows

| Rule | Logic |
|------|-------|
| **Prayers** | If wake > 09:00: skip both. If wake > 16:30: skip evening only. Else: both OK |
| **Meals** | Breakfast = wake+90. Lunch = breakfast+210. Dinner = fixed 20:00 |
| **Gym** | After prayers (18:30) or fixed (19:00) if no prayers |
| **Study** | Fill remaining time, min 30 min blocks, max 3 hrs |
| **Buffer** | 10 min (M1), 8 min (M2), 7 min (M3+) between blocks |
| **Overflow** | Warn if total time > available, suggest compression |

---

## ✅ Testing Checklist

- [ ] Site deployed
- [ ] API key set
- [ ] Enter sleep/wake times
- [ ] Click Claude Schedule button
- [ ] See schedule in UI
- [ ] Check prayers are correct
- [ ] Check meals don't overlap
- [ ] Check no warnings
- [ ] Mobile works

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank schedule | Enter sleep & wake times |
| API key error | Check env variable in Netlify |
| Wrong meals | Check wake time format (HH:MM) |
| Slow response | Claude API sometimes slow (try again) |
| Function error | Check browser console (F12) |

---

## 📞 Support

**Need help?**
1. Check: NETLIFY_DEPLOYMENT_GUIDE.md
2. Check: Browser console (F12 → Console)
3. Test locally: `netlify dev`
4. Verify Claude API key

---

## 🎉 Done!

Your AI-powered scheduler is live!

Share URL: `https://your-site.netlify.app`

Users can:
1. Enter sleep & wake times
2. Click "Claude Schedule"
3. Get AI-optimized daily plan
4. All data saved locally (no server)

---

**Total time: ~5 minutes. Your scheduler is production-ready!** 🚀
