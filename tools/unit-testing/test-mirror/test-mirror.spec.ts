import {compareMirror, type MirrorRoots} from '../../lib/test-mirror/test-mirror';

const MIRROR_ROOTS: MirrorRoots = {sourceRoot: 'library/lib', testRoot: 'library/unit-testing', supportDirectory: 'support'};

describe('compareMirror', () => {
  it('accepts sources that each have a spec at the same relative path', () => {
    const report = compareMirror(
      MIRROR_ROOTS,
      ['library/lib/core/locale.ts', 'library/lib/rules/rule.mjs'],
      ['library/unit-testing/core/locale.spec.ts', 'library/unit-testing/rules/rule.spec.ts']
    );
    expect(report).toEqual({sourcesWithoutSpec: [], specsWithoutSource: []});
  });

  it('reports a source without a spec', () => {
    const report = compareMirror(MIRROR_ROOTS, ['library/lib/core/locale.ts'], []);
    expect(report.sourcesWithoutSpec).toEqual(['library/lib/core/locale.ts']);
  });

  it('reports a spec without a source', () => {
    const report = compareMirror(MIRROR_ROOTS, [], ['library/unit-testing/core/orphan.spec.ts']);
    expect(report.specsWithoutSource).toEqual(['library/unit-testing/core/orphan.spec.ts']);
  });

  it('ignores entry points, non-code files and test support files', () => {
    const report = compareMirror(
      MIRROR_ROOTS,
      ['library/lib/public-api.ts', 'library/lib/core/readme.md'],
      ['library/unit-testing/support/helper.ts', 'library/unit-testing/support/helper.spec.ts', 'library/unit-testing/core/notes.md']
    );
    expect(report).toEqual({sourcesWithoutSpec: [], specsWithoutSource: []});
  });
});
