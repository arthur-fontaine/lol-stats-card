export const sumObject = <T extends Record<string, unknown>>(
  data: T[],
  keys: (keyof T)[]
): Partial<T> => {
  const result = {};

  const sums: Record<keyof T, number> = {} as Record<keyof T, number>;

  for (const key of keys) {
    sums[key] = 0;
  }

  for (const item of data) {
    for (const key of keys) {
      if (typeof item[key] === 'number') {
        sums[key] += item[key] as number;
      }
    }
  }

  for (const key of keys) {
    // @ts-expect-error
    result[key] = sums[key];
  }

  return result;
}