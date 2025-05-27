import { BaseStatisticsMixin, type IStatistics, type StatisticsConstructor } from "../base";

export function RiftStatisticsMixin<T extends Record<string, unknown>, TBase extends StatisticsConstructor<T>>(Base: TBase) {
  return BaseStatisticsMixin(class extends Base {
    async fetchStats(): ReturnType<IStatistics<T>['fetchStats']> {
      return super.fetchStats();
    }

    async shouldSkip(): ReturnType<IStatistics<T>['shouldSkip']> {
      const matchDetails = await this.match.getDetails();

      const isRiftMode = this.#isRiftMode(matchDetails);
      if (!isRiftMode) return true;

      return super.shouldSkip();
    }

    #isRiftMode(matchDetails: Awaited<ReturnType<typeof this.match.getDetails>>) {
      return matchDetails.info.gameMode === 'CLASSIC' || matchDetails.info.gameMode === 'SWIFTPLAY';
    }
  });
}
