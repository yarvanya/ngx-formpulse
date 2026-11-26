import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';

export type CodeLanguage = 'typescript' | 'bash';

const HTML_ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function escapeHtml(source_code: string): string {
  return source_code.replace(/[&<>]/g, (character) => HTML_ESCAPES[character] ?? character);
}

export function highlightCode(source_code: string, code_language: CodeLanguage): string {
  const grammar = Prism.languages[code_language];
  return grammar === undefined ? escapeHtml(source_code) : Prism.highlight(source_code, grammar, code_language);
}
