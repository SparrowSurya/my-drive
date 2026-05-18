import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { formatTodeletedEmail, hashPassword } from "./auth";
import { assert } from "console";
import { sanitizeEmail, sanitizeName } from "../utils/sanitize";


export async function createUser(
  rawData: Prisma.UserCreateInput,
  select?: Prisma.UserSelect,
): Promise<Prisma.UserGetPayload<{ select?: Prisma.UserSelect }>> {
  assert(rawData.password !== null);
  const data = {
    ...rawData,
    name: sanitizeName(rawData.name?.trim() ?? ""),
    email: sanitizeEmail(rawData.email),
    password: await hashPassword(rawData.password!),
  }
  return await prisma.user.create({ data, select });
}

export async function getUniqueUser(
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect,
): Promise<Prisma.UserGetPayload<{ select?: Prisma.UserSelect }> | null> {
  return await prisma.user.findUnique({ where: { ...where, deletedAt: null }, select });
}

export async function updateUser(
  data: Prisma.UserUpdateInput,
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect,
): Promise<Prisma.UserGetPayload<{ select?: Prisma.UserSelect }>> {
  return await prisma.user.update({ data, where, select });
}

export async function deleteUser(
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect,
): Promise<Prisma.UserGetPayload<{ select?: Prisma.UserSelect }> | null> {
  const user = await getUniqueUser(where, { email: true });
  if (user === null) return null;

  const deletedEmail = formatTodeletedEmail(user.email);
  const data = { deletedAt: new Date(), email: deletedEmail };
  return await updateUser(data, where, select);
}
