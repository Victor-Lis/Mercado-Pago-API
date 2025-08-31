import z from "zod";

export const GetPreferenceSchema = z.object({
  payment_id: z
    .string()
    .meta({ example: "proc_123" }).or(z.number().meta({ example: 123 })),
});

export type GetPreferenceType = z.infer<typeof GetPreferenceSchema>;
