export const REPRESENTATIVE_SCOPES = Object.freeze([
  "canonical|home",
  "canonical|skill",
  "canonical|recipe-index",
  "canonical|recipe",
  "canonical|not-found",
  "pages-project|home",
  "pages-project|skill",
  "pages-project|recipe-index",
  "pages-project|recipe",
  "pages-project|not-found",
]);

export const MANUAL_CHECK_IDS = Object.freeze([
  "keyboard",
  "zoom-200",
  "zoom-400",
  "forced-colors",
  "voiceover-safari",
  "nvda-browser",
]);

export function validateFieldEvidence(value) {
  const errors = [];
  if (!value || typeof value !== "object") throw new Error("Field evidence must be an object");
  if (value.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (!isHttpsOrigin(value.origin)) errors.push("origin must be an HTTPS origin");
  if (!isIsoDate(value.checkedAt)) errors.push("checkedAt must be an ISO timestamp");
  if (typeof value.source !== "string" || value.source.length < 3) errors.push("source is required");
  if (value.status === "no-data") {
    if (typeof value.reason !== "string" || value.reason.length < 30) errors.push("no-data reason is required");
  } else if (value.status === "reported") {
    if (value.windowDays !== 28 || value.percentile !== 75) errors.push("reported field data must be 28-day p75");
    for (const device of ["mobile", "desktop"]) validateVitals(value.devices?.[device], device, errors);
  } else {
    errors.push("status must be no-data or reported");
  }
  if (errors.length) throw new Error(`Invalid field evidence: ${errors.join("; ")}`);
  return deepFreeze(structuredClone(value));
}

export function validateManualEvidence(value) {
  const errors = [];
  if (!value || typeof value !== "object") throw new Error("Manual quality evidence must be an object");
  if (value.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (!/^[0-9a-f]{40}$/.test(value.testedRevision ?? "")) errors.push("testedRevision must be a full commit SHA");
  const checks = Array.isArray(value.checks) ? value.checks : [];
  const checkIds = checks.map((check) => check?.id);
  for (const id of MANUAL_CHECK_IDS) {
    const matches = checks.filter((check) => check?.id === id);
    if (matches.length !== 1) {
      errors.push(`${id} must appear exactly once`);
      continue;
    }
    validateManualCheck(matches[0], errors);
  }
  for (const id of checkIds) {
    if (!MANUAL_CHECK_IDS.includes(id)) errors.push(`unknown manual check ${String(id)}`);
  }
  if (errors.length) throw new Error(`Manual quality evidence is incomplete: ${errors.join("; ")}`);
  return deepFreeze(structuredClone(value));
}

function validateManualCheck(check, errors) {
  if (check.status !== "pass") errors.push(`${check.id} is ${check.status ?? "missing"}, not pass`);
  if (typeof check.tester !== "string" || check.tester.length < 2) errors.push(`${check.id} tester is required`);
  if (!isIsoDate(check.testedAt)) errors.push(`${check.id} testedAt must be an ISO timestamp`);
  if (typeof check.environment !== "string" || check.environment.length < 8) errors.push(`${check.id} environment is required`);
  const coverage = Array.isArray(check.coverage) ? check.coverage : [];
  const scopes = coverage.map((entry) => entry?.scope);
  for (const scope of REPRESENTATIVE_SCOPES) {
    const matches = coverage.filter((entry) => entry?.scope === scope);
    if (matches.length !== 1) {
      errors.push(`${check.id} must cover ${scope} exactly once`);
      continue;
    }
    const entry = matches[0];
    if (entry.status !== "pass") errors.push(`${check.id} ${scope} is not pass`);
    for (const field of ["journey", "expected", "actual"]) {
      if (typeof entry[field] !== "string" || entry[field].length < 12) errors.push(`${check.id} ${scope} ${field} is required`);
    }
    if (entry.issue !== null && !isHttpUrl(entry.issue)) errors.push(`${check.id} ${scope} issue must be null or an HTTP URL`);
  }
  for (const scope of scopes) {
    if (!REPRESENTATIVE_SCOPES.includes(scope)) errors.push(`${check.id} has unknown scope ${String(scope)}`);
  }
}

function validateVitals(value, device, errors) {
  if (!value || typeof value !== "object") {
    errors.push(`${device} field metrics are required`);
    return;
  }
  for (const metric of ["lcpMs", "inpMs", "cls"]) {
    if (!Number.isFinite(value[metric]) || value[metric] < 0) errors.push(`${device} ${metric} must be nonnegative`);
  }
}

function isHttpsOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.origin === value && url.pathname === "/";
  } catch {
    return false;
  }
}

function isHttpUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
