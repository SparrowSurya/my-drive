import bcrypt from "bcrypt";
import crypto from "crypto";
import constants from "../constants";


export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(constants.saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function matchPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function hashEmail(email: string): string {
  return crypto.createHash(constants.deletedEmailHash).update(email).digest('hex');
}

export function formatTodeletedEmail(email: string): string {
  return `deleted+${hashEmail(email)}+${Date.now()}@deleted.local`;
}