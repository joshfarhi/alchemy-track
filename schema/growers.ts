import { z } from "zod";

export const CreateGrowerSchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(["income", "expense"]),
});

export type CreateGrowerSchemaType = z.infer<typeof CreateGrowerSchema>;

export const DeleteGrowerSchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(["income", "expense"]),
});

export type DeleteGrowerSchemaType = z.infer<typeof DeleteGrowerSchema>;