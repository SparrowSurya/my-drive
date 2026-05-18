
export function isLoginRoute(path: string): boolean {
  return path?.split("?")?.[0]?.endsWith("login") ?? false;
}

export function isSigninRoute(path: string): boolean {
  return path?.split("?")?.[0]?.endsWith("signin") ?? false;
}