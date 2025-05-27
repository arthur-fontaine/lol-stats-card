import { RiotPlayer } from "./player";
import type { RiotApi } from "./riot-api";

export class RiotAccount {

  #riotApi: RiotApi;
  puuid: string;

  constructor(riotApi: RiotApi, puuid: string) {
    this.puuid = puuid;
    this.#riotApi = riotApi;
  }

  async getPlayer() {
    return new RiotPlayer(this.#riotApi, this);
  }

}
