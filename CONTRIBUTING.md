# Contributing to FormPulse

Thank you for helping. This guide describes how work is organised and what every change must pass.

## Workflow

- Every change belongs to a story `FP-<n>` and lives on a branch `feature/FP-<n>-<short-name>`
  created from `develop`.
- Open a pull request into `develop`. `main` receives only release pull requests from `develop`.
- Commit messages are in English and start with the story id: `FP-1: add fpPostCode validator`.
- Add an entry under `## Unreleased` in `CHANGELOG.md`.

## Validator anatomy

One validator is delivered completely in one story:

1. Core check with its English message and types (no Angular imports).
2. Reactive Forms and Signal Forms adapters with identical error shapes.
3. Messages in all 7 locales (a missing translation is a compile error).
4. TSDoc on every public export: description, parameters, error shape, governing standard,
   example and docs link.
5. Unit tests with 100% coverage, including type assertions.
6. A sandbox page listing every test case.
7. Playwright e2e for that page, including an accessibility scan.

Empty values (`''`, `null`, `undefined`) are valid for every validator except `fpRequired`.
Validators never modify the control value and never throw.

## Project layout

Code and unit tests live in two mirrored trees, in the library and in `tools/`:

- `lib/`: source files only (`.ts`, `.mjs`).
- `unit-testing/`: one `.spec.ts` per source file, at the same relative path
  (`lib/core/locale-resolver.ts` → `unit-testing/core/locale-resolver.spec.ts`).
  Type assertions (`expectTypeOf`) live in the same spec files. Shared test helpers go to
  `unit-testing/support/`. Entry points (`public-api.ts`) have no spec.

`npm run check:test-mirror` fails on a source without a spec or a spec without a source.

## Code style

The linter is the judge; `npm run lint` must report nothing.

- 2-space indentation, semicolons, no trailing commas, no spaces inside braces.
- No comments. The only exception is TSDoc on public library exports.
- camelCase for variables, properties and methods; snake_case for function parameters;
  UPPER_SNAKE_CASE for module constants; PascalCase for types.
- No abbreviations in names (`previous`, not `prev`).
- No magic numbers: every number other than -1, 0 and 1 is a named constant.

## Quality gates

`npm run verify` runs every gate in CI order: lint, typecheck (including the type assertions in
specs), test mirror check, unit tests with coverage, ReDoS check, build, bundle size, benchmark,
e2e.
