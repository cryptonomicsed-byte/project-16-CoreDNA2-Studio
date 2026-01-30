import dotenv from 'dotenv';
import path from 'path';

// Load .env FIRST
const envPath = path.join(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Routes
import extractRoutes from './routes/extract.js';
import leadsRoutes from './routes/leads.js';
import campaignRoutes from './routes/campaigns.js';
import videoRoutes from './routes/videos.js';
import trendsRoutes from './routes/trends.js';
import imagesRoutes from './routes/images.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:1111',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/extract', extractRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/images', imagesRoutes);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✓ CoreDNA Backend running on http://localhost:${PORT}`);
  console.log(`✓ Frontend target: ${process.env.FRONTEND_URL || 'http://localhost:1111'}`);
});
