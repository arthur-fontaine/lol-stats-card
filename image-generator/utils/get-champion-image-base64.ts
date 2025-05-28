import sharp from "sharp";

export async function getChampionImageBase64(championName: string, skinIndex = 0): Promise<string> {
  const url = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_${skinIndex}.jpg`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur téléchargement image: ${response.statusText}`);

  const buffer = await response.arrayBuffer();

  // Chargement et recadrage automatique
  const cropped = await sharp(buffer)
    .extract({
      left: 24,
      top: 24,
      width: 308 - 2 * 24, // 260
      height: 560 - 2 * 24 // 512
    })
    .toBuffer();

  const base64 = cropped.toString('base64');
  const mime = 'image/jpeg';

  return `data:${mime};base64,${base64}`;
}
