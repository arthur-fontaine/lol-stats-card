import { Effect, Ref } from "effect";
import { StatisticsParamsState } from "../../statistics-params";
import { Skip } from "../../skip";
import { getGoldDifference } from "../../utils/get-gold-difference";
import { getVisionScorePerMinute } from "../../utils/get-vision-score-per-minute";
import { getKillParticipationAt14 } from "../../utils/get-kill-participation-at-14";
import { SupportPositionalStatistics } from "./support-positional-statistics";

export const supportPositionalPipeline = () => Effect.gen(function* () {
  const state = yield* StatisticsParamsState;
  const { match, account } = yield* Ref.get(state);
  
  const matchDetails = yield* match.getDetails();

  const playerInMatch = matchDetails.info.participants.find(p => p.puuid === account.puuid);
  if (!playerInMatch) {
    return yield* Effect.fail(new Error('Player not found in match details'));
  }

  if (playerInMatch.individualPosition !== 'UTILITY') {
    return yield* Effect.fail(new Skip());
  }

  const matchTimeline = yield* match.getTimeline();
  const frameAt14 = matchTimeline.info.frames[14];
  if (!frameAt14) {
    return yield* Effect.fail(new Error('Frame at 14 minutes not found in match timeline'));
  }

  const goldDifference = yield* Effect.try(() =>
    getGoldDifference(matchDetails, frameAt14, playerInMatch.participantId));
  
  const visionScorePerMinute = yield* Effect.try(() =>
    getVisionScorePerMinute(matchDetails, playerInMatch.participantId));

  const killParticipationAt14 = yield* Effect.try(() =>
    getKillParticipationAt14(matchDetails, frameAt14, playerInMatch.participantId));
  
  const isWin = yield* Effect.try(() =>
    matchDetails.info.participants.some(p => p.puuid === account.puuid && p.win))

    return new SupportPositionalStatistics({
    kp: playerInMatch.challenges.killParticipation,
    vspm: visionScorePerMinute,
    "kp@14": killParticipationAt14,
    "g@14": goldDifference,
    kda: playerInMatch.challenges.kda,
    win: isWin ? 1 : 0,
    loss: isWin ? 0 : 1,
    championName: playerInMatch.championName,
  })
})
