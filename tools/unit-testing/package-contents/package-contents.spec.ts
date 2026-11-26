import {listMissingPackageFiles, REQUIRED_PACKAGE_FILES} from '../../lib/package-contents/package-contents';

describe('listMissingPackageFiles', () => {
  it('requires the licenses and the third-party notice', () => {
    expect(REQUIRED_PACKAGE_FILES).toEqual(expect.arrayContaining(['LICENSE', 'NOTICE', 'third-party-licenses/google-libaddressinput-LICENSE.txt']));
  });

  it('reports nothing when every required file exists', () => {
    expect(listMissingPackageFiles(new Set(REQUIRED_PACKAGE_FILES))).toEqual([]);
  });

  it('reports the missing files', () => {
    expect(listMissingPackageFiles(new Set(['package.json', 'README.md']))).toEqual([
      'LICENSE',
      'NOTICE',
      'third-party-licenses/google-libaddressinput-LICENSE.txt'
    ]);
  });

  it('accepts a custom list', () => {
    expect(listMissingPackageFiles(new Set(['a.txt']), ['a.txt', 'b.txt'])).toEqual(['b.txt']);
  });
});
