import z from "zod";

export const GetPreferenceSchema = z.object({
  preference_id: z
    .string()
    .meta({ example: "proc_123" }),
});

export type GetPreferenceType = z.infer<typeof GetPreferenceSchema>;
