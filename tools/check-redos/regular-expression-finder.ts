import ts from 'typescript';

export interface FoundRegularExpression {
  readonly fileName: string;
  readonly line: number;
  readonly source: string;
  readonly flags: string;
}

const LITERAL_PATTERN = /^\/(?<source>.*)\/(?<flags>[a-z]*)$/s;
const REGULAR_EXPRESSION_CONSTRUCTOR = 'RegExp';
const LINE_OFFSET = 1;

function readLine(source_file: ts.SourceFile, node: ts.Node): number {
  return source_file.getLineAndCharacterOfPosition(node.getStart(source_file)).line + LINE_OFFSET;
}

function readLiteral(source_file: ts.SourceFile, node: ts.RegularExpressionLiteral): FoundRegularExpression {
  const match = LITERAL_PATTERN.exec(node.text);
  return {
    fileName: source_file.fileName,
    line: readLine(source_file, node),
    source: match?.groups?.['source'] ?? node.text,
    flags: match?.groups?.['flags'] ?? ''
  };
}

function readConstructorCall(source_file: ts.SourceFile, node: ts.NewExpression | ts.CallExpression): FoundRegularExpression | undefined {
  if (!ts.isIdentifier(node.expression) || node.expression.text !== REGULAR_EXPRESSION_CONSTRUCTOR) {
    return undefined;
  }
  const [sourceArgument, flagsArgument] = node.arguments ?? [];
  if (sourceArgument === undefined || !ts.isStringLiteralLike(sourceArgument)) {
    return undefined;
  }
  return {
    fileName: source_file.fileName,
    line: readLine(source_file, node),
    source: sourceArgument.text,
    flags: flagsArgument !== undefined && ts.isStringLiteralLike(flagsArgument) ? flagsArgument.text : ''
  };
}

export function findRegularExpressions(file_name: string, source_text: string): FoundRegularExpression[] {
  const sourceFile = ts.createSourceFile(file_name, source_text, ts.ScriptTarget.Latest, true);
  const foundExpressions: FoundRegularExpression[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isRegularExpressionLiteral(node)) {
      foundExpressions.push(readLiteral(sourceFile, node));
    } else if (ts.isNewExpression(node) || ts.isCallExpression(node)) {
      const constructed = readConstructorCall(sourceFile, node);
      if (constructed !== undefined) {
        foundExpressions.push(constructed);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return foundExpressions;
}
