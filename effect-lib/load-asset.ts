import { Effect } from "effect";

export const loadAsset = (assetPath: string, basePath: string = '') =>
  Effect.tryPromise(() =>
    Bun.file(`${basePath}assets/${assetPath}`).arrayBuffer())
