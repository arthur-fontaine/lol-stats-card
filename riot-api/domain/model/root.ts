import type { Effect } from "effect";
import type { RiotApiAccount } from "./account";
import type { RiotApi } from "../port/riot-api";

export interface RiotApiRoot {
  getAccount({ tag, name }: { tag: string; name: string }): Effect.Effect<RiotApiAccount, never, RiotApi>,
}
