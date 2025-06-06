export const meanObject = <T extends Record<string, unknown>>(
  data: T[],
  keys: (keyof T)[]
): Partial<T> => {
  const result = {};

  const counts: Record<keyof T, number> = {} as Record<keyof T, number>;
  const sums: Record<keyof T, number> = {} as Record<keyof T, number>;

  for (const key of keys) {
    counts[key] = 0;
    sums[key] = 0;
  }
  for (const item of data) {
    for (const key of keys) {
      if (typeof item[key] === 'number') {
        sums[key] += item[key] as number;
        counts[key] += 1;
      }
    }
  }

  for (const key of keys) {
    if (counts[key] > 0) {
      // @ts-expect-error
      result[key] = sums[key] / counts[key];
    } else {
      // @ts-expect-error
      result[key] = 0;
    }
  }

  console.debug("meanObject", { data, keys, result });

  return result;
}
