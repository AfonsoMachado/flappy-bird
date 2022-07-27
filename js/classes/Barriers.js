import PairOfBarriers from "./PairOfBarriers.js";

/**
 * Função que representa todas as barreiras do jogo,
 * nesse caso são usados 4 pares de barreiras
 *
 * @param {Number} height - Altura do jogo
 * @param {Number} width - Largura do jogo
 * @param {Number} opening - Espaço de abertura entre as barreiras
 * @param {Number} space - Espaço entre as barreiras no eixo x
 * @param {Function} notifyScore - Função para contabilizar os pontos
 */
export default class Barriers {
  constructor(height, width, opening, space, notifyScore) {
    this.width = width;
    this.space = space;
    this.notifyScore = notifyScore;

    //Definindo quatro barreiras por jogo
    this.pairs = [
      // A posição inicial da barreira, é exatamente fora do jogo, por isso o parametro de largura
      new PairOfBarriers(height, opening, width),
      new PairOfBarriers(height, opening, width + space),
      new PairOfBarriers(height, opening, width + space * 2),
      new PairOfBarriers(height, opening, width + space * 3),
    ];
  }

  /**
   * Função que realiza a animação de andar as barreiras
   *
   * @param {Number} displacement - Taxa de deslocamento das barreiras
   */
  animate(displacement) {
    this.pairs.forEach((par) => {
      // x atual, menos o distanciamento, setando o x novo, realizando por fim a ação de andar
      par.setX(par.getX() - displacement);

      // Quando o elemento sair da tela, ele retorna ao final para entrar novamente na tela, usando a função para sortear altura novamente
      if (par.getX() < -par.getWidth()) {
        // Nova posição: x atual + espaço entre as barreiras * a quantidade de barreiras
        // assim esse element é inserido no final, como se fosse uma fila de pares de barreiras
        par.setX(par.getX() + this.space * this.pairs.length);
        // Sorteando uma nova abertura para a barreira
        par.drawOpening();
      }

      const middle = this.width / 2;

      // Verificando quando uma barreira cruzar o meio da tela
      const crossedHalfScreen =
        par.getX() + displacement >= middle && par.getX() < middle;

      // caso o par de barreira consiga passar pelo passaro, contabiliza um ponto
      if (crossedHalfScreen) this.notifyScore();
    });
  }
}
