import prisma from "@/lib/prisma";
import {
  CreateGrowerSchema,
  CreateGrowerSchemaType,
  DeleteGrowerSchema,
  DeleteGrowerSchemaType,
} from "@/schema/growers";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function CreateGrower(form: CreateGrowerSchemaType) {
  const parsedBody = CreateGrowerSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;
  return await prisma.grower.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}

export async function DeleteGrower(form: DeleteGrowerSchemaType) {
  const parsedBody = DeleteGrowerSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.grower.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}