// eslint-disable-next-line max-len
/** @typedef {import("../src/display/editor/editor").AnnotationEditor} AnnotationEditor */

/**
 * Sort editors by page index and position.
 *
 * @param {AnnotationEditor} a - The first editor.
 * @param {AnnotationEditor} b - The second editor.
 * @return {Number} The comparison
 */
function editorSorter(a, b) {
  if (a.pageIndex !== b.pageIndex) {
    return a.pageIndex - b.pageIndex;
  }
  if (Math.abs(a.y - b.y) > 0.01) {
    return a.y - b.y;
  }
  return a.x - b.x;
}

export { editorSorter };
