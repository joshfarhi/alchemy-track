import { Units } from "@/lib/units";
import { z } from "zod";

export const UpdateUserUnitSchema = z.object({
  Unit: z.custom((value) => {
    const found = Units.some((c) => c.value === value);
    if (!found) {
      throw new Error(`invalid Unit: ${value}`);
    }

    return value;
  }),
});
