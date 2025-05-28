import { Effect } from "effect";

export const loadAsset = (assetPath: string) =>
  Effect.tryPromise(() =>
    Bun.file(`assets/${assetPath}`).arrayBuffer())
