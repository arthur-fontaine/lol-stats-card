import { Effect } from "effect";

export const fetchEffect = (...args: Parameters<typeof fetch>) =>
  Effect.tryPromise((signal) =>
    fetch(args[0], { ...args[1], signal }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed with status ${res.status} ${res.statusText} - ${text}`);
      }
      return res;
    }),
  );
