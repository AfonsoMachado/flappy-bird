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
export function newElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}
