import type { RiotApi } from "../../riot-api/riot-api";

export interface IStatistics<T extends Record<string, unknown>> {
  match: InstanceType<typeof RiotApi['Match']>;
  account: InstanceType<typeof RiotApi['Account']>;

  shouldSkip(): Promise<boolean | undefined>;
  fetchStats(): Promise<T | undefined>;
}

export type StatisticsConstructor<T extends Record<string, unknown>> = new (...args: any[]) => IStatistics<T>;

export function BaseStatisticsMixin<T extends Record<string, unknown>, TBase extends StatisticsConstructor<T>>(Base: TBase) {
  return class extends Base {
    async fetchStats(): ReturnType<IStatistics<T>['fetchStats']> {
      if (await this.shouldSkip()) return undefined;
      return super.fetchStats();
    }
  };
}
