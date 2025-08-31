import z from "zod";

export const PaymentWebhookSchema = z.object({
  action: z.string().meta({ example: "Payment action" }),
  api_version: z.string().meta({ example: "v1" }),
  data: z.object({
    id: z.string().meta({ example: "123456" }),
  }),
  date_created: z
    .string()
    .transform((date) => new Date(date))
    .meta({ example: "2021-11-01T02:02:02Z" }),
  id: z.string().meta({ example: "123456" }),
  live_mode: z.boolean().meta({ example: false }),
  type: z.enum(["payment"]).meta({ example: "payment" }),
  user_id: z.number().meta({ example: 2049564114 }),
});

export type PaymentWebhookType = z.infer<typeof PaymentWebhookSchema>;

export const PaymentSignatureSchema = z.object({
  "x-signature": z.string().meta({ example: "ts=...,v1=..." }),
  "x-request-id": z.string().meta({ example: "unique-request-id" }),
});

export type PaymentSignatureType = z.infer<typeof PaymentSignatureSchema>;