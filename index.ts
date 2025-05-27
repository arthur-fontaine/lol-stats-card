import { Effect, Ref } from "effect";
import { riftPipeline } from "./statistics/game-mode/rift-pipeline";
import { middlePositionPipeline } from "./statistics/position/middle";
import { RiotApiImpl } from "./riot-api/adapter/riot-api";
import { RiotApi } from "./riot-api/domain/port/riot-api";
import { StatisticsParamsState } from "./statistics/statistics-params";

const getStatsForAccount = (name: string, tag: string) => Effect.Do.pipe(
  Effect.flatMap(() => makeStatisticsParamsStates(name, tag)),
  Effect.andThen((allStatisticsParams) =>
    Effect.forEach(allStatisticsParams, (statisticsParams) => Effect.Do.pipe(
      Effect.andThen(riftPipeline),
      Effect.andThen(middlePositionPipeline),
      Effect.catchTag("Skip", () => Effect.succeed(undefined)),
      Effect.provideServiceEffect(StatisticsParamsState, Ref.make(statisticsParams))
    ))
  ),
  Effect.andThen((results) => results.filter((result) => result !== undefined)),
  Effect.provideService(RiotApi, RiotApiImpl({
    regions: ["europe", "euw1"],
    apiKey: process.env.RIOT_API_KEY!
  })),
)

const makeStatisticsParamsStates = (name: string, tag: string) => Effect.gen(function* () {
  const riotApi = yield* RiotApi;

  const account = yield* riotApi.Account(tag, name);
  const player = yield* account.getPlayer();
  const matches = yield* player.getMatches();

  return matches.map(match => ({ match, account }));
})

async function main() {
  const results = await Effect.runPromise(getStatsForAccount("Capsismyfather", "CAPS"));
  console.log("Results:", results);
}

main();
