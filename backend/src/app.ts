import express, { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import bookmarkRoutes from './routes/bookmarkRoutes';
import resumeRoutes from './routes/resumeRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Remote Work Hub API is running...' });
});

// Mounted Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/resumes', resumeRoutes);

// Sentry hook to capture unhandled errors
Sentry.setupExpressErrorHandler(app);

// Global fallback error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 FULL ERROR STACK:");
  console.error(err); // IMPORTANT
  console.error(err?.stack); // EVEN BETTER

  return res.status(500).json({
    success: false,
    message: err.message || "Unhandled Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
