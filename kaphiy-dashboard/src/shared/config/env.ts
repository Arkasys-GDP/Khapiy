import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SOCKET_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("KAPHIY Cocina"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

const serverSchema = clientSchema.extend({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const raw = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NODE_ENV: process.env.NODE_ENV,
};

const isServer = typeof window === "undefined";
const parsed = (isServer ? serverSchema : clientSchema).safeParse(raw);

if (!parsed.success) {
  console.error("❌ Invalid env:", z.treeifyError(parsed.error));
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export type Env = typeof env;
