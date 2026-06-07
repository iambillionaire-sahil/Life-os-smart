# 🚀 Life OS Smart - Netlify Deployment Package

**AI-Powered Smart Scheduler with Claude Integration**

## 📦 What's Inside

- `index.html` - Complete Life OS Smart app with Claude AI button
- `netlify.toml` - Netlify configuration
- `package.json` - Dependencies (Anthropic SDK)
- `functions/generateSchedule.js` - Claude AI scheduling engine
- `QUICKSTART.md` - 5-minute deployment guide

## ⚡ Quick Deploy (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Life OS Smart - Claude AI Scheduler"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/life-os-smart.git
git push -u origin main
```

### 2. Deploy on Netlify
- Go to https://app.netlify.com
- Click "New site from Git"
- Select your GitHub repo
- Click "Deploy"

### 3. Set Claude API Key
- In Netlify dashboard: Site settings → Environment
- Add new variable:
  - **Key**: `CLAUDE_API_KEY`
  - **Value**: (paste from https://console.anthropic.com)
- Redeploy site

### 4. Test
- Visit your-site.netlify.app
- Enter sleep time (23:00)
- Enter wake time (06:00)
- Click "🤖 Claude Schedule"
- See optimized schedule! ✅

## 🧠 How It Works

**User Input:**
- Last night sleep time
- Today wake time
- Study goals
- Daily habits

**Claude AI Analyzes:**
- Prayer times (morning 08:00-09:00, evening 18:00-18:30)
- Meal times (breakfast = wake+90, lunch = breakfast+210, dinner = 20:00)
- Gym scheduling
- Study block generation
- Conflict detection
- Schedule overflow warnings

**Output:**
- Complete optimized daily schedule
- Prayer status
- Meal timing
- Warnings & recommendations

## 📋 Prayer Logic Rules

- **If wake > 09:00** → Skip both prayers
- **If wake > 16:30** → Skip evening prayer only
- **If wake < 16:30** → Both prayers conduct

## 📊 Meal Calculation

- **Breakfast** = Wake time + 90 minutes
- **Lunch** = Breakfast time + 210 minutes (3.5 hours)
- **Dinner** = Fixed at 20:00 (8:00 PM)

## 🔧 Requirements

- GitHub account (free)
- Netlify account (free)
- Claude API key (https://console.anthropic.com)

## 📞 Support

See `QUICKSTART.md` for detailed deployment steps.

## ✅ Status

- Production Ready ✓
- Claude AI Integrated ✓
- Netlify Serverless ✓
- Ready to Deploy ✓

---

**Deploy now! → See QUICKSTART.md**
