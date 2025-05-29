import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PositionSelection } from "./position-selection";
import { NameInput } from "./name-input";
import { apiClient } from "../../utils/api-client";
import type { IPosition } from "../../types/position";
import { PictureInput } from "./picture-input";
import { summonerNameHistoryStore } from "../../utils/summoner-name-history-store";

interface IGenerateImageFormProps {
  onIsGeneratingImageChange?: (isGenerating: boolean) => void;
}

export function GenerateImageForm(props: IGenerateImageFormProps) {
  const [position, setPosition] = useState<IPosition>('mid');
  const [summonerName, setSummonerName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');

  const {
    mutate: generateImage,
    isPending: isGeneratingImage,
    isSuccess: isGenerateImageSuccess,
    error: generateImageError,
  } = useMutation({
    mutationFn: async () => {
      if (!summonerName || !tagline) throw new Error("Summoner name and tagline are required");
      if (!imageBase64) throw new Error("Image is required");
      const response = await apiClient["image-stats"].jobs.$post({
        json: {
          pipelines: [
            position === 'mid' ? 'position/middle'
              : position === 'top' ? 'position/top'
                : position === 'jungle' ? 'position/jungle'
                  : position === 'bottom' ? 'position/bottom'
                    : position === 'support' ? 'position/support'
                      : position satisfies never,
          ],
          paletteColor: 'default',
          player: {
            name: summonerName,
            tag: tagline,
            imageUrl: imageBase64,
          },
          dateRange: {
            from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // last 14 days
            to: new Date().toISOString(), // now
          },
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }
      props.onIsGeneratingImageChange?.(true);
      summonerNameHistoryStore.add(summonerName, tagline);
    },
  })

  return <form
    className="flex flex-col gap-6 w-full"
    onSubmit={async (e) => {
      e.preventDefault();
      generateImage();
    }}
  >
    <div className="flex gap-6 md:flex-row flex-col">
      <NameInput
        onSummonerNameChange={setSummonerName}
        onTaglineChange={setTagline}
      />
      <PictureInput onImageChange={setImageBase64} />
    </div>
    <PositionSelection onChange={setPosition} />

    <button
      type="submit"
      className="bg-darkgold text-white font-semibold py-2 px-4 rounded-lg not-disabled:hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      disabled={isGeneratingImage}
    >
      {isGeneratingImage ? 'Generating...' : 'Generate Image'}
    </button>

    {
      isGenerateImageSuccess
        ? (
          <div className="text-lightblue">
            Your image will be generated shortly. Please wait just a few seconds and then check your collection.
          </div>
        )
        : generateImageError
          ? (
            <div className="text-red-500">
              Error: {generateImageError instanceof Error ? generateImageError.message : 'Unknown error'}
            </div>
          )
          : null
    }
  </form>;
}
