export function countCharacters(text: string | null): number {
  if (!text) {
    return 0;
  }
  return text.length;
}
