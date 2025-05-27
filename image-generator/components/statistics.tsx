import type { PaletteColor } from "../palette-colors";

export const Statistics = ({ style, smallData, bigData, player }: {
  style: { colors: PaletteColor }
  smallData: Record<string, string>
  bigData: Record<string, string>,
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
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '300px', fontWeight: 'bold', }}>
        <span>{Object.values(bigData)[0]}</span>
        <span style={{
          textTransform: 'uppercase',
          color: style.colors.accent,
        }}>{Object.keys(bigData)[0]?.toUpperCase()}</span>
      </div>
    </div>
  );
};
