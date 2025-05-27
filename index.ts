import { Effect, Ref } from "effect";
import { riftPipeline } from "./statistics/game-mode/rift-pipeline";
import { middlePositionPipeline } from "./statistics/position/middle";
import { RiotApiImpl } from "./riot-api/adapter/riot-api";
import { RiotApi } from "./riot-api/domain/port/riot-api";
import { StatisticsParamsState } from "./statistics/statistics-params";

const pipelines = {
  'game-mode/rift': riftPipeline,
  'position/middle': middlePositionPipeline,
} as const;

interface GetStatsForAccountParams {
  name: string;
  tag: string;
  pipelines: (keyof typeof pipelines)[];
}

const getStatsForAccount = (params: GetStatsForAccountParams) => Effect.Do.pipe(
  Effect.flatMap(() => makeStatisticsParamsStates(params.name, params.tag)),
  Effect.andThen((allStatisticsParams) =>
    Effect.forEach(allStatisticsParams, (statisticsParams) => Effect.Do.pipe(
      Effect.andThen(params.pipelines.includes('game-mode/rift') ? pipelines['game-mode/rift']() : Effect.succeed(undefined)),
      Effect.andThen(params.pipelines.includes('position/middle') ? pipelines['position/middle']() : Effect.succeed(undefined)),
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
  const results = await Effect.runPromise(getStatsForAccount({
    name: "Capsismyfather",
    tag: "CAPS",
    pipelines: ['game-mode/rift', 'position/middle']
  }));
  console.log("Results:", results);
}

main();
