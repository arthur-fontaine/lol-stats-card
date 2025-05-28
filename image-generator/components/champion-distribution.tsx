import type { Style } from "../style/style-state";

interface ChampionDistributionProps {
  champions: { name: string; imageUrl: string; count: number }[];
  style: Style;
}

export const ChampionDistribution = (props: ChampionDistributionProps) =>
  <div style={{
    display: 'flex',
    flex: 1,
  }}>
    {props.champions
      .toSorted((a, b) => b.count - a.count)
      .map(({ imageUrl, count }) => (
        <img
          src={imageUrl}
          style={{
            flex: count,
            minHeight: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
          }}
        />
      ))}
  </div>
