import { Effect } from 'effect';
import satori from 'satori';
import { StyleState } from './style/style-state';
import { StatisticsPage } from './components/statistics-page';
import { loadAsset } from '../effect-lib/load-asset';
import sharp from 'sharp';

type GenerateImageParams = Omit<Parameters<typeof StatisticsPage>[0], 'style'>

export const generateImage = (params: GenerateImageParams) =>
  Effect.gen(function* () {
    const styleState = yield* StyleState;
    const style = yield* styleState.get;
    
    const fonts = yield* loadFonts();

    const svgSource = yield* Effect.tryPromise(() =>
      satori(
        <StatisticsPage
          {...params}
          style={style}
        />,
        {
          width: 1200,
          height: 1500,
          fonts,
        }
      )
    );

    const buffer = yield* Effect.tryPromise(() =>
      sharp(Buffer.from(svgSource))
        .png()
        .toBuffer()
    );

    return buffer;
  })

export const loadFonts = () =>
  Effect.gen(function* () {
    return [
      {
        name: 'Special Gothic Condensed One',
        data: yield* loadAsset('fonts/SpecialGothicCondensedOne-Regular.woff'),
        weight: 500,
        style: 'normal',
      } as const,
    ];
  });
