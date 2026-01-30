# CoreDNA-369: Live Backend Setup Guide

This removes all mocks and gets the app running with a real backend.

## Prerequisites

- Node.js 18+
- Google Gemini API Key (free tier: https://ai.google.dev/)
- Two terminal windows

---

## Step 1: Backend Setup

### 1.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 1.2 Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_actual_gemini_key_here
SUPABASE_URL=  # Leave blank for now (in-memory fallback)
SUPABASE_KEY=  # Leave blank for now
FRONTEND_URL=http://localhost:1111
```

**Get Gemini Key:**
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create new project or use default
4. Copy the key into `.env.local`

### 1.3 Start Backend

```bash
npm run dev
```

You should see:
```
✓ CoreDNA Backend running on http://localhost:3000
✓ Frontend target: http://localhost:1111
```

Leave this running in terminal 1.

---

## Step 2: Frontend Setup

### 2.1 Install Frontend Dependencies (if not done)

```bash
cd ..
npm install
```

### 2.2 Configure Frontend

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 2.3 Start Frontend Dev Server

In a new terminal window:
```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  building for development

  ➜  Local:   http://localhost:1111/
```

---

## Step 3: Test the App

### 3.1 Test Backend Health

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 3.2 Test Brand Extraction

Open http://localhost:1111 in your browser.

Go to **Extract** page and enter:
- URL: `https://www.apple.com`
- Description: `Tech company known for innovation`

Click "Extract". This should:
1. Scrape apple.com
2. Send data to backend
3. Gemini analyzes it
4. Returns real brand DNA (no mocks)

### 3.3 Test Lead Hunting

Go to **Lead Hunter** page and enter:
- Industry: `SaaS`
- Location: `San Francisco`

Click "Search". This should generate 5 real leads via Gemini.

### 3.4 Test Campaign Creation

Go to **Campaigns** page:
- Create a new campaign
- Enter goal: `Increase brand awareness`

Should generate a real PRD with user stories.

---

## What Changed

### ✅ Backend (New)
- `/backend/src/routes/` - Real API endpoints
- `/backend/src/utils/` - Gemini, Supabase, Scraper helpers
- Uses real web scraping instead of CORS proxies
- Real Gemini API calls (no mocks)

### ✅ Frontend Changes
- `/src/lib/api.ts` - Real API client (replaces mock data)
- Uses backend exclusively
- No more `MOCK_LEADS`, `MOCK_BRAND_DNA`, etc.

### ✅ Environment
- `.env.local` files for both frontend and backend
- `VITE_API_URL` for frontend configuration
- `GEMINI_API_KEY` for backend

---

## Next Steps (Harder Stuff)

### Add Database (Supabase)

1. Sign up at https://supabase.com
2. Create new project
3. Copy credentials to `backend/.env.local`
4. Run migrations (TODO: create schema)

### Add Real Data Sources

Replace AI-only lead generation with:
- Hunter.io API (B2B emails)
- RocketReach API (Company data)
- LinkedIn API (Job changes)
- Google Trends API (Trending topics)

### Add Video Generation

Integrate with:
- Fal.ai (LTX-2)
- Luma.ai
- Kling API

### Production Deployment

- Deploy backend to Railway, Vercel, or custom server
- Deploy frontend to Vercel
- Set up environment variables on hosting platform
- Add monitoring and error tracking

---

## Troubleshooting

### "API is not responding"
- Check backend is running on port 3000
- Check `FRONTEND_URL` in backend `.env.local`

### "Gemini API key invalid"
- Verify key format (starts with `AIza...`)
- Try regenerating the key at https://ai.google.dev/

### "CORS errors"
- Make sure `VITE_API_URL` matches backend URL
- Backend CORS is configured to allow `FRONTEND_URL`

### "Scraping returns empty"
- Some sites block scrapers
- Try a different URL or more permissive site
- In production, use Puppeteer/Playwright

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│           Frontend (React + Vite)               │
│         http://localhost:1111                   │
│  ┌──────────────────────────────────────────┐   │
│  │  Pages: Extract, Leads, Campaigns, etc.  │   │
│  │  api.ts (calls backend only)             │   │
│  │  NO MOCKS                                │   │
│  └──────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────┘
                  │ HTTP (CORS)
                  │
┌─────────────────▼──────────────────────────────┐
│         Backend (Express + TypeScript)          │
│           http://localhost:3000                │
│  ┌──────────────────────────────────────────┐   │
│  │  /api/extract    → Scrape + Gemini       │   │
│  │  /api/leads      → AI Lead Generation    │   │
│  │  /api/campaigns  → Campaign PRD Gen      │   │
│  │  /api/videos     → Video Queue Mgmt      │   │
│  │  /api/trends     → Trend Fetching        │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌────────────────┐  ┌─────────────────────┐   │
│  │  Gemini API    │  │  Web Scraper        │   │
│  │  (Real)        │  │  (Real DOM parse)   │   │
│  └────────────────┘  └─────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Supabase (Optional - in-memory now)    │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Real vs Mock Comparison

| Feature | Before | After |
|---------|--------|-------|
| Brand Extraction | Mock Walmart | Real website scraping + Gemini |
| Leads | 3 hardcoded companies | AI-generated 5 leads per search |
| Campaigns | Mock data | Real PRD generation |
| Trends | Mock trends | AI-generated industry trends |
| Collaboration | In-memory mocks | (Prepared for WebSocket) |
| Data Storage | localStorage only | localStorage + Supabase ready |

All API calls now hit real backend with no fallbacks.
