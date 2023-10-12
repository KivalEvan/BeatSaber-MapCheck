export function renameKey(obj: Record<string, unknown>, original: string, rename: string) {
   obj[rename] ??= obj[original];
   delete obj[original];
}
