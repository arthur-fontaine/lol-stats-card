import { useState } from "react";
import { GenerateImageForm } from "./components/generate-image-form/generate-image-form";
import { ImageStatsCollection } from "./components/image-stats-collection/image-stats-collection";

export function App() {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  return (
    <div className="bg-background min-h-svh h-auto w-auto flex flex-col px-4 pb-16">
      <div className="flex flex-col items-center container mx-auto my-16 border-4 border-border px-4 py-16 md:px-16 bg-white/2">
        <header className="text-center">
          <h1 className="text-title font-display font-bold text-4xl">
            LoL Stats Card
          </h1>

          <p className="font-light text-white mt-4">
            Generate your own League of Legends statistics card
            <br />
            <span className="text-accent font-semibold max-w-120 block">
              Enter your summoner name and picture, select a position, and generate your stats card!
            </span>
          </p>

          <hr className="my-8 md:my-12 md:-mx-4 border-border" />
        </header>

        <GenerateImageForm onIsGeneratingImageChange={setIsGeneratingImage} />
      </div>

      <div className="md:mt-12 container mx-auto">
        <ImageStatsCollection
          displayPlaceholder={isGeneratingImage}
          setDisplayPlaceholder={setIsGeneratingImage}
        />
      </div>
    </div>
  )
}
