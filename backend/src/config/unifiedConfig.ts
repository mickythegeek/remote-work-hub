import { z } from 'zod';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables.
// Supports both `.env` (standard) and `env` (this repo currently uses `backend/env`).
const envCandidates = ['.env', 'env'].map((p) => path.resolve(process.cwd(), p));
const envPath = envCandidates.find((p) => fs.existsSync(p));
dotenv.config(envPath ? { path: envPath } : undefined);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  // Prisma requires DATABASE_URL at runtime; fail fast with a clear error.
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  SENTRY_DSN: z.string().url().optional(),
  REMOTIVE_API_BASE: z.string().url().default('https://remotive.com/api/remote-jobs'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const unifiedConfig = _env.data;
