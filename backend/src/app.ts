import express, { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Remote Work Hub API is running...' });
});

// Mounted Routes
app.use('/api/auth', authRoutes);

// Sentry hook to capture unhandled errors
Sentry.setupExpressErrorHandler(app);

// Global fallback error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: 'Unhandled Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
