export const FIRST_LOAD_KEY = "portfolio-first-load-complete";

export function hasCompletedFirstLoad() {
  return typeof window !== "undefined" && sessionStorage.getItem(FIRST_LOAD_KEY) === "true";
}

export function markFirstLoadComplete() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(FIRST_LOAD_KEY, "true");
  }
}
