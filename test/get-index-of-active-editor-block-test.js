import _test from 'tape-catch';
const test = process.browser ? _test : function () {};
import getIndexOfActiveEditorBlock from '../lib/get-index-of-active-editor-block';

function setCaret (elm, position) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  const range = document.createRange();
  range.setStart(elm, position);
  selection.addRange(range);
}

test('getIndexOfActiveEditorBlock, no selection', t => {
  const container = document.body.appendChild(document.createElement('div'));
  const activeIndex = getIndexOfActiveEditorBlock(container);
  t.equal(activeIndex, -1);
  t.end();
});

test('getIndexOfActiveEditorBlock, selection outside of container', t => {
  const container = document.body.appendChild(document.createElement('div'));
  const outsideOfContainerEl = document.body.appendChild(document.createElement('p'));
  outsideOfContainerEl.innerHTML = 'text text text';
  setCaret(outsideOfContainerEl, 0);
  const activeIndex = getIndexOfActiveEditorBlock(container);
  t.equal(activeIndex, -1);
  t.end();
});

test('getIndexOfActiveEditorBlock, with selection', t => {
  const container = document.body.appendChild(document.createElement('div'));
  const editorBlock = container.appendChild(document.createElement('p'));
  editorBlock.innerHTML = 'text text text';
  setCaret(editorBlock, 0);
  const activeIndex = getIndexOfActiveEditorBlock(container);
  t.equal(activeIndex, 0);
  t.end();
});

test('getIndexOfActiveEditorBlock, with nested selection', t => {
  const container = document.body.appendChild(document.createElement('div'));
  const editorBlock = container.appendChild(document.createElement('p'));
  const nestedEl = editorBlock.appendChild(document.createElement('span'));
  nestedEl.innerHTML = 'text text text';
  setCaret(nestedEl, 0);
  const activeIndex = getIndexOfActiveEditorBlock(container);
  t.equal(activeIndex, 0);
  t.end();
});

test('getIndexOfActiveItemBlock, multiple blocks', t => {
  const container = document.body.appendChild(document.createElement('div'));
  container.appendChild(document.createElement('p'))
  container.appendChild(document.createElement('p'))
  const editorBlock = container.appendChild(document.createElement('p'));
  editorBlock.innerHTML = 'text text text';
  setCaret(editorBlock, 0);
  const activeIndex = getIndexOfActiveEditorBlock(container);
  t.equal(activeIndex, 2);
  t.end();
});
