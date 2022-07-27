import { newElement } from "./utils.js";

/**
 * Recebe como parâmetro um boolean que define se
 * a barreira será reversa ou não
 *
 * @param {Boolean} reverse
 */
export default class Barrier {
  constructor(reverse = false) {
    this.element = newElement("div", "barrier");

    // Criando a borda e o corpo da barreira
    ({ barrierBorder: this.barrierBorder, barrierBody: this.barrierBody } =
      this.createBarrier());

    // Se for uma barreira reversa, primeiro aplica o corpo, e em seguida a borda, se não, o contrário
    this.setBarrierPosition(reverse, this.barrierBody, this.barrierBorder);
  }

  /**
   * Função que define a altura do corpo da barreira
   *
   * @param {Number} height
   */
  setBarrierHeight(height) {
    this.barrierBody.style.height = `${height}px`;
  }

  createBarrier() {
    return {
      barrierBorder: newElement("div", "barrier-border"),
      barrierBody: newElement("div", "barrier-body"),
    };
  }

  setBarrierPosition(reverse, barrierBody, barrierBorder) {
    this.element.appendChild(reverse ? barrierBody : barrierBorder);
    this.element.appendChild(reverse ? barrierBorder : barrierBody);
  }
}
