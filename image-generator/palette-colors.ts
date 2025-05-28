export interface PaletteColor {
  text: string;
  accent: string;
  background: string;
  backgroundSecondary: string;
  loss: string;
  win: string;
}

const paletteColors: PaletteColor[] = [
  {
    text: '#ffffff',
    accent: '#00E5BF',
    background: '#040019',
    backgroundSecondary: '#0B0528',
    loss: '#B80C09',
    win: '#3772FF',
  },
]

export const getPaletteColor = (index: number): PaletteColor => {
  return paletteColors[index % paletteColors.length]!;
};
