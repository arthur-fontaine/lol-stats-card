import type { StatisticsConstructor } from "./mixins/base";

type AverageableKeys<T extends StatisticsConstructor<any>> =
  T extends StatisticsConstructor<infer U>
    ? keyof {
      [K in keyof U as U[K] extends number ? K : never]: NonNullable<U>[K];
    }
    : never;

export class MeanStatistics<T extends StatisticsConstructor<any>> {
  #statistics: InstanceType<T>[];
  #keysToAverage: AverageableKeys<T>[];

  constructor(
    statisticsClass: T,
    args: ConstructorParameters<T>[],
    keysToAverage: AverageableKeys<T>[] = []
  ) {
    this.#statistics = args.map(arg => new statisticsClass(...arg) as never);
    this.#keysToAverage = keysToAverage;
  }

  async getStats(): Promise<Awaited<ReturnType<InstanceType<T>['fetchStats']>> | undefined> {
    const results = [] as Awaited<ReturnType<InstanceType<T>['fetchStats']>>[];
    for (const stat of this.#statistics) {
      const result = await stat.fetchStats();
      results.push(result);
    }
    const validResults = results.filter(res => res !== undefined);

    if (validResults.length === 0) return undefined;

    const aggregatedStats = {} as Awaited<ReturnType<InstanceType<T>['fetchStats']>>;

    for (const key of this.#keysToAverage) {
      aggregatedStats[key] = validResults.reduce((acc, curr) => {
        return acc + (curr[key] || 0);
      }, 0) / validResults.length;
    }

    return aggregatedStats;
  }
}
