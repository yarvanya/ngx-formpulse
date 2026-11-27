import {isEmptyValue} from '../../projects/ngx-formpulse/lib/core/empty-value';
import {resolveMessage} from '../../projects/ngx-formpulse/lib/core/message-resolver';
import {FpCountry} from '../../projects/ngx-formpulse/lib/enums/fp-country';
import {checkEmail} from '../../projects/ngx-formpulse/lib/validators/email/email';
import {checkPostCode} from '../../projects/ngx-formpulse/lib/validators/post-code/post-code';
import {type BenchmarkCase, runBenchmarks} from '../lib/benchmark/benchmark-runner';

const FAILURE_EXIT_CODE = 1;
const DECIMAL_PLACES = 5;

const BENCHMARK_CASES: readonly BenchmarkCase[] = [
  {
    name: 'resolveMessage',
    run: () => resolveMessage({validatorKey: 'fpBenchmark', englishMessage: 'Expected {expectedFormat}.', errorParameters: {expectedFormat: 'NNNNN'}})
  },
  {
    name: 'fpPostCode (GB, valid)',
    run: () => checkPostCode('SW1A 1AA', FpCountry.GB, {})
  },
  {
    name: 'fpPostCode (UA, invalid with message)',
    run: () => checkPostCode('0100', FpCountry.UA, {})
  },
  {
    name: 'fpPostCode (any country, invalid)',
    run: () => checkPostCode('%%%', null, {})
  },
  {
    name: 'fpEmail (valid)',
    run: () => checkEmail('ivan.petrenko+news@mail.example.com.ua', {})
  },
  {
    name: 'fpEmail (invalid with message)',
    run: () => checkEmail('name@company', {})
  },
  {
    name: 'isEmptyValue',
    run: () => isEmptyValue('01001')
  }
];

async function reportBenchmarks(): Promise<void> {
  const verdicts = await runBenchmarks(BENCHMARK_CASES);
  for (const verdict of verdicts) {
    console.log(`${verdict.isWithinBudget ? 'ok  ' : 'SLOW'} ${verdict.name}: ${verdict.meanMilliseconds.toFixed(DECIMAL_PLACES)} ms`);
  }
  if (verdicts.some((verdict) => !verdict.isWithinBudget)) {
    process.exitCode = FAILURE_EXIT_CODE;
  }
}

reportBenchmarks().catch((error: unknown) => {
  console.error(error);
  process.exitCode = FAILURE_EXIT_CODE;
});
