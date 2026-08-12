export const transferThresholds = Object.freeze({
  javascriptGzipBytes: 90 * 1024,
  javascriptRawBytes: 250 * 1024,
  cssGzipBytes: 35 * 1024,
  fontBytes: 300 * 1024,
  imageBytes: 100 * 1024,
  totalBytes: 500 * 1024,
  requests: 25,
});

const presentationKinds = new Set(["document", "font", "image", "script", "stylesheet"]);

export function evaluateTransferBudget({ route, origin, resources }) {
  const expectedOrigin = new URL(origin).origin;
  const unique = new Map();
  for (const resource of resources) {
    validateResource(resource);
    if (!unique.has(resource.url)) unique.set(resource.url, resource);
  }
  const values = [...unique.values()];
  const sum = (kind, field) => values
    .filter((resource) => resource.kind === kind)
    .reduce((total, resource) => total + resource[field], 0);
  const transfer = Object.freeze({
    javascriptRawBytes: sum("script", "rawBytes"),
    javascriptGzipBytes: sum("script", "gzipBytes"),
    cssGzipBytes: sum("stylesheet", "gzipBytes"),
    fontBytes: sum("font", "rawBytes"),
    imageBytes: sum("image", "rawBytes"),
    totalBytes: values.reduce((total, resource) => total + (resource.includedInDocument ? 0 : transferredBytes(resource)), 0),
  });
  const requests = values.filter((resource) => !resource.includedInDocument).length;
  const failures = [];
  for (const [metric, label] of [
    ["javascriptGzipBytes", "javascript-gzip"],
    ["javascriptRawBytes", "javascript-raw"],
    ["cssGzipBytes", "css-gzip"],
    ["fontBytes", "fonts"],
    ["imageBytes", "images"],
    ["totalBytes", "total-transfer"],
  ]) {
    if (transfer[metric] > transferThresholds[metric]) failures.push(label);
  }
  if (requests > transferThresholds.requests) failures.push("requests");
  if (values.some((resource) => presentationKinds.has(resource.kind) && new URL(resource.url).origin !== expectedOrigin)) {
    failures.push("third-party-presentation");
  }
  if (values.some((resource) => /\/(?:skills|recipes)\.json(?:$|[?#])/.test(new URL(resource.url).pathname))) {
    failures.push("runtime-catalog-fetch");
  }

  return Object.freeze({
    route,
    pass: failures.length === 0,
    requests,
    transfer,
    thresholds: transferThresholds,
    failures: Object.freeze(failures),
  });
}

function validateResource(resource) {
  new URL(resource.url);
  if (typeof resource.kind !== "string" || !resource.kind) throw new Error("Transfer resource kind is required");
  for (const field of ["rawBytes", "gzipBytes"]) {
    if (!Number.isFinite(resource[field]) || resource[field] < 0) {
      throw new Error(`Transfer resource ${field} must be a finite nonnegative number`);
    }
  }
}

function transferredBytes(resource) {
  return ["font", "image", "media"].includes(resource.kind) ? resource.rawBytes : resource.gzipBytes;
}
