import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  AIRALO_BASE_URL: z.string().url(),
  AIRALO_CLIENT_ID: z.string().min(1),
  AIRALO_CLIENT_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  CORS_ORIGIN: z.string().optional(),
  /** Path to the SQLite database file. Defaults to ./data/cellulo.db */
  DATABASE_PATH: z.string().optional(),
  /** How often (in milliseconds) to refresh packages from Airalo. Defaults to 6 hours. */
  PACKAGE_SYNC_INTERVAL_MS: z.coerce.number().positive().default(6 * 60 * 60 * 1000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
