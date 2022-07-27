import { newElement } from "../util/utils.js";

export default class Progress {
  constructor() {
    this.element = newElement("span", "progress");
    this.updateScore(0);
  }

  /**
   * Inserindo a quantidade de pontos no html
   *
   * @param {Number} score
   */
  updateScore(score) {
    this.element.innerHTML = score;
  }
}
