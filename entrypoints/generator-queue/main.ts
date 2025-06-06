import { Chunk, Console, Effect, Option, pipe, Ref, Schema, Stream } from "effect";
import fsDriver from "unstorage/drivers/fs";
import { Storage } from "../../effect-lib/unstorage/domain/port/storage";
import { StyleState } from "../../image-generator/style/style-state";
import { paletteColors } from "../../image-generator/style/palette-colors";
import { middlePositionalImgGenerator } from "../../statistics/position/middle/middle-positional-img-generator";
import { supportPositionalImgGenerator } from "../../statistics/position/support/support-positional-img-generator";
import { topPositionalImgGenerator } from "../../statistics/position/top/top-positional-img-generator";
import { bottomPositionalImgGenerator } from "../../statistics/position/bottom/bottom-positional-img-generator";
import { junglePositionalImgGenerator } from "../../statistics/position/jungle/jungle-positional-img-generator";
import { RiotApiImpl } from "../../riot-api/adapter/riot-api";
import { RiotApi } from "../../riot-api/domain/port/riot-api";
import { StatisticsParamsState } from "../../statistics/statistics-params";
import { pipelines } from "../../options";
import { Queue } from "../../effect-lib/queue/domain/port/queue";
import { RedisQueueImpl } from "../../effect-lib/queue/adapter/redis-queue";
import { UnstorageImpl } from "../../effect-lib/unstorage/adapter/unstorage";
import { TreatAccountParams } from "./treat-account-params";

async function main() {
  await pipe(
    Queue,
    Effect.flatMap(queue => Stream.runForEach(
      pipe(
        queue.stream("treat-account"),
        Stream.map(Schema.decodeUnknownSync(TreatAccountParams)),
      ),
      (params) => pipe(
        Effect.succeed(params),
        Effect.andThen(treatAccount(params)),
        Effect.andThen(Effect.forEach(saveImage(params.player))),
      )
    )),
    Effect.provideService(
      Queue,
      RedisQueueImpl({ queuePrefix: "queue" }),
    ),
    Effect.provideService(
      Storage,
      UnstorageImpl({ driver: fsDriver({ base: "./.storage" }) }),
    ),
    Effect.runPromise,
  )
}

const treatAccount = (params: typeof TreatAccountParams.Type) =>
  Effect.Do.pipe(
    Effect.andThen(getStatsForAccount(params)),
    Effect.andThen(stats => [
      middlePositionalImgGenerator(stats, { ...params.player, position: "mid" }),
      supportPositionalImgGenerator(stats, { ...params.player, position: "support" }),
      topPositionalImgGenerator(stats, { ...params.player, position: "top" }),
      bottomPositionalImgGenerator(stats, { ...params.player, position: "bottom" }),
      junglePositionalImgGenerator(stats, { ...params.player, position: "jungle" }),
    ]),
    Effect.andThen(Effect.forEach(imageOption =>
      Effect.succeed(Option.getOrUndefined(imageOption)))),
    Effect.andThen(images => images.filter(image => image !== undefined)),
    Effect.andThen(Effect.all),
    Effect.tap(images => Console.log(`Generated images for ${params.player.name}#${params.player.tag}:`, images)),
    Effect.provideServiceEffect(
      StyleState,
      Ref.make({
        palette: paletteColors[params.paletteColor],
      })
    )
  )

const saveImage = (player: { name: string; tag: string; imageUrl: string }) =>
  (image: Buffer) =>
    Effect.gen(function* () {
      const storage = yield* Storage;

      const fileName = `${player.name}-${player.tag}:${Date.now()}.png`;
      yield* Effect.tryPromise(() => storage.setItem(fileName, image));
    })

const getStatsForAccount = (params: typeof TreatAccountParams.Type) =>
  Effect.Do.pipe(
    Effect.flatMap(() => makeStatisticsParamsStates(params)),
    Effect.andThen((allStatisticsParams) =>
      Effect.forEach(allStatisticsParams, (statisticsParams) =>
        Effect.forEach(
          (Object.keys(pipelines) as Array<keyof typeof pipelines>).filter((pipelineKey) => params.pipelines.includes(pipelineKey)),
          (pipelineKey) => Effect.Do.pipe(
            Effect.andThen(pipelines['game-mode/rift']()),
            Effect.andThen(pipelines[pipelineKey]()),
            Effect.catchTag("Skip", () => Effect.void),
            Effect.catchAll((err) => Console.error(`Error processing account ${params.player.name}#${params.player.tag} for pipeline ${pipelineKey}:`, err)),
            Effect.provideServiceEffect(StatisticsParamsState, Ref.make(statisticsParams))
          ))
      )
    ),
    Effect.andThen((results) => results.flat()),
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

    const { from: startTime, to: endTime } = params.dateRange;
    const MAX_RANGE_DAYS = 14;
    if (startTime.getTime() >= endTime.getTime()) {
      throw new Error("Invalid date range: 'from' date must be before 'to' date.");
    }
    if (endTime.getTime() - startTime.getTime() > MAX_RANGE_DAYS * 24 * 60 * 60 * 1000) {
      throw new Error(`Date range cannot be more than ${MAX_RANGE_DAYS} days`);
    }

    const matchesChunk = yield* Stream.runCollect(player.iterateMatches({
      startTime: Math.round(startTime.getTime() / 1000),
      endTime: Math.round(endTime.getTime() / 1000),
    }))
    const matches = Chunk.toArray(matchesChunk);

    return matches.map(match => ({ match, account }));
  })

void main()
