export {
  codeToHtml,
  createCssVariablesTheme,
  createHighlighterCore as createHighlighter,
  getTokenStyleObject,
  stringifyTokenStyle,
} from 'shiki/core';

export { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
export const bundledLanguages = {
  markdown: () => import('@shikijs/langs/markdown'),
};

export function createOnigurumaEngine(): never {
  throw new Error('The Oniguruma highlighter is not bundled.');
}
