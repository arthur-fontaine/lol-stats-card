import { Effect } from "effect"
import type { RiotPlayerGetDataResponse } from "./schemas/player/get-data"
import type { RiotPlayerGetChampionsMasteriesResponse } from "./schemas/player/get-champion-masteries"
import type { RiotApiMatch } from "./match"
import type { UnknownException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { RiotApi } from "../port/riot-api"

export interface RiotApiPlayer {
  getData(): Effect.Effect<typeof RiotPlayerGetDataResponse.Type, UnknownException | ParseError, RiotApi>
  getChampionsMasteries(): Effect.Effect<typeof RiotPlayerGetChampionsMasteriesResponse.Type, UnknownException | ParseError, RiotApi>
  getMatches(): Effect.Effect<RiotApiMatch[], UnknownException | ParseError, RiotApi>
}
