import { Option, pipe } from "effect";
import { mean } from "../../utils/mean";
import { sum } from "../../utils/sum";
import { JunglePositionalStatistics } from "./jungle-positional-statistics";
import { generateImage } from "../../../image-generator/image-generator";

const formatData = (data: unknown[]) => {
  const realData = data.filter(item => item instanceof JunglePositionalStatistics);

  if (realData.length === 0) return Option.none();

  const kp = mean(realData.map(item => item.kp));
  const dpm = mean(realData.map(item => item.dpm));
  const dmg = mean(realData.map(item => item.dmg));
  const goldAt14 = mean(realData.map(item => item["g@14"]));
  const kda = mean(realData.map(item => item.kda));
  const wins = sum(realData.map(item => item.win));
  const losses = sum(realData.map(item => item.loss));
  const championDistribution = new Map<string, number>();
  for (const item of realData) {
    const count = championDistribution.get(item.championName) || 0;
    championDistribution.set(item.championName, count + 1);
  }

  return Option.some({
    kp,
    dpm,
    dmg,
    "g@14": goldAt14,
    kda,
    win: wins,
    loss: losses,
    championDistribution,
  });
}

export const junglePositionalImgGenerator = (
  data: unknown[],
  player: Parameters<typeof generateImage>[0]['player'],
) =>
  pipe(
    Option.some(data),
    Option.andThen(formatData),
    Option.andThen(data => generateImage({
      highlightedDatum: { keyName: 'kda', value: data.kda.toLocaleString(undefined, { maximumFractionDigits: 2 }) },
      quickData: [
        { keyName: 'kp', value: `${(data.kp * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%` },
        { keyName: 'dpm', value: data.dpm.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
        { keyName: 'dmg', value: data.dmg.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
        { keyName: 'g@14', value: `${data["g@14"] > 0 ? '+' : ''}${data["g@14"].toLocaleString(undefined, { maximumFractionDigits: 1 })}` },
      ],
      wins: data.win,
      losses: data.loss,
      champions: Array
        .from(data.championDistribution.entries())
        .map(([name, count]) => ({
          name,
          imageUrl: `https://ddragon.leagueoflegends.com/cdn/13.20.1/img/champion/${name}.png`,
          count,
        })),
      player,
    })),
  )
