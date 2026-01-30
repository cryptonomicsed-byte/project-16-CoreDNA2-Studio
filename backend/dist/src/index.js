"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env FIRST
const envPath = path_1.default.join(process.cwd(), '.env.local');
dotenv_1.default.config({ path: envPath });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Routes
const extract_js_1 = __importDefault(require("./routes/extract.js"));
const leads_js_1 = __importDefault(require("./routes/leads.js"));
const campaigns_js_1 = __importDefault(require("./routes/campaigns.js"));
const videos_js_1 = __importDefault(require("./routes/videos.js"));
const trends_js_1 = __importDefault(require("./routes/trends.js"));
const images_js_1 = __importDefault(require("./routes/images.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:1111',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/extract', extract_js_1.default);
app.use('/api/leads', leads_js_1.default);
app.use('/api/campaigns', campaigns_js_1.default);
app.use('/api/videos', videos_js_1.default);
app.use('/api/trends', trends_js_1.default);
app.use('/api/images', images_js_1.default);
// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        status: err.status || 500
    });
});
// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`✓ CoreDNA Backend running on http://localhost:${PORT}`);
    console.log(`✓ Frontend target: ${process.env.FRONTEND_URL || 'http://localhost:1111'}`);
});
//# sourceMappingURL=index.js.map