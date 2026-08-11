import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Snippet } from "svelte";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithElementRef<T, Element extends HTMLElement = HTMLElement> = T & {
  ref?: Element | null;
};

export type WithoutChild<T> = Omit<T, "child">;
export type WithoutChildren<T> = Omit<T, "children">;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithChildren<T> = T & { children?: Snippet };
