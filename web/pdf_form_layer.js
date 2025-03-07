/**
 * @typedef {Object} PDFFormLayerOptions
 * @property {HTMLFormElement} form - The form of PDF.
 */

import { AnnotationEditorType } from "pdfjs-lib";

class PDFFormLayer {
  #enabled = false;

  /**
   * @param {PDFFormLayerOptions} options
   * @param {EventBus} eventBus - The application event bus.
   * @param {IL10n} l10n - Localization service.
   */
  constructor({ form }, eventBus, l10n) {
    this.form = form;
    this.eventBus = eventBus;
    this.l10n = l10n;
    this.#bindListeners();
  }

  #bindListeners() {
    this.eventBus.on("toggleformlayer", () => {
      console.log(this.#enabled);

      this.eventBus.dispatch("switchannotationeditormode", {
        source: this,
        mode: AnnotationEditorType.NONE,
      });
      if (this.#enabled) {
        this.disableLayer();
      } else {
        this.enableLayer();
      }
    });
  }

  enableLayer() {
    this.#enabled = true;
  }

  disableLayer() {
    this.#enabled = false;
  }

  submit() {
    if (this.#enabled) {
      this.form.submit();
    } else {
      console.error("PDFFormLayer is not enabled.");
    }
  }
}

export { PDFFormLayer };
