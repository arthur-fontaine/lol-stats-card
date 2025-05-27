import { Effect } from "effect";

export const fetchEffect = (...args: Parameters<typeof fetch>) =>
  Effect.tryPromise((signal) =>
    fetch(args[0], { ...args[1], signal }).then((res) => {
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      return res;
    }),
  );
