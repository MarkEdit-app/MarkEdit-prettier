import { MarkEdit } from 'markedit-api';
import { format as prettify } from 'prettier';
import * as markdown from 'prettier/plugins/markdown';
import type { Options } from 'prettier';
import { showDiff } from './src/diff-overlay';

const userSettings = MarkEdit.userSettings['extension.markeditPrettier'];
const prettierOptions = (typeof userSettings === 'object' && userSettings !== null && !Array.isArray(userSettings) ? userSettings : {}) as Options;

MarkEdit.addMainMenuItem({
  title: 'Prettify Content',
  key: 'P',
  modifiers: ['Control', 'Command'],
  action: async() => {
    const editorView = MarkEdit.editorView;
    const original = MarkEdit.editorAPI.getText();
    const prettified = await prettify(original, {
      ...prettierOptions,
      parser: 'markdown',
      plugins: [markdown],
    });

    if (prettified !== original) {
      showDiff(editorView, original, prettified);
    }
  }
});
