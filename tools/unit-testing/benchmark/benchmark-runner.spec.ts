import {MAXIMUM_MEAN_MILLISECONDS, runBenchmarks} from '../../lib/benchmark/benchmark-runner';

const IMPOSSIBLE_BUDGET = -1;

describe('runBenchmarks', () => {
  it('passes a fast case within the default budget', async () => {
    const [verdict] = await runBenchmarks([{name: 'fast', run: () => 'value'.length}]);
    expect(verdict).toMatchObject({name: 'fast', isWithinBudget: true});
    expect(verdict?.meanMilliseconds).toBeLessThanOrEqual(MAXIMUM_MEAN_MILLISECONDS);
  });

  it('fails a case above the budget', async () => {
    const [verdict] = await runBenchmarks([{name: 'any', run: () => 'value'.length}], IMPOSSIBLE_BUDGET);
    expect(verdict?.isWithinBudget).toBe(false);
  });
});
