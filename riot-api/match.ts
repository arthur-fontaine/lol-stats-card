import { ArkErrors, type } from "arktype";
import type { RiotApi } from "./riot-api";

export class RiotMatch {

  #riotApi: RiotApi;
  #matchId: string;

  constructor(riotApi: RiotApi, matchId: string) {
    this.#riotApi = riotApi;
    this.#matchId = matchId;
  }

  async getDetails() {
    const endpoint = `lol/match/v5/matches/${this.#matchId}`;
    const schema = type({
      metadata: {},
      info: {
        gameMode: 'string',
        participants: type({
          puuid: 'string',
          role: 'string',
          assists: 'number',
          deaths: 'number',
          kills: 'number',
          lane: 'string',
          individualPosition: 'string',
          champLevel: 'number',
          championName: 'string',
          championId: 'number',
          participantId: 'number',
          challenges: {
            killParticipation: 'number',
            kda: 'number',
            soloKills: 'number',
            teamDamagePercentage: 'number',
          },
        }).array(),
      },
    });
    const res = await this.#riotApi.makeRequest({ endpoint, schema });
    if (res instanceof ArkErrors) throw res[0]?.message;
    return res;
  }

  async getTimeline() {
    const endpoint = `lol/match/v5/matches/${this.#matchId}/timeline`;
    const schema = type({
      info: {
        frameInterval: 'number',
        frames: type({
          participantFrames: type({
            '[string]': {
              currentGold: 'number',
              xp: 'number',
              participantId: 'number',
            }
          }),
        }).array(),
      },
      metadata: {},
    });
    const res = await this.#riotApi.makeRequest({ endpoint, schema });
    if (res instanceof ArkErrors) throw res[0]?.message;
    return res;
  }

}
