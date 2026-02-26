import type { CalculatorInputs } from "./types";
import { getDefaultInputs } from "./calculator";

/**
 * Codifica el estado de la calculadora en un string para URL
 */
export function encodeState(inputs: CalculatorInputs): string {
  try {
    const json = JSON.stringify(inputs);
    // Usar base64 para comprimir
    if (typeof window !== "undefined") {
      return btoa(encodeURIComponent(json));
    }
    return Buffer.from(json).toString("base64");
  } catch (error) {
    console.error("Error encoding state:", error);
    return "";
  }
}

/**
 * Decodifica el estado de la calculadora desde URL
 */
export function decodeState(encoded: string): CalculatorInputs | null {
  try {
    let json: string;
    if (typeof window !== "undefined") {
      json = decodeURIComponent(atob(encoded));
    } else {
      json = Buffer.from(encoded, "base64").toString();
    }
    const parsed = JSON.parse(json);
    // Validar estructura básica
    if (parsed && typeof parsed === "object" && "produccion" in parsed) {
      return parsed as CalculatorInputs;
    }
    return null;
  } catch (error) {
    console.error("Error decoding state:", error);
    return null;
  }
}

/**
 * Genera URL compartible con el estado actual
 */
export function generateShareUrl(inputs: CalculatorInputs): string {
  const encoded = encodeState(inputs);
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.set("state", encoded);
    return url.toString();
  }
  return `?state=${encoded}`;
}

/**
 * Lee el estado desde la URL actual
 */
export function readStateFromUrl(): CalculatorInputs | null {
  if (typeof window === "undefined") return null;
  
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("state");
  
  if (!encoded) return null;
  
  return decodeState(encoded);
}

/**
 * Limpia el estado de la URL
 */
export function clearUrlState(): void {
  if (typeof window === "undefined") return;
  
  const url = new URL(window.location.href);
  url.searchParams.delete("state");
  window.history.replaceState({}, "", url.toString());
}
