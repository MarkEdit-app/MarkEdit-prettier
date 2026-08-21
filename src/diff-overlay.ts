import { FileDiff } from '@pierre/diffs';
import type { EditorView } from '@codemirror/view';
import { MarkEdit } from 'markedit-api';
import overlayCSS from './diff-overlay.css?inline';

let closeDiffHandler: (() => void) | undefined;

export function showDiff(editorView: EditorView, original: string, prettified: string): void {
  const isCurrentContext = () => {
    return MarkEdit.editorView === editorView && MarkEdit.editorAPI.getText() === original;
  };

  if (!isCurrentContext()) {
    return;
  }

  closeDiff();
  const overlay = document.createElement('section');
  overlay.className = 'markedit-prettier-overlay';
  overlay.tabIndex = -1;
  overlay.setAttribute('aria-label', 'Prettier changes');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('role', 'dialog');

  overlay.innerHTML = `
    <header class="markedit-prettier-header">
      <strong>Prettier Changes</strong>
      <div class="markedit-prettier-actions">
        <button type="button" data-action="discard">Discard</button>
        <button type="button" data-action="apply">Apply</button>
      </div>
    </header>
    <div class="markedit-prettier-diff"></div>
  `;

  const style = document.createElement('style');
  style.textContent = overlayCSS;

  const editorElement = MarkEdit.editorView.dom;
  const positionOverlay = () => {
    const bounds = editorElement.getBoundingClientRect();
    Object.assign(overlay.style, {
      top: `${bounds.top}px`,
      left: `${bounds.left}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
    });
  };

  document.head.appendChild(style);
  document.body.appendChild(overlay);
  positionOverlay();

  requestAnimationFrame(() => overlay.classList.add('is-visible'));
  MarkEdit.editorView.contentDOM.blur();

  const diffContainer = overlay.querySelector<HTMLElement>('.markedit-prettier-diff');
  const discardButton = overlay.querySelector<HTMLButtonElement>('[data-action="discard"]');
  const applyButton = overlay.querySelector<HTMLButtonElement>('[data-action="apply"]');
  if (diffContainer === null || discardButton === null || applyButton === null) {
    overlay.remove();
    style.remove();
    return;
  }

  const diff = new FileDiff({
    theme: { dark: 'pierre-dark', light: 'pierre-light' },
    diffStyle: 'unified',
    diffIndicators: 'classic',
    disableFileHeader: true,
    overflow: 'wrap',
  });

  diff.render({
    oldFile: { name: 'document.md', contents: original },
    newFile: { name: 'document.md', contents: prettified },
    containerWrapper: diffContainer,
  });

  const resizeObserver = new ResizeObserver(positionOverlay);
  resizeObserver.observe(editorElement);

  let closing = false;
  let cleanedUp = false;
  const close = () => {
    if (closing) {
      return;
    }

    closing = true;
    overlay.classList.remove('is-visible');
    overlay.style.pointerEvents = 'none';

    const cleanUp = () => {
      if (cleanedUp) {
        return;
      }

      cleanedUp = true;
      diff.cleanUp();
      resizeObserver.disconnect();
      overlay.remove();
      style.remove();
      if (closeDiffHandler === close) {
        closeDiffHandler = undefined;
        MarkEdit.editorView.focus();
      }
    };

    overlay.addEventListener('transitionend', cleanUp, { once: true });
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
    window.setTimeout(cleanUp, delay);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const activeElement = document.activeElement;
      const nextButton = activeElement === overlay
        ? event.shiftKey ? applyButton : discardButton
        : activeElement === discardButton ? applyButton : discardButton;
      nextButton.focus();
    }
  };

  discardButton.addEventListener('click', close);
  applyButton.addEventListener('click', () => {
    if (!isCurrentContext()) {
      close();
      return;
    }

    MarkEdit.editorAPI.setText(prettified);
    MarkEdit.editorAPI.setSelections([{ from: 0, to: 0 }]);
    MarkEdit.editorView.scrollDOM.scrollTo({ top: 0 });
    close();
  });

  closeDiffHandler = close;
  overlay.addEventListener('keydown', handleKeyDown);
  overlay.focus();
}

function closeDiff(): void {
  closeDiffHandler?.();
}
