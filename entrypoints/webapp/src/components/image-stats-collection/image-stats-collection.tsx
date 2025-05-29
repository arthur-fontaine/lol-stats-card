import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/api-client";
import { summonerNameHistoryStore } from "../../utils/summoner-name-history-store";

export function ImageStatsCollection() {
  const {
    data: imagePaths = [],
  } = useQuery({
    queryKey: ["image-stats"],
    queryFn: async () => {
      const summonerNames = summonerNameHistoryStore.get();
      return Promise.all(
        summonerNames.map(async ({ name, tag }) => {
          const response = await apiClient["image-stats"].$get({
            query: { name, tag },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch images for ${name}#${tag}: ${response.statusText}`);
          }
          return response.json();
        })
      ).then((results) => results.flatMap((result) => result.images || []));
    },
    refetchInterval: 10000,
  });

  return (
    <div className="flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-bold text-accent">Your Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {imagePaths.map((imagePath) => (
          <div key={imagePath.slice(0, 100)} className="rounded-lg shadow-sm">
            <img
              className="w-full h-auto rounded"
              src={apiClient["image-stats"][":id"].$url({ param: { id: imagePath } }).toString()}
            />
          </div>
        ))}
        {imagePaths.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No images found. Start generating your stats!
          </div>
        )}
      </div>
    </div>
  );
}
