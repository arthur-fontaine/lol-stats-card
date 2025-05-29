export interface PaletteColor {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  cardColor: string;
  specifics: {
    win: string;
    loss: string;
  }
}

export const paletteColors = {
  default: {
    backgroundColor: '#040019',
    textColor: '#ffffff',
    accentColor: '#00E5BF',
    cardColor: '#0B0528',
    specifics: {
      win: '#3772FF',
      loss: '#B80C09',
    },
  }
} satisfies Record<string, PaletteColor>
