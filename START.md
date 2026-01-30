# CoreDNA-369: Quick Start (5 minutes)

## Get Your Gemini API Key (2 min)

1. Go to https://ai.google.dev/
2. Click "Get API Key" 
3. Create new project or select default
4. Copy the key (looks like `AIza...`)

---

## Start Backend (1 min)

```bash
cd backend
npm install
cp .env.example .env.local
```

Edit `backend/.env.local`:
```
PORT=3000
GEMINI_API_KEY=paste_your_key_here
FRONTEND_URL=http://localhost:1111
```

```bash
npm run dev
```

You should see:
```
✓ CoreDNA Backend running on http://localhost:3000
```

**Leave this running.**

---

## Start Frontend (1 min)

New terminal:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit: **http://localhost:1111**

---

## Test It Works (1 min)

1. **Extract Page**: Enter `https://www.apple.com` → Click Extract
   - Should scrape the site and extract brand DNA
   
2. **Lead Hunter**: Enter Industry=`SaaS`, Location=`San Francisco` → Click Search
   - Should generate 5 real leads
   
3. **Campaigns**: Create campaign → Should generate PRD

Everything runs real now. No mocks.

---

## What's Different

| Feature | Old | New |
|---------|-----|-----|
| Brand extraction | Mock Walmart | Real scraping |
| Lead hunting | 3 hardcoded | AI-generated |
| Campaigns | Fake data | Real PRD |
| Data source | localStorage | Backend (Supabase ready) |
| API | Client-side stubs | Real HTTP calls |

---

## If Something Breaks

**Backend won't start?**
- Check Node version: `node --version` (need 18+)
- Check port 3000 is free
- Make sure Gemini key is set

**Frontend won't connect?**
- Check backend is running: `curl http://localhost:3000/health`
- Check `VITE_API_URL=http://localhost:3000/api` in frontend `.env.local`

**API calls fail?**
- Check Gemini API key is valid
- Try a simpler site (apple.com might block scrapers)

---

## Next Steps

- [ ] Connect Supabase for real data storage
- [ ] Add authentication
- [ ] Implement WebSocket for live collaboration
- [ ] Connect real lead data sources
- [ ] Deploy to production

See `REAL_SETUP.md` for full guide.
