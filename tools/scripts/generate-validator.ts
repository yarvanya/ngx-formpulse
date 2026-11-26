import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {planValidatorFiles} from '../lib/validator-generator/validator-generator';
import {createValidatorNames} from '../lib/validator-generator/validator-names';
import {listManualSteps, renderValidatorFiles} from '../lib/validator-generator/validator-templates';

const FAILURE_EXIT_CODE = 1;
const NAME_ARGUMENT_INDEX = 2;

function generateValidator(): void {
  const validatorNames = createValidatorNames(process.argv[NAME_ARGUMENT_INDEX] ?? '');
  const generatedFiles = renderValidatorFiles(validatorNames);
  const existingPaths = new Set(generatedFiles.map((generated_file) => generated_file.path).filter((file_path) => existsSync(file_path)));
  const generationPlan = planValidatorFiles(generatedFiles, existingPaths);
  if (generationPlan.conflictingPaths.length > 0) {
    console.error(`Nothing written; these files already exist:\n${generationPlan.conflictingPaths.join('\n')}`);
    process.exitCode = FAILURE_EXIT_CODE;
    return;
  }
  for (const generatedFile of generationPlan.filesToWrite) {
    mkdirSync(dirname(generatedFile.path), {recursive: true});
    writeFileSync(generatedFile.path, generatedFile.content);
    console.log(`Created ${generatedFile.path}`);
  }
  console.log(`\nNext steps for ${validatorNames.validatorKey}:`);
  listManualSteps(validatorNames).forEach((manual_step, step_index) => {
    console.log(`${String(step_index + 1)}. ${manual_step}`);
  });
}

try {
  generateValidator();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = FAILURE_EXIT_CODE;
}
