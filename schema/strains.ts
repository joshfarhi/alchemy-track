import { z } from "zod";

export const CreateStrainSchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(["income", "expense"]),
});

export type CreateStrainSchemaType = z.infer<typeof CreateStrainSchema>;

export const DeleteStrainSchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(["income", "expense"]),
});

export type DeleteStrainSchemaType = z.infer<typeof DeleteStrainSchema>;
