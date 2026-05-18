
export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
