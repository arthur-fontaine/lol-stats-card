import { Effect } from "effect"
import type { RiotApiPlayer } from "./player";
import type { RiotApi } from "../port/riot-api";

export interface RiotApiAccount {
  puuid: string;
  getPlayer(): Effect.Effect<RiotApiPlayer, never, RiotApi>,
}
