import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url().optional(), 
  JWT_SECRET: z.string().min(10).optional(),
  SENTRY_DSN: z.string().url().optional(),
  REMOTIVE_API_BASE: z.string().url().default('https://remotive.com/api/remote-jobs'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const unifiedConfig = _env.data;
