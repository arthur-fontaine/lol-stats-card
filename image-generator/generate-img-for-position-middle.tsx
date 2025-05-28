import satori from "satori";
import type { middlePositionPipeline } from "../statistics/position/middle";
import type { Effect } from "effect";
import sharp from "sharp";
import type { PaletteColor } from "./palette-colors";
import { Statistics } from "./components/statistics";

export const generateImgForPositionMiddle = async (
  data: Effect.Effect.Success<ReturnType<typeof middlePositionPipeline>>,
  style: { colors: PaletteColor }
) => {
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
        imageBase64: await Bun.file('IMG_20250527_111239551.jpg').arrayBuffer()
          .then(buffer => Buffer.from(buffer).toString('base64')),
        name: 'Capsismyfather',
      }}
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
