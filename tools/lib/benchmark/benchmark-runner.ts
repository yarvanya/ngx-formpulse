import {Bench} from 'tinybench';

export interface BenchmarkCase {
  readonly name: string;
  readonly run: () => unknown;
}

export interface BenchmarkVerdict {
  readonly name: string;
  readonly meanMilliseconds: number;
  readonly isWithinBudget: boolean;
}

export const MAXIMUM_MEAN_MILLISECONDS = 0.1;
const MEASUREMENT_TIME_MILLISECONDS = 200;

export async function runBenchmarks(benchmark_cases: readonly BenchmarkCase[], maximum_mean_milliseconds = MAXIMUM_MEAN_MILLISECONDS): Promise<BenchmarkVerdict[]> {
  const bench = new Bench({time: MEASUREMENT_TIME_MILLISECONDS});
  for (const benchmarkCase of benchmark_cases) {
    bench.add(benchmarkCase.name, benchmarkCase.run);
  }
  await bench.run();
  return bench.tasks.map((task) => {
    const taskResult = task.result;
    const meanMilliseconds = 'latency' in taskResult ? taskResult.latency.mean : Number.POSITIVE_INFINITY;
    return {name: task.name, meanMilliseconds, isWithinBudget: meanMilliseconds <= maximum_mean_milliseconds};
  });
}
