export const routes = {
  home: "/",
  work: "/work"
} as const;

export function workRoute(slug: string) {
  return `/work/${slug}`;
}
