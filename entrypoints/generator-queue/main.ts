import { Effect, Option, pipe, Ref, Schema, Stream } from "effect";
import { StyleState } from "../../image-generator/style/style-state";
import { paletteColors } from "../../image-generator/style/palette-colors";
import { middlePositionalImgGenerator } from "../../statistics/position/middle/middle-positional-img-generator";
import { RiotApiImpl } from "../../effect-lib/riot-api/adapter/riot-api";
import { RiotApi } from "../../effect-lib/riot-api/domain/port/riot-api";
import { StatisticsParamsState } from "../../statistics/statistics-params";
import { pipelines } from "../../options";
import { Queue } from "../../effect-lib/queue/domain/port/queue";
import { RedisQueueImpl } from "../../effect-lib/queue/adapter/redis-queue";

async function main() {
  await pipe(
    Queue,
    Effect.flatMap(queue =>
      Stream.runForEach(
        queue.stream("treat-account"),
        (params) =>
          Schema.decodeUnknownOption(TreatAccountParams)(params)
            .pipe(Effect.flatMap(treatAccount))
      ),
    ),
    Effect.provideService(
      Queue,
      RedisQueueImpl({ queuePrefix: "queue" }),
    ),
    Effect.runPromise,
  )
}

export const TreatAccountParams = Schema.Struct({
  player: Schema.Struct({
    name: Schema.String,
    tag: Schema.String,
    imageUrl: Schema.String,
  }),
  paletteColor: Schema.Literal(...Object.keys(paletteColors) as (keyof typeof paletteColors)[]),
  pipelines: Schema.Array(Schema.Literal(...Object.keys(pipelines) as (keyof typeof pipelines)[])),
})

const treatAccount = (params: typeof TreatAccountParams.Type) =>
  Effect.Do.pipe(
    Effect.andThen(getStatsForAccount(params)),
    Effect.andThen(stats => [
      middlePositionalImgGenerator(stats, params.player),
    ]),
    Effect.andThen(
      Effect.forEach(imageOption =>
        Effect.succeed(Option.getOrUndefined(imageOption))
      )
    ),
    Effect.andThen(images => images.filter(image => image !== undefined)),
    Effect.andThen(Effect.all),
    Effect.provideServiceEffect(
      StyleState,
      Ref.make({
        palette: paletteColors[params.paletteColor],
      })
    )
  )

const getStatsForAccount = (params: typeof TreatAccountParams.Type) =>
  Effect.Do.pipe(
    Effect.flatMap(() => makeStatisticsParamsStates(params)),
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

const makeStatisticsParamsStates = (params: typeof TreatAccountParams.Type) =>
  Effect.gen(function* () {
    const riotApi = yield* RiotApi;

    const account = yield* riotApi.Account(params.player.tag, params.player.name);
    const player = yield* account.getPlayer();
    const matches = yield* player.getMatches();

    return matches.map(match => ({ match, account }));
  })

void main()
