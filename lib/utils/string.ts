
export const slugify = (s: string): string => {
  return s.toLowerCase().replaceAll(" ", "-");
};
