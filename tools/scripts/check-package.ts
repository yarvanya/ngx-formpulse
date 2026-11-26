import {readdirSync} from 'node:fs';
import {posix} from 'node:path';
import {listMissingPackageFiles} from '../lib/package-contents/package-contents';

const PACKAGE_ROOT = 'dist/ngx-formpulse';
const FAILURE_EXIT_CODE = 1;

function listPackageFiles(directory_path: string, relative_path = ''): string[] {
  return readdirSync(directory_path, {withFileTypes: true}).flatMap((entry) => {
    const entryRelativePath = relative_path === '' ? entry.name : posix.join(relative_path, entry.name);
    return entry.isDirectory() ? listPackageFiles(posix.join(directory_path, entry.name), entryRelativePath) : [entryRelativePath];
  });
}

function reportPackageContents(): void {
  const missingFiles = listMissingPackageFiles(new Set(listPackageFiles(PACKAGE_ROOT)));
  for (const missingFile of missingFiles) {
    console.error(`Missing from ${PACKAGE_ROOT}: ${missingFile}`);
  }
  console.log(`Package check: ${String(missingFiles.length)} missing files.`);
  if (missingFiles.length > 0) {
    process.exitCode = FAILURE_EXIT_CODE;
  }
}

reportPackageContents();
