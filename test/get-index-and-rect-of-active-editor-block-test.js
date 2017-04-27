import _test from './helpers/test-runner';
import getIndexAndRectOfActiveEditorBlock from '../lib/get-index-and-rect-of-active-editor-block';
import setCaret from './helpers/set-caret';

const test = process.browser ? _test : () => {};

test('getIndexAndRectOfActiveEditorBlock, no selection', (t) => {
  const container = document.body.appendChild(document.createElement('div'));
  const actual = getIndexAndRectOfActiveEditorBlock(container);
  const expected = {
    index: -1,
    boundingClientRect: null,
  };
  t.deepEqual(actual, expected);
  t.end();
});

test('getIndexAndRectOfActiveEditorBlock, selection outside of container', (t) => {
  const container = document.body.appendChild(document.createElement('div'));
  const outsideOfContainerEl = document.body.appendChild(document.createElement('p'));
  outsideOfContainerEl.innerHTML = 'text text text';
  setCaret(outsideOfContainerEl, 0);
  const actual = getIndexAndRectOfActiveEditorBlock(container);
  const expected = {
    index: -1,
    boundingClientRect: null,
  };
  t.deepEqual(actual, expected);
  t.end();
});

test('getIndexAndRectOfActiveEditorBlock, with selection', (t) => {
  const container = document.body.appendChild(document.createElement('div'));
  const editorBlock = container.appendChild(document.createElement('p'));
  editorBlock.innerHTML = 'text text text';
  setCaret(editorBlock, 0);
  const actual = getIndexAndRectOfActiveEditorBlock(container);
  const expected = {
    index: 0,
    boundingClientRect: editorBlock.getBoundingClientRect(),
  };
  t.deepEqual(actual, expected);
  t.end();
});

test('getIndexAndRectOfActiveEditorBlock, with nested selection', (t) => {
  const container = document.body.appendChild(document.createElement('div'));
  const editorBlock = container.appendChild(document.createElement('p'));
  const nestedEl = editorBlock.appendChild(document.createElement('span'));
  nestedEl.innerHTML = 'text text text';
  setCaret(nestedEl, 0);
  const actual = getIndexAndRectOfActiveEditorBlock(container);
  const expected = {
    index: 0,
    boundingClientRect: editorBlock.getBoundingClientRect(),
  };
  t.deepEqual(actual, expected);
  t.end();
});

test('getIndexOfActiveItemBlock, multiple blocks', (t) => {
  const container = document.body.appendChild(document.createElement('div'));
  container.appendChild(document.createElement('p'));
  container.appendChild(document.createElement('p'));
  const editorBlock = container.appendChild(document.createElement('p'));
  editorBlock.innerHTML = 'text text text';
  setCaret(editorBlock, 0);
  const actual = getIndexAndRectOfActiveEditorBlock(container);
  const expected = {
    index: 2,
    boundingClientRect: editorBlock.getBoundingClientRect(),
  };
  t.deepEqual(actual, expected);
  t.end();
});
