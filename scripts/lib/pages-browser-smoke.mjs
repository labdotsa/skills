import { resolvePagesPublication } from "./pages-deployment.mjs";
import { smokePublicationBrowser } from "./publication-browser-smoke.mjs";

export async function smokePagesBrowser({ deploymentUrl, profile }) {
  const publication = resolvePagesPublication(profile);
  const url = validateDeploymentUrl(deploymentUrl, publication);
  return smokePublicationBrowser({
    deploymentUrl: url.href,
    profile,
    basePath: publication.basePath,
    providerLabel: "GitHub Pages",
  });
}

function validateDeploymentUrl(value, publication) {
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error("Pages browser smoke deployment URL must use HTTPS", { cause: error });
  }
  if (url.protocol !== "https:") throw new Error("Pages browser smoke deployment URL must use HTTPS");
  if (url.pathname !== `${publication.basePath}/`) {
    throw new Error(`${publication.profile} browser smoke must use ${publication.basePath || "the root"}/`);
  }
  if (publication.profile === "pages-project" && url.origin !== "https://labdotsa.github.io") {
    throw new Error("pages-project browser smoke must use https://labdotsa.github.io/skills/");
  }
  if (publication.profile === "pages-root" && url.origin === "https://skills.lab.sa") {
    throw new Error("pages-root browser smoke must not replace the canonical Netlify origin");
  }
  return url;
}
