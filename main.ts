import { MarkEdit } from 'markedit-api';
import { format as prettify } from 'prettier';
import * as markdown from 'prettier/plugins/markdown';

MarkEdit.addMainMenuItem({
  title: 'Prettify Content',
  key: 'P',
  modifiers: ['Control', 'Command'],
  action: async() => {
    const original = MarkEdit.editorAPI.getText();
    const prettified = await prettify(original, {
      parser: 'markdown',
      plugins: [markdown],
    });

    MarkEdit.editorAPI.setText(prettified);
    MarkEdit.editorAPI.setSelections([{ from: 0, to: 0 }]);
    MarkEdit.editorView.scrollDOM.scrollTo({ top: 0 });
  }
});
