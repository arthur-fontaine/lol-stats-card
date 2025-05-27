import { Effect, Schema } from "effect";
import type { RiotApiAccount } from "../domain/model/account";
import { RiotApi } from "../domain/port/riot-api";

export const RiotApiAccountImpl = (tag: string, name: string) =>
  Effect.gen(function* () {
    const riotApi = yield* RiotApi;

    const endpoint = `riot/account/v1/accounts/by-riot-id/${name}/${tag}`;
    const schema = Schema.Struct({ puuid: Schema.String });
    const { puuid } = yield* riotApi.makeRequest(endpoint, schema);

    return {
      puuid,
      getPlayer: () => Effect.gen(function* () {
        const riotApi = yield* RiotApi;
        return yield* riotApi.Player(puuid);
      }),
    } satisfies RiotApiAccount;
  })
