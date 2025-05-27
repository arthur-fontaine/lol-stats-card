import satori from "satori";
import type { middlePositionPipeline } from "../statistics/position/middle";
import type { Effect } from "effect";
import sharp from "sharp";

export const generateImgForPositionMiddle = async (data: Effect.Effect.Success<ReturnType<typeof middlePositionPipeline>>) => {
  const svg = await satori(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontSize: '120px',
    }}>

      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>

        {/* quick data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>{(data.kp * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%</span>
            <span>KP</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>{(data.dmg * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%</span>
            <span>DMG</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>{data.soloKills.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
            <span>SOLOKILLS</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>
              {data['k@14'] > 0 ? '+' : ''}
              {data['k@14'].toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
            <span>G@14</span>
          </div>
        </div>

        {/* <img /> */}

      </div>

      {/* kda */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '300px' }}>
        <span>{data.kda.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        <span>KDA</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 1500,
      fonts: [
        {
          name: 'Roboto',
          data: await fetch('https://fonts.gstatic.com/s/roboto/v47/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbVmUiAz0klQmz24.woff')
            .then(res => res.arrayBuffer()),
          weight: 400,
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
