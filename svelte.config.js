import adapter from "@sveltejs/adapter-static";
import { publicationProfile } from "./src/lib/config/publication-profile.ts";

const publication = publicationProfile(process.env.PUBLICATION_PROFILE);
const outputDirectory = process.env.PUBLICATION_OUTPUT || "site";

if (outputDirectory.startsWith("/") || outputDirectory.split(/[\\/]/).includes("..")) {
  throw new Error("PUBLICATION_OUTPUT must stay inside the repository");
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: outputDirectory,
      assets: outputDirectory,
      strict: true,
    }),
    paths: {
      base: publication.base,
      relative: true,
    },
    inlineStyleThreshold: 75_000,
  },
};

export default config;
