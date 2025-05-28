import type { PaletteColor } from "../palette-colors";

export const Statistics = ({ style, smallData, bigData, player, results }: {
  style: { colors: PaletteColor }
  smallData: Record<string, string>
  bigData: Record<string, string>,
  results: {
    wins: number;
    losses: number;
  },
  player: {
    imageBase64: string;
    name: string;
  }
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: style.colors.background,
      color: style.colors.text,
      fontSize: '110px',
      padding: '2rem',
      letterSpacing: '-0.02em',
    }}>

      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>

        {/* quick data */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: 1,
          backgroundColor: style.colors.backgroundSecondary,
          padding: '2rem',
        }}>

          {
            Object.entries(smallData).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span>{value}</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: style.colors.accent }}>
                  {key.toUpperCase()}
                </span>
              </div>
            ))
          }

        </div>

        <div style={{
          display: 'flex',
          flex: 1,
        }}>
          <img src={`data:image/jpeg;base64,${player.imageBase64}`} alt="Player" style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }} />

          <span style={{
            backgroundColor: style.colors.backgroundSecondary,
            color: style.colors.text,
            padding: '1rem',
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            fontSize: '60px',
            textTransform: 'uppercase',
          }}>
            {player.name}
          </span>
        </div>

      </div>

      {/* big data */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '300px', fontWeight: 'bold', }}>
        <span>{Object.values(bigData)[0]}</span>
        <span style={{
          textTransform: 'uppercase',
          color: style.colors.accent,
        }}>{Object.keys(bigData)[0]?.toUpperCase()}</span>
      </div>

      {/* footer */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        backgroundColor: style.colors.backgroundSecondary,
        flex: 1,
      }}>

        {/* win/loss */}
        <div style={{
          display: 'flex',
          flex: 1,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: style.colors.win,
            color: 'white',
            flex: results.wins
          }}>
            <span style={{ fontSize: '200px', fontWeight: 'bold' }}>{results.wins}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: style.colors.loss,
            color: 'white',
            flex: results.losses
          }}>
            <span style={{ fontSize: '200px', fontWeight: 'bold' }}>{results.losses}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
