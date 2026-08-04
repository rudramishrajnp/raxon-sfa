import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url().default('postgres://postgres:postgres@localhost:5432/postgres'),
  JWT_ACCESS_SECRET: z.string().min(10).default('default_jwt_access_secret_for_dev_only'),
  JWT_REFRESH_SECRET: z.string().min(10).default('default_jwt_refresh_secret_for_dev_only'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
