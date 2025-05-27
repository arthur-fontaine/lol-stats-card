import type { RiotApi } from "../riot-api/riot-api";
import { type IStatistics } from "./mixins/base";
import { RiftStatisticsMixin } from "./mixins/game-mode/rift";
import { getGoldDifference } from "./utils/get-gold-difference";

export const MiddlePositionalStatistics = RiftStatisticsMixin(class implements IStatistics<{
  kp: number;
  dmg: number;
  soloKills: number;
  "k@14": number;
  kda: number;
}> {
  match: InstanceType<typeof RiotApi['Match']>;
  account: InstanceType<typeof RiotApi['Account']>;

  constructor(
    { match, account }: {
      match: InstanceType<typeof RiotApi['Match']>;
      account: InstanceType<typeof RiotApi['Account']>;
    }
  ) {
    this.match = match;
    this.account = account;
  }

  async fetchStats() {
    const matchDetails = await this.match.getDetails()

    const playerInMatch = matchDetails?.info.participants.find(p => p.puuid === this.account.puuid)
    if (playerInMatch === undefined) throw new Error('Player not found in match details');

    const matchTimeline = await this.match.getTimeline()

    return {
      kp: playerInMatch?.challenges.killParticipation,
      dmg: playerInMatch?.challenges.teamDamagePercentage,
      soloKills: playerInMatch?.challenges.soloKills,
      'k@14': getGoldDifference(matchDetails!, matchTimeline?.info.frames[14]!, playerInMatch!.participantId),
      kda: playerInMatch?.challenges.kda,
    }
  }

  async shouldSkip() {
    const matchDetails = await this.match.getDetails()

    const playerInMatch = matchDetails?.info.participants.find(p => p.puuid === this.account.puuid)
    if (playerInMatch === undefined) throw new Error('Player not found in match details');

    const isMiddlePosition = playerInMatch.individualPosition === 'MIDDLE';
    if (!isMiddlePosition) return true;
  }
});
