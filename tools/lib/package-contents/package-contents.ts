export const REQUIRED_PACKAGE_FILES: readonly string[] = [
  'package.json',
  'README.md',
  'LICENSE',
  'NOTICE',
  'third-party-licenses/google-libaddressinput-LICENSE.txt'
];

export function listMissingPackageFiles(existing_files: ReadonlySet<string>, required_files: readonly string[] = REQUIRED_PACKAGE_FILES): string[] {
  return required_files.filter((required_file) => !existing_files.has(required_file));
}
