const PUBLIC_DECLARATION_PATTERN = /^(?:fp|Fp|provideFormPulse$)/;
const COVERAGE_IGNORE_PATTERN = /^\s*\*?\s*(?:v8|c8|istanbul)\s+ignore/;
const LIBRARY_SOURCE_PATTERN = /(?:^|[\\/])projects[\\/]ngx-formpulse[\\/]/;
const TEST_FILE_PATTERN = /\.(?:spec|test-d)\.ts$/;
const TSDOC_MARKER = '*';

function readDeclaredName(export_node) {
  const declaration = export_node.declaration;
  if (!declaration) {
    return undefined;
  }
  if (declaration.type === 'VariableDeclaration') {
    return declaration.declarations[0]?.id.name;
  }
  return declaration.id?.name;
}

export const noComments = {
  meta: {
    docs: {
      description: 'Forbids code comments; only TSDoc on public library exports is allowed.'
    },
    schema: [],
    messages: {
      comment: 'Comments are not allowed. Express the intent in names and code instead.',
      coverageIgnore: 'Coverage-ignore comments are never allowed: cover the code with tests.'
    }
  },
  create(rule_context) {
    const sourceCode = rule_context.sourceCode;
    const isLibrarySource = LIBRARY_SOURCE_PATTERN.test(rule_context.filename) && !TEST_FILE_PATTERN.test(rule_context.filename);

    function isPublicTsdoc(comment) {
      if (!isLibrarySource || comment.type !== 'Block' || !comment.value.startsWith(TSDOC_MARKER)) {
        return false;
      }
      const nextToken = sourceCode.getTokenAfter(comment, {includeComments: true});
      if (nextToken?.value !== 'export') {
        return false;
      }
      const exportNode = sourceCode.getNodeByRangeIndex(nextToken.range[0]);
      if (exportNode?.type !== 'ExportNamedDeclaration') {
        return false;
      }
      return PUBLIC_DECLARATION_PATTERN.test(readDeclaredName(exportNode) ?? '');
    }

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (comment.type === 'Shebang') {
            continue;
          }
          if (COVERAGE_IGNORE_PATTERN.test(comment.value)) {
            rule_context.report({loc: comment.loc, messageId: 'coverageIgnore'});
            continue;
          }
          if (!isPublicTsdoc(comment)) {
            rule_context.report({loc: comment.loc, messageId: 'comment'});
          }
        }
      }
    };
  }
};
