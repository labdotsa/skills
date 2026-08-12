import { smokePublicationBrowser } from "./publication-browser-smoke.mjs";

export async function smokeNetlifyBrowser({ origin, profile }) {
  if (!new Set(["canonical", "preview"]).has(profile)) {
    throw new Error(`Netlify browser smoke requires canonical or preview profile, received ${String(profile)}`);
  }
  const report = await smokePublicationBrowser({
    deploymentUrl: origin,
    profile,
    basePath: "",
    providerLabel: "Netlify",
  });
  return Object.freeze({
    origin: report.deploymentUrl,
    profile,
    routesVerified: report.routesVerified,
    interactionsVerified: report.interactionsVerified,
    remotePresentationRequests: report.remotePresentationRequests,
  });
}
