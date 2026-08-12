import { MarkEdit } from 'markedit-api';
import { format as prettify } from 'prettier';
import * as markdown from 'prettier/plugins/markdown';
import type { Options } from 'prettier';

const userSettings = MarkEdit.userSettings['extension.markeditPrettier'];
const prettierOptions = (typeof userSettings === 'object' && userSettings !== null && !Array.isArray(userSettings) ? userSettings : {}) as Options;

MarkEdit.addMainMenuItem({
  title: 'Prettify Content',
  key: 'P',
  modifiers: ['Control', 'Command'],
  action: async() => {
    const original = MarkEdit.editorAPI.getText();
    const prettified = await prettify(original, {
      ...prettierOptions,
      parser: 'markdown',
      plugins: [markdown],
    });

    MarkEdit.editorAPI.setText(prettified);
    MarkEdit.editorAPI.setSelections([{ from: 0, to: 0 }]);
    MarkEdit.editorView.scrollDOM.scrollTo({ top: 0 });
  }
});
