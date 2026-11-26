import {readdirSync} from 'node:fs';
import {posix} from 'node:path';
import {compareMirror, type MirrorRoots} from '../lib/test-mirror/test-mirror';

const FAILURE_EXIT_CODE = 1;

const MIRRORS: readonly MirrorRoots[] = [
  {sourceRoot: 'projects/ngx-formpulse/lib', testRoot: 'projects/ngx-formpulse/unit-testing', supportDirectory: 'support'},
  {sourceRoot: 'tools/lib', testRoot: 'tools/unit-testing', supportDirectory: 'support'}
];

function listFiles(directory_path: string): string[] {
  return readdirSync(directory_path, {withFileTypes: true}).flatMap((entry) => {
    const entryPath = posix.join(directory_path, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function reportMirrors(): void {
  let problemCount = 0;
  for (const mirrorRoots of MIRRORS) {
    const report = compareMirror(mirrorRoots, listFiles(mirrorRoots.sourceRoot), listFiles(mirrorRoots.testRoot));
    for (const sourcePath of report.sourcesWithoutSpec) {
      console.error(`Missing spec for ${sourcePath}`);
    }
    for (const specPath of report.specsWithoutSource) {
      console.error(`Spec without source: ${specPath}`);
    }
    problemCount += report.sourcesWithoutSpec.length + report.specsWithoutSource.length;
  }
  console.log(`Test mirror check: ${String(problemCount)} problems.`);
  if (problemCount > 0) {
    process.exitCode = FAILURE_EXIT_CODE;
  }
}

reportMirrors();
