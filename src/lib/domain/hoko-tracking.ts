const HOKO_TRACKING_BASE_URL = "https://hoko.to/OTa83BOY/analytics.js";

const normalizeTrackingValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const trackingContextFromPath = (pathname: string) => {
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, "");
  const content = normalizeTrackingValue(normalizedPath) || "skills-directory";

  if (normalizedPath === "") return { medium: "directory", content };
  if (normalizedPath === "recipes" || normalizedPath === "recipes.html") {
    return { medium: "recipe-directory", content };
  }
  if (normalizedPath.startsWith("skills/")) return { medium: "skill", content };
  if (normalizedPath.startsWith("recipes/") || normalizedPath === "recipe.html") {
    return { medium: "recipe", content };
  }

  return { medium: "site", content };
};

export const buildHokoTrackingScriptUrl = (pageUrl: URL) => {
  const context = trackingContextFromPath(pageUrl.pathname);
  const scriptUrl = new URL(HOKO_TRACKING_BASE_URL);

  scriptUrl.searchParams.set("utm_source", pageUrl.searchParams.get("utm_source") ?? "skills.lab.sa");
  scriptUrl.searchParams.set("utm_medium", pageUrl.searchParams.get("utm_medium") ?? context.medium);
  scriptUrl.searchParams.set("utm_campaign", pageUrl.searchParams.get("utm_campaign") ?? "discovery-site");
  scriptUrl.searchParams.set("utm_content", pageUrl.searchParams.get("utm_content") ?? context.content);

  const utmTerm = pageUrl.searchParams.get("utm_term");
  if (utmTerm) scriptUrl.searchParams.set("utm_term", utmTerm);

  const referral = pageUrl.searchParams.get("ref") ?? pageUrl.searchParams.get("referral");
  if (referral) scriptUrl.searchParams.set("ref", referral);

  return scriptUrl.toString();
};
