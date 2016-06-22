import _test from 'tape-catch';
const test = process.browser ? _test : function () {};
import getCurrentEditorItem from '../lib/get-current-editor-item';

function setCaret (elm, position) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  const range = document.createRange();
  range.setStart(elm, position);
  selection.addRange(range);
}

test('getCurrentEditorItem, no selection', t => {
  const container = document.body.appendChild(document.createElement('div'));
  const currentEditorItem = getCurrentEditorItem(container);
  t.equal(currentEditorItem, null);
  t.end();
});

test('getCurrentEditorItem, selection outside of container', t => {
  const container = document.body.appendChild(document.createElement('div'));
  const outsideOfContainerEl = document.body.appendChild(document.createElement('p'));
  outsideOfContainerEl.innerHTML = 'text text text';
  setCaret(outsideOfContainerEl, 0);
  const currentEditorItem = getCurrentEditorItem(container);
  t.equal(currentEditorItem, null);
  t.end();
});

test('getCurrentEditorItem, with selection', t => {
  const container = document.body.appendChild(document.createElement('div'));
  const editorBlock = container.appendChild(document.createElement('p'));
  editorBlock.innerHTML = 'text text text';
  setCaret(editorBlock, 0);
  const currentEditorItem = getCurrentEditorItem(container);
  t.equal(currentEditorItem, editorBlock);
  t.end();
});

test('getCurrentEditorItem, with nested selection', t => {
  const container = document.body.appendChild(document.createElement('div'));
  const editorBlock = container.appendChild(document.createElement('p'));
  const nestedEl = editorBlock.appendChild(document.createElement('span'));
  nestedEl.innerHTML = 'text text text';
  setCaret(nestedEl, 0);
  const currentEditorItem = getCurrentEditorItem(container);
  t.equal(currentEditorItem, editorBlock);
  t.end();
});
