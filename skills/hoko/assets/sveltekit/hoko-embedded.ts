export type HokoCampaign = {
  shortId: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  referral?: string;
};

const present = (value: string | null | undefined) => value?.trim() || null;

export function buildHokoEmbeddedScriptUrl(pageUrl: URL, input: HokoCampaign) {
  const shortId = input.shortId.trim();
  const campaign = input.campaign.trim();
  if (!shortId || !campaign) {
    throw new Error("Hoko embedded tracking requires shortId and campaign");
  }

  const url = new URL(
    `https://hoko.to/${encodeURIComponent(shortId)}/analytics.js`,
  );
  url.searchParams.set(
    "utm_source",
    present(pageUrl.searchParams.get("utm_source")) ?? input.source,
  );
  url.searchParams.set(
    "utm_medium",
    present(pageUrl.searchParams.get("utm_medium")) ?? input.medium,
  );
  url.searchParams.set(
    "utm_campaign",
    present(pageUrl.searchParams.get("utm_campaign")) ?? campaign,
  );

  const content =
    present(pageUrl.searchParams.get("utm_content")) ?? present(input.content);
  const term =
    present(pageUrl.searchParams.get("utm_term")) ?? present(input.term);
  const referral =
    present(pageUrl.searchParams.get("ref")) ??
    present(pageUrl.searchParams.get("referral")) ??
    present(input.referral);

  if (content) url.searchParams.set("utm_content", content);
  if (term) url.searchParams.set("utm_term", term);
  if (referral) url.searchParams.set("ref", referral);

  return url;
}

export function hokoEmbeddedScriptElementId(shortId: string) {
  return `hoko-embedded-click-${shortId.trim()}`;
}
