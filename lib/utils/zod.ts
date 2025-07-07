import { ZodError } from "zod";


/**
 * Provides the first error from zod
 * @param error zod error object
 * @returns a string from very first error it encounters
 */
export function getFirstZodError<T>(error: ZodError<T>): string {
  const fieldErrors = error.flatten().fieldErrors;

  for (const [, errors] of Object.entries(fieldErrors)) {
    const messages = errors as string[];
    if (errors && messages.length > 0) {
      return messages[0];
    }
  }

  return "something went wrong";
}
