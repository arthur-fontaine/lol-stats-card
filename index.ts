import { RiotApi } from "./riot-api/riot-api";
import { MeanStatistics } from "./statistics/mean";
import { MiddlePositionalStatistics } from "./statistics/middle";

const riotApi = new RiotApi()

const account = await riotApi.getAccount({ tag: 'CAPS', name: 'Capsismyfather' })
const player = await account.getPlayer()

const matches = await player.getMatches({})

// for (const match of matches) {
//   const stats = await new MiddlePositionalStatistics({ match, account }).fetchStats();
//   console.log(stats);
// }

const stats = await new MeanStatistics(
  MiddlePositionalStatistics,
  matches.map(match => [{ match, account }] as const),
  ['k@14', 'dmg', 'kda', 'kp', 'soloKills']
).getStats()

console.log(stats);
