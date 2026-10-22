import http from "node:http";
import { URL } from "node:url";

const TOKENS = new Map([
  ["alice-token", "alice"],
  ["bob-token", "bob"]
]);

const DOCUMENTS = new Map([
  ["alice-plan", { owner: "alice", body: "Alice synthetic plan" }],
  ["bob-notes", { owner: "bob", body: "Bob synthetic notes" }]
]);

function send(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(body) });
  response.end(body);
}

function bearer(request) {
  const value = request.headers.authorization ?? "";
  if (!value.startsWith("Bearer ")) return undefined;
  return TOKENS.get(value.slice(7));
}

function documentResponse(response, id, caller, requireAuth) {
  const document = DOCUMENTS.get(id);
  if (!document) return send(response, 404, { error: "document not found" });
  if (requireAuth && caller === undefined) return send(response, 401, { error: "missing or invalid bearer token" });
  if (caller !== document.owner) return send(response, 403, { error: "forbidden" });
  return send(response, 200, { id, ...document });
}

export function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const match = url.pathname.match(/^\/(?:(v1)\/)?(?:(safe)\/)?documents\/([^/]+)$/);
    if (!match || request.method !== "GET") return send(response, 404, { error: "not found" });

    const id = match[3];
    const isSecure = match[2] === "safe";
    const caller = bearer(request);
    if (isSecure) return documentResponse(response, id, caller, true);
    if (caller === undefined) return documentResponse(response, id, caller, true);
    const selectedOwner = url.searchParams.has("as") ? url.searchParams.get("as") : caller;
    return documentResponse(response, id, selectedOwner, true);
  });
}

export function legacyLookup(table, value) {
  return `SELECT * FROM ${table} WHERE id = '${value}'`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  server.listen(0, "127.0.0.1", () => {
    const address = server.address();
    process.stdout.write(JSON.stringify({ host: address.address, port: address.port }) + "\n");
  });
}
