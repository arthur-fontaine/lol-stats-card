import { Effect } from "effect";
import { RiotApi } from "../domain/port/riot-api";
import type { RiotApiMatch } from "../domain/model/match";
import { RiotMatchGetDetailsResponse } from "../domain/model/schemas/match/get-match-details";
import { RiotMatchGetTimelineResponse } from "../domain/model/schemas/match/get-timeline";

export const RiotApiMatchImpl = (matchId: string) => Effect.succeed<RiotApiMatch>({
  getDetails: () => Effect.gen(function* () {
    const riotApi = yield* RiotApi;

    const endpoint = `lol/match/v5/matches/${matchId}`;
    return yield* riotApi.makeRequest(endpoint, RiotMatchGetDetailsResponse);
  }),

  getTimeline: () => Effect.gen(function* () {
    const riotApi = yield* RiotApi;

    const endpoint = `lol/match/v5/matches/${matchId}/timeline`;
    return yield* riotApi.makeRequest(endpoint, RiotMatchGetTimelineResponse);
  }),
})
