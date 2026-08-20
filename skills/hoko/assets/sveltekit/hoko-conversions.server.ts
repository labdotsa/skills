import { env } from "$env/dynamic/private";

export type HokoLeadInput = {
  clickId: string;
  eventName: string;
  customerExternalId: string;
  customerName: string;
  customerEmail?: string | null;
  customerAvatar?: string | null;
  metadata?: Record<string, unknown>;
};

export type HokoConversionResult =
  | { ok: true; status: 201; data: unknown | null }
  | {
      ok: false;
      kind: "missing-attribution" | "configuration" | "network" | "http";
      status?: number;
      retryable: boolean;
    };

export async function trackHokoLead(
  input: HokoLeadInput,
): Promise<HokoConversionResult> {
  if (!input.clickId.trim()) {
    return { ok: false, kind: "missing-attribution", retryable: false };
  }

  const apiKey = env.HOKO_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, kind: "configuration", retryable: false };
  }

  try {
    const response = await fetch("https://hoko.to/api/track/lead", {
      method: "POST",
      signal: AbortSignal.timeout(5_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (response.status === 201) {
      return {
        ok: true,
        status: 201,
        data: await response.json().catch(() => null),
      };
    }

    return {
      ok: false,
      kind: "http",
      status: response.status,
      retryable: response.status === 429 || response.status >= 500,
    };
  } catch {
    return { ok: false, kind: "network", retryable: true };
  }
}
