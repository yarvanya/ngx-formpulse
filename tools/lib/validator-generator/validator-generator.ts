import type {GeneratedFile} from './validator-templates';

export interface GenerationPlan {
  readonly filesToWrite: readonly GeneratedFile[];
  readonly conflictingPaths: readonly string[];
}

export function planValidatorFiles(generated_files: readonly GeneratedFile[], existing_paths: ReadonlySet<string>): GenerationPlan {
  const conflictingPaths = generated_files.map((generated_file) => generated_file.path).filter((file_path) => existing_paths.has(file_path));
  return {
    filesToWrite: conflictingPaths.length > 0 ? [] : generated_files,
    conflictingPaths
  };
}
