import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { formatTodeletedEmail, hashPassword } from "./auth";
import { assert } from "console";
import { sanitizeEmail, sanitizeName } from "../utils/sanitize";


/** Singleton query interface for prisma queries for user(s). */
export default class UserQuery {

  /** Create new user. */
  static async create<S extends Prisma.UserSelect>(
    rawData: Prisma.UserCreateInput,
    select: S,
  ): Promise<Prisma.UserGetPayload<{ select: S }>> {
    assert(rawData.password !== null);
    const data = {
      ...rawData,
      name: sanitizeName(rawData.name?.trim() ?? ""),
      email: sanitizeEmail(rawData.email),
      password: await hashPassword(rawData.password!),
    }
    return await prisma.user.create({ data, select });
  }

  /** Read specific user safely. */
  static async readSafe<S extends Prisma.UserSelect>(
    where: Prisma.UserWhereUniqueInput,
    select: S,
  ): Promise<Prisma.UserGetPayload<{ select: S }> | null> {
    return await prisma.user.findUnique({
      where: { ...where, deletedAt: null },
      select,
    });
  }

  /** Update user detail. */
  static async update<S extends Prisma.UserSelect>(
    data: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput,
    select: S,
  ): Promise<Prisma.UserGetPayload<{ select: S }>> {
    return await prisma.user.update({ data, where, select });
  }

  /** Temporarily mark user as delete. */
  static async softDelete<S extends Prisma.UserSelect>(
    where: Prisma.UserWhereUniqueInput,
    select: S,
  ): Promise<Prisma.UserGetPayload<{ select: S }> | null> {
    const user = await this.readSafe(where, { email: true });
    if (user === null) return null;

    const deletedEmail = formatTodeletedEmail(user.email);
    const data = { deletedAt: new Date(), email: deletedEmail };
    return await this.update(data, where, select);
  }
}