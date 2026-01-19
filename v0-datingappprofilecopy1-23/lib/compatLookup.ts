import data from "@/generated/compat_20k.json";

export type CompatKey = `${string}-${string}__${string}-${string}`;

export function getCompat(aWest:string, aEast:string, bWest:string, bEast:string) {
  const key = `${aWest}-${aEast}__${bWest}-${bEast}` as CompatKey;
  return (data as any)[key] || null;
}


