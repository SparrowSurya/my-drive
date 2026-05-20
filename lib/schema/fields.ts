import { z } from "zod";
import constants from "../constants";

export const username = z
  .string()
  .trim()
  .min(constants.minUsernameLength, `Username must be atleast ${constants.minUsernameLength} characters`)
  .max(constants.maxUsernameLength, `Username must be atmax ${constants.maxUsernameLength} characters`)
  .regex(constants.usernameRegex, "Username should consist of letters, digits, space, hypen and underscores")
  .transform(name => name.replace(/\s+/g, ' '));
export const email = z.string().trim().toLowerCase().email();
export const password = z
  .string()
  .trim()
  .min(constants.minPasswordLength, `password should contains atleast ${constants.minPasswordLength} characters`)
  .max(constants.maxPasswordLength, `password should contains atmax ${constants.maxPasswordLength} characters`);

export const fileName = z.string().trim();
export const fileId = z.number({ coerce: true });

export const folderName = z.string().trim();
export const folderId = z.number({ coerce: true });

export const file = z.custom<File>((val) => {
  return typeof File !== "undefined" && val instanceof File;
}, "Invalid file");

export const relativePath = z.string().trim().transform(path => {
  const segments = path.split("/");
  segments.pop();
  return segments;
});
