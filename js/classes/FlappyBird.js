import Barriers from "./Barriers.js";
import Progress from "./Progress.js";
import Bird from "./Bird.js";

/**
 * Instância do jogo Flappy Bird
 */
export default class FlappyBird {
  constructor() {
    let score = 0;

    // Definindo a área do jogo
    const gameArea = document.querySelector("[flappy]");
    const height = gameArea.clientHeight;
    const width = gameArea.clientWidth;

    // Criando os elementos do jogo
    this.progress = new Progress();
    this.barriers = new Barriers(height, width, 200, 400, () =>
      this.progress.updateScore(++score)
    );
    this.passaro = new Bird(height);

    // Inserindo os elementos do jogo na tela
    gameArea.appendChild(this.progress.element);
    gameArea.appendChild(this.passaro.element);
    this.barriers.pairs.forEach((pair) => gameArea.appendChild(pair.element));
  }

  start() {
    const temporizador = setInterval(() => {
      this.barriers.animate(3);
      this.passaro.animate();

      // Parando o jogo caso o passaro colida com alguma barreira
      if (this.isCollided(this.passaro, this.barriers)) {
        clearInterval(temporizador);
      }
    }, 20);
  }

  /**
   * Função que verfica se há colisão entre o pássaro e uma das barreiras
   *
   * @param {Bird} passaro
   * @param {Barriers} barriers
   *
   * @returns retorna true caso haja colisão entre o passaro e uma das barriers
   */
  isCollided(passaro, barriers) {
    let isCollided = false;
    barriers.pairs.forEach((pairOfBarriers) => {
      if (!isCollided) {
        const top = pairOfBarriers.top.element;
        const bottom = pairOfBarriers.bottom.element;
        // verifica se o passaro está sobrepondo alguma das barreiras se estiver sobreposto, isCollided é true
        isCollided =
          this.isOverlapping(passaro.element, top) ||
          this.isOverlapping(passaro.element, bottom);
      }
    });
    return isCollided;
  }

  /**
   * Função que verifica se dois elementos estão sobrepostos
   * verticalmente e horizontalmente
   *
   * @param {HTMLElement} elementA
   * @param {HTMLElement} elementB
   *
   * @returns retorna true caso estejam sobrepostos
   */
  isOverlapping(elementA, elementB) {
    // capturando o retangulo associado aos elementos
    const a = elementA.getBoundingClientRect();
    const b = elementB.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;

    // mesma logica para o eixo vertical
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

    // caso haja colisão horizontal e vertical, significa que os elements estão sobrepostos
    return horizontal && vertical;
  }
}
