"use server";

import prisma from "@/lib/prisma";
import {
  CreateStrainSchema,
  CreateStrainSchemaType,
  DeleteStrainSchema,
  DeleteStrainSchemaType,
} from "@/schema/strains";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function CreateStrain(form: CreateStrainSchemaType) {
  const parsedBody = CreateStrainSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;
  return await prisma.strain.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}

export async function DeleteStrain(form: DeleteStrainSchemaType) {
  const parsedBody = DeleteStrainSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.strain.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
