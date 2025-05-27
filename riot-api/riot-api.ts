import { ArkErrors, type, type Type } from 'arktype';
import { RiotAccount } from './account';
import { RiotPlayer } from './player';
import { RiotMatch } from './match';

export class RiotApi {

  #regions = ['europe', 'euw1'];
  #apiKey = process.env.RIOT_API_KEY!;

  makeRequest = async <T extends Type>({ endpoint, schema }: { endpoint: string; schema: T }): Promise<ReturnType<T>> => {
    for (const region of this.#regions) {
      const url = `https://${region}.api.riotgames.com/${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'X-Riot-Token': this.#apiKey,
        },
      });
      if (!response.ok) continue;
      const data = await response.json();
      return schema(data) as ReturnType<T>;
    }
    throw new Error('No valid region found or API key is invalid');
  }

  getAccount = async ({ tag, name }: { tag: string; name: string }) => {
    const endpoint = `riot/account/v1/accounts/by-riot-id/${name}/${tag}`;
    const schema = type({ puuid: 'string' });
    const res = await this.makeRequest({ endpoint, schema });
    if (res instanceof ArkErrors) throw res[0];
    return new RiotApi.Account(this, res.puuid);
  }

  static Account = RiotAccount;
  static Player = RiotPlayer;
  static Match = RiotMatch;

}
