import Barriers from "./Barriers.js";
import Bird from "./Bird.js";
import Progress from "./Progress.js";

/**
 * Função que verifica se dois elements estão sobrepostos
 * verticalmenet e horizontalmente
 *
 * @param {HTMLElement} elementA
 * @param {HTMLElement} elementB
 *
 * @returns retorna true caso estejam sobrepostos
 */
function isOverlapping(elementA, elementB) {
  // capturando o retangulo associado aos elements
  const a = elementA.getBoundingClientRect();
  const b = elementB.getBoundingClientRect();

  //lado esquerdo do A + width do A = lado direito do A
  //verifica se o lado direito do A é maior ou igual que o lado esquerdo de b
  // && vice versa
  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;

  // mesma logica para o eixo vertical
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  // caso haja colisão horizontal e vertical, significa que os elements estão sobrepostos
  return horizontal && vertical;
}

/**
 * Função que verfica se há colisão entre o passo e uma das barreiras
 *
 * @param {Bird} passaro
 * @param {Barriers} barriers
 *
 * @returns retorna true caso haja colisão entre o passaro e uma das barriers
 */
function isCollided(passaro, barriers) {
  let isCollided = false;
  barriers.pairs.forEach((pairOfBarriers) => {
    if (!isCollided) {
      const top = pairOfBarriers.top.element;
      const bottom = pairOfBarriers.bottom.element;
      // verifica se o passar está sobrepondo alguma das barreiras
      // se estiver sobreposto, isCollided é true
      isCollided =
        isOverlapping(passaro.element, top) ||
        isOverlapping(passaro.element, bottom);
    }
  });
  return isCollided;
}

/**
 * Instância do jogo Flappy Bird
 */
function FlappyBird() {
  let score = 0;

  // Definindo a área do jogo
  const gameArea = document.querySelector("[flappy]");
  const height = gameArea.clientHeight;
  const width = gameArea.clientWidth;

  // Criando os elements do jogos
  const progress = new Progress();
  const barriers = new Barriers(height, width, 200, 400, () =>
    progress.updateScore(++score)
  );
  const passaro = new Bird(height);

  // Inserindo os elements na tela
  gameArea.appendChild(progress.element);
  gameArea.appendChild(passaro.element);
  barriers.pairs.forEach((pair) => gameArea.appendChild(pair.element));

  this.start = () => {
    //loop do jogo
    const temporizador = setInterval(() => {
      barriers.animate(3);
      passaro.animate();

      // a colisão faz com que o jogo pare
      if (isCollided(passaro, barriers)) {
        clearInterval(temporizador);
      }
    }, 20);
  };
}

new FlappyBird().start();
