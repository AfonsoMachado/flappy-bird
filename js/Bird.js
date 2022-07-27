import { newElement } from "./utils.js";

/**
 *
 *
 * @param {Number} gameHeight  - para delimitar até onde o passaro pode ficar na tela
 */
export default class Bird {
  constructor(gameHeight) {
    this.isFlying = false;
    this.gameHeight = gameHeight;

    this.element = newElement("img", "bird");
    this.element.src = "imgs/bird.png";

    // Caso alguma tecla esteja pressionada, o passaro voa
    window.onkeydown = (e) => (this.isFlying = true);
    // Com a tecla solta, o passaro cai
    window.onkeyup = (e) => (this.isFlying = false);

    this.setY(this.gameHeight / 2);
  }

  /**
   * @returns {Number} Posição no eixo y aonde o passaro está isFlying, com relação ao bottom
   */
  getY() {
    return parseInt(this.element.style.bottom.split("px"[0]));
  }

  /**
   * Definindo uma nova posição para o pássaro
   *
   * @param {Number} y - nova posição para o pássaro
   */
  setY(y) {
    return (this.element.style.bottom = `${y}px`);
  }

  animate() {
    // Setando que o passaro sobre mais rapido do que cai
    const newY = this.getY() + (this.isFlying ? 8 : -5);
    // A height maxima do passaro é o teto
    const maxHeight = this.gameHeight - this.element.clientHeight;

    // Algoritmo para não deixa o passaro passar do teto ou do chao
    if (newY <= 0) {
      this.setY(0);
    } else if (newY >= maxHeight) {
      this.setY(maxHeight);
    } else {
      this.setY(newY);
    }
  }
}
