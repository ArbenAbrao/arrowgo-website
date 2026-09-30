// Same pattern as VMVAS: REACT_APP_API_URL drives the base URL.
import { fallbackLocations } from "./data/locations";
import { services as fallbackServices } from "./data/services";

export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// Falls back to bundled data so the site still renders if the API is unreachable.
export async function getLocations() {
  try { return await get("/locations"); } catch { return fallbackLocations; }
}
export async function getServices() {
  try { return await get("/services"); } catch { return fallbackServices; }
}
