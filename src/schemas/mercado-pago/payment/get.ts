import z from "zod";

export const GetPaymentSchema = z.object({
  payment_id: z.string().meta({ example: "proc_123" }),
});

export type GetPaymentType = z.infer<typeof GetPaymentSchema>;