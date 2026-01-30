# CoreDNA-369: Mock to Real Migration Plan

## Current Mock Data Points (To Remove)

### Services with Fallbacks:
1. **advancedScraperService.ts** - MOCK_LEADS (3 hardcoded companies)
2. **geminiService.ts** - MOCK_BRAND_DNA (Walmart example)
3. **rocketNewService.ts** - MOCK_TRENDS (hardcoded trend items)
4. **collaborationService.ts** - MOCK_USERS, MOCK_MESSAGES, MOCK_ACTIONS
5. **competitorAnalysisService.ts** - FALLBACK_TRIGGERED handlers
6. **simulationService.ts** - FALLBACK_TRIGGERED handlers
7. **siteGeneratorService.ts** - FALLBACK_TRIGGERED handlers
8. **rlmService.ts** - FALLBACK_TRIGGERED pass-through
9. **enhancedExtractionService.ts** - Heuristic fallback extraction
10. **universalAiService.ts** - FALLBACK_TRIGGERED return

## Migration Strategy

### Phase 1: Backend Infrastructure (THIS SESSION)
- [ ] Create Node.js/Express backend
- [ ] Set up Supabase database
- [ ] Implement real API endpoints
- [ ] Remove CORS proxy dependency
- [ ] Add authentication middleware

### Phase 2: Remove Mocks (AFTER BACKEND)
- [ ] Replace MOCK_LEADS with real API calls
- [ ] Replace MOCK_BRAND_DNA with Gemini-only (no fallback)
- [ ] Replace MOCK_TRENDS with actual data source
- [ ] Replace MOCK_USERS with real collaboration backend
- [ ] Remove all FALLBACK_TRIGGERED logic

### Phase 3: Real Data Sources
- [ ] Integrate actual lead databases (e.g., Hunter.io, RocketReach, LinkedIn)
- [ ] Wire up real web scraping (backend Puppeteer)
- [ ] Connect to real trend sources (Google Trends, HN, Twitter API)
- [ ] Implement WebSocket for live collaboration
- [ ] Add real file storage (S3/Cloudinary)

### Phase 4: Production Hardening
- [ ] Rate limiting
- [ ] Error handling and logging
- [ ] Analytics integration
- [ ] Payment processing
- [ ] Monitoring and alerts

---

## Immediate Action: Set Up Backend

### Stack Choice:
- **Runtime:** Node.js 18+
- **Framework:** Express.js (lightweight, proven)
- **Database:** Supabase (PostgreSQL + auth + storage)
- **Deployment:** Vercel (serverless), railway.app, or self-hosted

### Key Endpoints to Create:

```
POST /api/extract - Brand extraction (real Gemini)
POST /api/leads - Search/generate leads (real sources)
GET /api/trends - Fetch trending topics
POST /api/campaigns - Create campaigns
GET /api/campaigns/:id - Get campaign details
POST /api/collaboration/join - Join live session
WS /ws/collaboration/:sessionId - WebSocket for real-time
POST /api/videos - Generate video (with actual engines)
```

### Environment Variables Needed:
```
GEMINI_API_KEY
SUPABASE_URL
SUPABASE_KEY
HUNTER_API_KEY (or similar lead provider)
VIDEO_API_KEYS (Fal.ai, Luma, etc)
JWT_SECRET
DATABASE_URL
```

---

## Decision Points:

1. **Backend Location:** Same repo (monorepo) or separate?
   - Recommendation: Separate `backend/` folder for clarity

2. **Database:** Supabase vs Firebase vs custom?
   - Recommendation: Supabase (PostgreSQL, can use Prisma ORM)

3. **Lead Source:** AI-generated (Gemini only) or real data?
   - Recommendation: Hybrid - real data from APIs, AI enrichment

4. **Video Generation:** Keep stubbed or integrate real engines?
   - Recommendation: Queue system with async job processing

5. **Collaboration:** WebSocket or polling?
   - Recommendation: WebSocket with fallback to SSE
