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
function novoElemento(tagName, className) {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
}

/**
 * Recebe como parâmetro um boolean que define se
 * a barreira será reversa ou não
 *
 * @param {Boolean} reversa
 */
function Barreira(reversa = false) {
  this.elemento = novoElemento("div", "barreira");

  // Criando a borda e o corpo da barreira
  const borda = novoElemento("div", "borda");
  const corpo = novoElemento("div", "corpo");

  // Se for uma barreira reversa, primeiro aplica o corpo, e em seguida a borda; se não, o contrário
  this.elemento.appendChild(reversa ? corpo : borda);
  this.elemento.appendChild(reversa ? borda : corpo);

  /**
   * Função que define a altura do corpo da barreira
   *
   * @param {Number} altura
   */
  this.setAltura = (altura) => (corpo.style.height = `${altura}px`);
}

// Teste da barreira
// const b = new Barreira(false);
// b.setAltura(200)
// document.querySelector('[flappy]').appendChild(b.elemento)

/**
 *
 * @param {Number} altura - Altura de uma da barreiras, a altura da segunda barreira será calculada com base nesta
 * @param {Number} abertura - Abertura entre as barreiras superior e inferior
 * @param {Number} x - Lugar em que posição no eixo x está a barreira
 */
function ParDeBarreiras(altura, abertura, x) {
  // div que define a localização do par de barreiras
  this.elemento = novoElemento("div", "par-de-barreiras");

  // Definindo o par de barreiras
  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  // Adicionando o par de barreiras dentro da div barreira
  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);

  /**
   * Definindo a abertura entre o par de barreiras
   */
  this.sortearAbertura = () => {
    // Definindo uma abertura no espaço disponivel
    const alturaSuperior = Math.random() * (altura - abertura);
    const alturaInferior = altura - abertura - alturaSuperior;

    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };

  /**
   * Indica em que posição o par de barreira está.
   * Realizando um split na propriedade left, e transformando
   * o valor numérico restante, em tipo Number
   *
   * @returns {Number}
   */
  this.getX = () => parseInt(this.elemento.style.left.split("px")[0]);

  /**
   * Atribui o valor da posição x da barreira
   *
   * @param {Number} x
   */
  this.setX = (x) => (this.elemento.style.left = `${x}px`);

  /**
   * Captura a largura do elemento
   *
   * @returns {Number}
   */
  this.getLargura = () => this.elemento.clientWidth;

  // Gerando um valor aleatório para altura superior, calcula a altura inferior e set ambas
  this.sortearAbertura();

  // definindo a posição em que a barreira aparece na tela
  this.setX(x);
}

// teste
// const b = new ParDeBarreiras(700, 200, 400);
// document.querySelector('[flappy').appendChild(b.elemento)

/**
 * Função que representa todas as barreiras do jogo
 * nesse caso são usados 4 pares de barreiras
 *
 * @param {Number} altura - Altura do jogo
 * @param {Number} largura - Largura do jogo
 * @param {Number} abertura - Espaço de abertura entre as barreiras superior e inferior
 * @param {Number} espaco - Espaço entre as barreiras no eixo x
 * @param {Function} notificarPonto - Função para contabilizar os pontos
 */
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  //Definindo quatro barreiras por jogo
  this.pares = [
    // A posição inicial da barreira, é exatamente fora do jogo, por isso o parametro largura
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3),
  ];

  const deslocamento = 3;

  /**
   * Função que realiza a animação de andar as barreiras
   *
   */
  this.animar = () => {
    this.pares.forEach((par) => {
      // x atual, menos o deslocamento, setando o x novo, realizando por fim a ação de andar
      par.setX(par.getX() - deslocamento);

      // Quando o elemento sair da tela, ele retorna ao final para entrar novamente na tela, usando a função para sortear altura novamente
      if (par.getX() < -par.getLargura()) {
        // Nova posição: x atual + espaço entre as barreiras * a quantidade de barreiras
        // assim esse elemento é inserido no final, como se fosse uma fila de pares de barreiras
        par.setX(par.getX() + espaco * this.pares.length);
        // console.log(espaco * this.pares.length);
        // Sorteando uma nova abertura para a barreira
        par.sortearAbertura();
      }

      const meio = largura / 2;

      // Verificando quando uma barreira cruzar o meio da tela
      const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio;

      // caso o par de barreira conseiga passar pelo passaro, contabiliza um ponto
      if (cruzouMeio) notificarPonto();
    });
  };
}

/**
 *
 *
 * @param {Number} alturaJogo  - para delimitar até onde o passaro pode ficar na tela
 */
function Passaro(alturaJogo) {
  let voando = false;

  this.elemento = novoElemento("img", "passaro");
  this.elemento.src = "imgs/passaro.png";

  /**
   * @returns {Number} Posição no eixo y aonde o passaro está voando, com relação ao bottom
   */
  this.getY = () => parseInt(this.elemento.style.bottom.split("px"[0]));

  /**
   * Definindo uma nova posição para o pássaro
   *
   * @param {Number} y - nova posição para o pássaro
   */
  this.setY = (y) => (this.elemento.style.bottom = `${y}px`);

  // Caso alguma tecla esteja pressionada, o passaro voa
  window.onkeydown = (e) => (voando = true);
  // Com a tecla solta, o passaro cai
  window.onkeyup = (e) => (voando = false);

  this.animar = () => {
    // Setando que o passaro sobre mais rapido do que cai
    const novoY = this.getY() + (voando ? 8 : -5);
    // A altura maxima do passaro é o teto
    const alturaMaxima = alturaJogo - this.elemento.clientHeight;

    // Algoritmo para não deixa o passaro passar do teto ou do chao
    if (novoY <= 0) {
      this.setY(0);
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima);
    } else {
      this.setY(novoY);
    }
  };

  this.setY(alturaJogo / 2);
}

function Progresso() {
  this.elemento = novoElemento("span", "progresso");

  /**
   * Inserindo a quantidade de pontos no html
   *
   * @param {Number} pontos
   */
  this.atualizarPontos = (pontos) => {
    this.elemento.innerHTML = pontos;
  };

  this.atualizarPontos(0);
}

//teste
// const barreiras = new Barreiras(700, 1200, 200, 400);
// const passaro = new Pasaro(700)
// const areaDoJogo = document.querySelector('[flappy]')

// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(new Progresso().elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20)

/**
 * Função que verifica se dois elementos estão sobrepostos
 * verticalmenet e horizontalmente
 *
 * @param {HTMLElement} elementoA
 * @param {HTMLElement} elementoB
 *
 * @returns retorna true caso estejam sobrepostos
 */
function estaoSobrepostos(elementoA, elementoB) {
  // capturando o retangulo associado aos elementos
  const a = elementoA.getBoundingClientRect();
  const b = elementoB.getBoundingClientRect();

  //lado esquerdo do A + largura do A = lado direito do A
  //verifica se o lado direito do A é maior ou igual que o lado esquerdo de b
  // && vice versa
  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;

  // mesma logica para o eixo vertical
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  // caso haja colisão horizontal e vertical, significa que os elementos estão sobrepostos
  return horizontal && vertical;
}

/**
 * Função que verfica se há colisão entre o passo e uma das barreiras
 *
 * @param {Passaro} passaro
 * @param {Barreiras} barreiras
 *
 * @returns retorna true caso haja colisão entre o passaro e uma das barreiras
 */
function colidiu(passaro, barreiras) {
  let colidiu = false;
  barreiras.pares.forEach((parDeBarreiras) => {
    if (!colidiu) {
      const superior = parDeBarreiras.superior.elemento;
      const inferior = parDeBarreiras.inferior.elemento;
      // verifica se o passar está sobrepondo alguma das barreiras
      // se estiver sobreposto, colidiu é true
      colidiu =
        estaoSobrepostos(passaro.elemento, superior) ||
        estaoSobrepostos(passaro.elemento, inferior);
    }
  });
  return colidiu;
}

/**
 * Instância do jogo Flappy Bird
 */
function FlappyBird() {
  let pontos = 0;

  // Definindo a área do jogo
  const areaDoJogo = document.querySelector("[flappy]");
  const altura = areaDoJogo.clientHeight;
  const largura = areaDoJogo.clientWidth;

  // Criando os elementos do jogos
  const progresso = new Progresso();
  const barreiras = new Barreiras(altura, largura, 200, 400, () =>
    progresso.atualizarPontos(++pontos)
  );
  const passaro = new Passaro(altura);

  // Inserindo os elementos na tela
  areaDoJogo.appendChild(progresso.elemento);
  areaDoJogo.appendChild(passaro.elemento);
  barreiras.pares.forEach((par) => areaDoJogo.appendChild(par.elemento));

  this.start = () => {
    //loop do jogo
    const temporizador = setInterval(() => {
      barreiras.animar();
      passaro.animar();

      // a colisão faz com que o jogo pare
      if (colidiu(passaro, barreiras)) {
        clearInterval(temporizador);
      }
    }, 20);
  };
}

new FlappyBird().start();
