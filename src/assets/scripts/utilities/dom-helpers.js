/**
 * Alias for Document.querySelector
 * @param {string} selector the selector
 * @returns {HTMLElemnt}
 */
function $(selector) {
    return document.querySelector(selector)
}

/**
 * Alias for Document.querySelectorAll
 * @param {string} selector 
 * @returns {NodeList}
 */
function $$(selector) {
    return document.querySelectorAll(selector)
}

/**
 * Alias for Document.createElement
 * @param {string} element 
 * @returns {HTMLElement}
 */
function createElement(element) {
    return document.createElement(element)
}


/**
 * Removes all children from an HTMLElement
 *
 * @param {Node} node the parent element
 */
function removeAllChildren(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
}

export { $, $$, createElement, removeAllChildren };