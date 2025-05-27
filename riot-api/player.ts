import { ArkErrors, type } from "arktype";
import type { RiotAccount } from "./account";
import type { RiotApi } from "./riot-api";
import { RiotMatch } from "./match";

export class RiotPlayer {

  #riotApi: RiotApi;
  #account: RiotAccount;

  constructor(riotApi: RiotApi, account: RiotAccount) {
    this.#riotApi = riotApi;
    this.#account = account;
  }

  async getData() {
    const endpoint = `lol/challenges/v1/player-data/${this.#account.puuid}`;
    const schema = type({
      challenges: type({
        challengeId: 'number',
        percentile: 'number',
        level: 'string',
        value: 'number',
        'achievedTime?': 'number',
      }).array(),
      totalPoints: {
        level: 'string',
        current: 'number',
        max: 'number',
        percentile: 'number',
      },
    });
    const res = await this.#riotApi.makeRequest({ endpoint, schema });
    if (res instanceof ArkErrors) throw res[0]?.message;
    return res;
  }

  async getChampionMasteries() {
    const endpoint = `lol/champion-mastery/v4/champion-masteries/by-puuid/${this.#account.puuid}`;
    const schema = type({
      championId: 'number',
      championLevel: 'number',
      championPoints: 'number',
    }).array();
    const res = await this.#riotApi.makeRequest({ endpoint, schema });
    if (res instanceof ArkErrors) throw res;
    return res;
  }

  async getMatches({}) {
    const endpoint = `lol/match/v5/matches/by-puuid/${this.#account.puuid}/ids`;
    const schema = type.string.array();
    const res = await this.#riotApi.makeRequest({ endpoint, schema });
    if (res instanceof ArkErrors) throw res;
    return res.map(matchId => new RiotMatch(this.#riotApi, matchId));
  }

}
