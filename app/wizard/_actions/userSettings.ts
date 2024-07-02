"use server";

import prisma from "@/lib/prisma";
import { UpdateUserUnitSchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function UpdateUserUnit(Unit: string) {
  const parsedBody = UpdateUserUnitSchema.safeParse({
    Unit,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      Unit,
    },
  });

  return userSettings;
}
