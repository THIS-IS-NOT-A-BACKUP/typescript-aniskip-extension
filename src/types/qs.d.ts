declare module 'qs' {
  export function stringify(
    object: unknown,
    options?: { encodeValuesOnly?: boolean }
  ): string;
}
