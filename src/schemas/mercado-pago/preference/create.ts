import { z } from 'zod'

export const CreatePreferenceSchema = z.object({
  id: z.string().meta({ example: "proc_123" }),
  description: z.string().meta({ example: "Preference Description" }),
  quantity: z.int().meta({ example: 2 }),
  unit_price: z.float32().meta({ example: 0.01 }),
});

export type CreatePreferenceType = z.infer<typeof CreatePreferenceSchema>;