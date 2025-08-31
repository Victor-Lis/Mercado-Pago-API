import { z } from "zod";
import { config } from "dotenv";

config();

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3333),
  // MERCADO_PAGO_PAYMENTS_URL: z
  //   .string()
  //   .min(1, "Mercado Pago payments URL is required"),
  MERCADO_PAGO_ACCESS_TOKEN: z
    .string()
    .min(1, "Mercado Pago access token is required"),
  MERCADO_PAGO_WEBHOOK_URL: z
    .string()
    .min(1, "Mercado Pago webhook URL is required"),
  NGROK_AUTHTOKEN: z.string().min(1, "Ngrok authtoken is required"),
  MERCADO_PAGO_WEBHOOK_SECRET: z
    .string()
    .min(1, "Mercado Pago webhook secret is required"),
  NGROK_STATIC_DOMAIN: z
    .string()
    .min(1, "Ngrok static domain is required"),
});

export const env = envSchema.parse(process.env);