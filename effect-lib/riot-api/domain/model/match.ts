import type { Effect } from "effect";
import type { RiotMatchGetDetailsResponse } from "../model/schemas/match/get-match-details";
import type { RiotMatchGetTimelineResponse } from "../model/schemas/match/get-timeline";
import type { UnknownException } from "effect/Cause";
import type { ParseError } from "effect/ParseResult";
import type { RiotApi } from "../port/riot-api";

export interface RiotApiMatch {
  getDetails(): Effect.Effect<typeof RiotMatchGetDetailsResponse.Type, UnknownException | ParseError, RiotApi>
  getTimeline(): Effect.Effect<typeof RiotMatchGetTimelineResponse.Type, UnknownException | ParseError, RiotApi>;
}
