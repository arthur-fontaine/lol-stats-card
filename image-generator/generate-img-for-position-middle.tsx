import satori from "satori";
import type { middlePositionPipeline } from "../statistics/position/middle";
import type { Effect } from "effect";
import sharp from "sharp";
import type { PaletteColor } from "./palette-colors";
import { Statistics } from "./components/statistics";
import { getChampionImageBase64 } from "./utils/get-champion-image-base64";

export const generateImgForPositionMiddle = async (
  data: Effect.Effect.Success<ReturnType<typeof middlePositionPipeline>>,
  championsCount: Map<string, number>,
  style: { colors: PaletteColor }
) => {
  const championsCountUrl = new Map<string, number>();
  for (const [champion, count] of championsCount.entries()) {
    championsCountUrl.set(await getChampionImageBase64(champion), count);
  }

  const svg = await satori(
    <Statistics
      style={style}
      smallData={{
        kp: `${(data.kp * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`,
        dmg: `${(data.dmg * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`,
        soloKills: data.soloKills.toLocaleString(undefined, { maximumFractionDigits: 1 }),
        'g@14': `${data['g@14'] > 0 ? '+' : ''}${data['g@14'].toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
      }}
      bigData={{ kda: data.kda.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
      player={{
        imageBase64: await Bun.file('Capture d’écran 2025-05-28 à 02.51.08.png').arrayBuffer()
          .then(buffer => Buffer.from(buffer).toString('base64')),
        name: 'Voiture',
      }}
      championsCount={championsCountUrl}
      results={{
        wins: data.win,
        losses: data.loss,
      }}
    />,
    {
      width: 1200,
      height: 1500,
      fonts: [
        {
          name: 'Special Gothic Condensed One',
          data: await Bun.file('assets/fonts/SpecialGothicCondensedOne-Regular.woff').arrayBuffer(),
          weight: 500,
          style: 'normal',
        },
      ],
    },
  )

  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return buffer;
}
