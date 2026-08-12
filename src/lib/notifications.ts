export type NotificationKind = "success" | "error";

export function notify(kind: NotificationKind, message: string) {
	window.dispatchEvent(new CustomEvent("lab:notification", { detail: { kind, message } }));
}
