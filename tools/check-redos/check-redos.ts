import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {checkRegularExpressions, selectUnsafeVerdicts} from './redos-checker';
import {findRegularExpressions} from './regular-expression-finder';

const LIBRARY_ROOT = 'projects/ngx-formpulse';
const SOURCE_FILE_PATTERN = /(?<!\.spec|\.test-d)\.ts$/;
const FAILURE_EXIT_CODE = 1;

function listSourceFiles(directory_path: string): string[] {
  return readdirSync(directory_path, {withFileTypes: true}).flatMap((entry) => {
    const entryPath = join(directory_path, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(entryPath);
    }
    return SOURCE_FILE_PATTERN.test(entry.name) ? [entryPath] : [];
  });
}

function reportUnsafeRegularExpressions(): void {
  const foundExpressions = listSourceFiles(LIBRARY_ROOT).flatMap((file_name) => findRegularExpressions(file_name, readFileSync(file_name, 'utf8')));
  const unsafeVerdicts = selectUnsafeVerdicts(checkRegularExpressions(foundExpressions));

  for (const verdict of unsafeVerdicts) {
    console.error(`${verdict.expression.fileName}:${String(verdict.expression.line)} /${verdict.expression.source}/${verdict.expression.flags} is ${verdict.status}`);
  }
  console.log(`ReDoS check: ${String(foundExpressions.length)} regular expressions, ${String(unsafeVerdicts.length)} unsafe.`);

  if (unsafeVerdicts.length > 0) {
    process.exitCode = FAILURE_EXIT_CODE;
  }
}

reportUnsafeRegularExpressions();
