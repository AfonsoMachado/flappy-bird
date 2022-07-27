import Barriers from "./Barriers.js";

/**
 * Recebe como parâmetro o nome da tag e classe
 * para criar um novo elemento, retornando o mesmo com
 * determinada tag e classe
 *
 * @param {String} tagName
 * @param {String} className
 *
 * @returns {HTMLElement} elemento HTML criado
 *
 */
function newElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}

/**
 *
 *
 * @param {Number} gameHeight  - para delimitar até onde o passaro pode ficar na tela
 */
function Bird(gameHeight) {
  let isFlying = false;

  this.element = newElement("img", "bird");
  this.element.src = "imgs/bird.png";

  /**
   * @returns {Number} Posição no eixo y aonde o passaro está isFlying, com relação ao bottom
   */
  this.getY = () => parseInt(this.element.style.bottom.split("px"[0]));

  /**
   * Definindo uma nova posição para o pássaro
   *
   * @param {Number} y - nova posição para o pássaro
   */
  this.setY = (y) => (this.element.style.bottom = `${y}px`);

  // Caso alguma tecla esteja pressionada, o passaro voa
  window.onkeydown = (e) => (isFlying = true);
  // Com a tecla solta, o passaro cai
  window.onkeyup = (e) => (isFlying = false);

  this.animate = () => {
    // Setando que o passaro sobre mais rapido do que cai
    const newY = this.getY() + (isFlying ? 8 : -5);
    // A height maxima do passaro é o teto
    const maxHeight = gameHeight - this.element.clientHeight;

    // Algoritmo para não deixa o passaro passar do teto ou do chao
    if (newY <= 0) {
      this.setY(0);
    } else if (newY >= maxHeight) {
      this.setY(maxHeight);
    } else {
      this.setY(newY);
    }
  };

  this.setY(gameHeight / 2);
}

function Progress() {
  this.element = newElement("span", "progress");

  /**
   * Inserindo a quantidade de pontos no html
   *
   * @param {Number} score
   */
  this.updateScore = (score) => {
    this.element.innerHTML = score;
  };

  this.updateScore(0);
}

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
