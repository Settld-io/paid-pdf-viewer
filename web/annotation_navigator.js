/** @typedef {import("./event_utils.js").EventBus} EventBus */
/** @typedef {import("./interfaces.js").IL10n} IL10n */

import editorSorter from "./sort-editor.js";

/**
 * @typedef {Object} AnnotationNavigatorOptions
 * @property {HTMLDivElement} container - The container of annotation navigator.
 * @property {HTMLOListElement} list - The list of annotations elements.
 * @property {HTMLSelectElement} filter - The annotations filter element.
 */

class AnnotationNavigator {
  #editors = [];

  /**
   * @param {AnnotationNavigatorOptions} options
   * @param {EventBus} eventBus - The application event bus.
   * @param {IL10n} l10n - Localization service.
   */
  constructor({ container, list, filter }, eventBus, l10n) {
    this.container = container;
    this.list = list;
    this.filter = filter;
    this.eventBus = eventBus;
    this.l10n = l10n;
    this.#bindListeners();
  }

  #format(editor) {
    return {
      id: editor.id,
      name: editor.name.replace("Editor", ""),
      pageIndex: editor.pageIndex,
      x: editor.x,
      y: editor.y,
      width: editor.width,
      height: editor.height,
    };
  }

  #formatHTML(editor) {
    return `<li id="${editor.id}_li" class="annotationNavigatorItem">
      <h4>${editor.name}</h4>
      <p>Page ${editor.pageIndex}</p>
      <p>X: ${editor.x.toFixed(4)} / Y: ${editor.y.toFixed(4)}</p>
      <button type="button" data-editor="${editor.id}" data-page="${editor.pageIndex}" data-x="${editor.x}" data-y="${editor.y}">Focus</button>
    </li>`;
  }

  #updateUI() {
    // eslint-disable-next-line no-unsanitized/property
    this.list.innerHTML = this.#editors.map(this.#formatHTML).join("");
  }

  #isElementInViewport(id) {
    const el = document.getElementById(id);
    const rect = el?.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  #bindListeners() {
    window.PDFViewerApplication.eventBus.on(
      "pdfjs.annotation.editor_add",
      event => {
        const index = this.#editors.findIndex(e => e.id === event.editor.id);
        if (index === -1) {
          this.#editors.unshift(this.#format(event.editor));
        } else {
          this.#editors[index] = this.#format(event.editor);
        }
        this.#editors = this.#editors.sort(editorSorter);
        this.#updateUI();
      }
    );

    window.PDFViewerApplication.eventBus.on(
      "pdfjs.annotation.editor_remove",
      event => {
        this.#editors = this.#editors.filter(e => e.id !== event.editor.id);
        this.#updateUI();
      }
    );

    this.list.addEventListener("click", event => {
      if (event.target.nodeName === "BUTTON") {
        const editorId = event.target.dataset.editor;
        const pageNumber = Number(event.target.dataset.page);
        if (editorId) {
          if (!this.#isElementInViewport(editorId)) {
            window.PDFViewerApplication.pdfViewer.scrollPageIntoView({
              pageNumber,
            });
          }
          setTimeout(() => {
            const targetEditor = document.getElementById(editorId);
            if (targetEditor) {
              targetEditor.focus();
            }
          }, 300);
        }
      }
    });
  }
}

export { AnnotationNavigator };
