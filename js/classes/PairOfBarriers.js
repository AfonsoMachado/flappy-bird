import Barrier from "./Barrier.js";
import { newElement } from "../util/utils.js";

/**
 *
 * @param {Number} height - Altura de uma da barreiras, a altura da segunda barreira será calculada com base nesta
 * @param {Number} opening - Abertura entre as barreiras
 * @param {Number} x - Lugar em que posição no eixo x está a barreira
 */
export default class PairOfBarriers {
  constructor(height, opening, x) {
    this.height = height;
    this.opening = opening;
    this.x = x;

    // div que define a localização do par de barreiras
    this.element = newElement("div", "pair-of-barriers");

    // Definindo o par de barreiras
    this.top = new Barrier(true);
    this.bottom = new Barrier(false);

    // Adicionando o par de barreiras dentro da div barreira
    this.element.appendChild(this.top.element);
    this.element.appendChild(this.bottom.element);

    this.drawOpening();

    this.setX(x);
  }

  /**
   * Definindo a opening entre o par de barreiras
   */
  drawOpening() {
    // Definindo uma opening no espaço disponivel
    // Gerando um valor aleatório para altura top, calcula a altura bottom e seta ambas
    const topHeight = Math.random() * (this.height - this.opening);
    const bottomHeight = this.height - this.opening - topHeight;

    this.top.setBarrierHeight(topHeight);

    this.top.setBarrierHeight(topHeight);
    this.bottom.setBarrierHeight(bottomHeight);
  }

  /**
   * Captura a width do element
   *
   * @returns {Number}
   */
  getWidth() {
    return this.element.clientWidth;
  }

  /**
   * Indica em que posição o par de barreira está.
   * Realizando um split na propriedade left, e transformando
   * o valor numérico restante, em tipo Number
   *
   * @returns {Number}
   */
  getX() {
    return parseInt(this.element.style.left.split("px")[0]);
  }

  /**
   * Atribui o valor da posição x da barreira
   *
   * @param {Number} x
   */
  setX(x) {
    return (this.element.style.left = `${x}px`);
  }
}
