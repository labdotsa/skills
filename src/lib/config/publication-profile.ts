export type PublicationProfileName = "canonical" | "preview" | "pages-project" | "pages-root";

export type PublicationProfile = Readonly<{
  name: PublicationProfileName;
  base: "" | "/skills";
  canonicalOrigin: "https://skills.lab.sa";
  indexable: boolean;
  publishMachineSurfaces: boolean;
}>;

const profiles = {
  canonical: {
    name: "canonical",
    base: "",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: true,
    publishMachineSurfaces: true,
  },
  preview: {
    name: "preview",
    base: "",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: false,
    publishMachineSurfaces: false,
  },
  "pages-project": {
    name: "pages-project",
    base: "/skills",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: false,
    publishMachineSurfaces: false,
  },
  "pages-root": {
    name: "pages-root",
    base: "",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: false,
    publishMachineSurfaces: false,
  },
} as const satisfies Record<PublicationProfileName, PublicationProfile>;

for (const profile of Object.values(profiles)) Object.freeze(profile);

export function publicationProfile(value: string | undefined): PublicationProfile {
  if (value === undefined || value.length === 0) {
    throw new Error("PUBLICATION_PROFILE is required");
  }

  if (!(value in profiles)) {
    throw new Error(`Unknown PUBLICATION_PROFILE: ${value}`);
  }

  return profiles[value as PublicationProfileName];
}
