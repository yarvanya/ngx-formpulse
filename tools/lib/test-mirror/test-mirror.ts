import {posix} from 'node:path';

export interface MirrorRoots {
  readonly sourceRoot: string;
  readonly testRoot: string;
  readonly supportDirectory: string;
}

export interface MirrorReport {
  readonly sourcesWithoutSpec: readonly string[];
  readonly specsWithoutSource: readonly string[];
}

const SOURCE_EXTENSION_PATTERN = /\.(?:ts|mjs)$/;
const SPEC_SUFFIX = '.spec.ts';
const ENTRY_POINT_FILE = 'public-api.ts';

function toRelative(root: string, file_path: string): string {
  return posix.relative(root, file_path);
}

function toSpecPath(relative_source: string): string {
  return relative_source.replace(SOURCE_EXTENSION_PATTERN, SPEC_SUFFIX);
}

export function compareMirror(mirror_roots: MirrorRoots, source_files: readonly string[], test_files: readonly string[]): MirrorReport {
  const relativeSources = source_files
    .map((file_path) => toRelative(mirror_roots.sourceRoot, file_path))
    .filter((relative_path) => SOURCE_EXTENSION_PATTERN.test(relative_path) && posix.basename(relative_path) !== ENTRY_POINT_FILE);
  const relativeSpecs = test_files
    .map((file_path) => toRelative(mirror_roots.testRoot, file_path))
    .filter((relative_path) => relative_path.endsWith(SPEC_SUFFIX) && !relative_path.startsWith(`${mirror_roots.supportDirectory}/`));
  const expectedSpecs = new Set(relativeSources.map((relative_source) => toSpecPath(relative_source)));
  const existingSpecs = new Set(relativeSpecs);
  return {
    sourcesWithoutSpec: relativeSources.filter((relative_source) => !existingSpecs.has(toSpecPath(relative_source))).map((relative_source) => posix.join(mirror_roots.sourceRoot, relative_source)),
    specsWithoutSource: relativeSpecs.filter((relative_spec) => !expectedSpecs.has(relative_spec)).map((relative_spec) => posix.join(mirror_roots.testRoot, relative_spec))
  };
}
