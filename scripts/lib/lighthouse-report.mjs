const requiredCategories = Object.freeze(["performance", "accessibility", "seo", "best-practices"]);
const requiredAudits = Object.freeze([
  "largest-contentful-paint",
  "cumulative-layout-shift",
  "total-blocking-time",
]);

export function lighthouseMetrics(lhr, context = "Lighthouse report") {
  const runtimeError = lhr?.runtimeError;
  const runtimeDetail = runtimeError?.code || runtimeError?.message
    ? ` Runtime error: ${runtimeError.code ?? "unknown"}: ${runtimeError.message ?? "no message"}.`
    : "";
  const score = (category) => {
    const value = lhr?.categories?.[category]?.score;
    if (typeof value !== "number") {
      throw new Error(`${context} is missing ${category} score.${runtimeDetail}`);
    }
    return value;
  };
  const numeric = (audit) => {
    const value = lhr?.audits?.[audit]?.numericValue;
    if (typeof value !== "number") {
      throw new Error(`${context} is missing ${audit}.${runtimeDetail}`);
    }
    return value;
  };

  return {
    performance: score(requiredCategories[0]),
    accessibility: score(requiredCategories[1]),
    seo: score(requiredCategories[2]),
    bestPractices: score(requiredCategories[3]),
    lcpMs: numeric(requiredAudits[0]),
    cls: numeric(requiredAudits[1]),
    tbtMs: numeric(requiredAudits[2]),
  };
}
