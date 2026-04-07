import { MarkEdit } from 'markedit-api';
import { EditorView } from '@codemirror/view';
import { format as prettify } from 'prettier';
import * as markdown from 'prettier/plugins/markdown';

/**
 * Capture the cursor position as { line, col, lineText } before formatting
 * so we can restore it sensibly afterwards. Line numbers are stable across
 * Prettier reflows; absolute character offsets are not.
 */
function captureAnchor() {
  const api = MarkEdit.editorAPI;
  const sels = api.getSelections();
  if (!sels || sels.length === 0) return null;

  const caret = sels[0].from;
  const line = api.getLineNumber(caret);
  const range = api.getLineRange(line);
  const text = api.getText({ from: range.from, to: range.to });
  const col = caret - range.from;
  return { line, col, lineText: text };
}

type Anchor = ReturnType<typeof captureAnchor>;

/**
 * Find a sensible cursor target in the freshly-formatted text:
 *   1. If a line with identical content exists, jump to it (the closest one
 *      to the original line index when there are multiple matches).
 *   2. Otherwise fall back to the same line index, clamped.
 */
function findTargetOffset(formatted: string, anchor: Anchor): number {
  if (!anchor) return 0;

  const lines = formatted.split(/\r?\n/);
  let targetLine = -1;

  if (anchor.lineText && anchor.lineText.length > 0) {
    let bestDist = Infinity;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === anchor.lineText) {
        const dist = Math.abs(i - anchor.line);
        if (dist < bestDist) {
          bestDist = dist;
          targetLine = i;
          if (dist === 0) break;
        }
      }
    }
  }

  if (targetLine < 0) {
    targetLine = Math.min(anchor.line, lines.length - 1);
    if (targetLine < 0) targetLine = 0;
  }

  let offset = 0;
  for (let i = 0; i < targetLine; i++) {
    offset += lines[i].length + 1; // +1 for the line break
  }
  const lineLen = lines[targetLine] ? lines[targetLine].length : 0;
  offset += Math.min(anchor.col || 0, lineLen);
  return offset;
}

MarkEdit.addMainMenuItem({
  title: 'Prettify Content',
  key: 'P',
  modifiers: ['Control', 'Command'],
  action: async() => {
    const api = MarkEdit.editorAPI;
    const original = api.getText();
    const anchor = captureAnchor();

    const prettified = await prettify(original, {
      parser: 'markdown',
      plugins: [markdown],
    });

    if (prettified === original) {
      return;
    }

    const target = findTargetOffset(prettified, anchor);

    api.setText(prettified);
    api.setSelections([{ from: target, to: target }]);

    // Scroll the restored cursor back into view (CodeMirror does not auto-scroll
    // to a programmatically-set selection).
    MarkEdit.editorView.dispatch({
      effects: EditorView.scrollIntoView(target, { y: 'center' }),
    });
  }
});
