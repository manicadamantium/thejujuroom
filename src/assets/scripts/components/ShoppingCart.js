import { createElement } from "../utilities/dom-helpers";

class ShoppingCart {
  /**
   *
   * @param {HTMLElement} element
   * @param {Array} products
   */
  constructor(element, products) {
    if (element == null) {
      throw Error("Element is null");
    }

    if (products == null) {
      throw Error("Products array is null");
    } else {
      console.log(products);
    }

    this.list = products;
    this._element = element;
    this._UI = {
      list: null,
      total: null,
    };

    this._UI.list = element.querySelector("[data-cart-list]:is(ul, ol)");
    this._UI.total = element.querySelector(
      "[data-cart-total]:is(output, [aria-role=status])"
    );
  }

  /**
   *
   * @param {Object} product
   * @param {String} product.id the id of this product
   * @param {Number} product.quantity the quantity of this item
   */
  addItem({ id, quantity }) {
    const item = this.list.find((item) => item.id === id);
    if (item) {
      item.quantity = quantity;
    }
    render(this);
  }
}

/**
 *
 * @param {ShoppingCart} cart the cart to render
 */
function render(cart) {
  const total = cart.list
    .filter((item) => item.quantity != null)
    .reduce((previous, current) => {
      return previous + current.price * current.quantity;
    }, 0);

  cart._UI.total.innerHTML = `$ ${total.toFixed(2)}`;

  removeAllChildren(cart._UI.list)

  cart.list.filter(item => item.quantity && item.quantity > 0).forEach((item) => {
    const li = createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `<span class="cart-item__name"><a href="#${item.id}">${item.name}</a> &times ${item.quantity}</span>`;
    li.innerHTML += `<span class="cart-item__price">$ ${(
      item.price * item.quantity
    ).toFixed(2)}</span>`;

    cart._UI.list.appendChild(li);
  });
}

/**
 * 
 * @param {HTMLElement} node 
 */
function removeAllChildren(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild)
  }
}

export { ShoppingCart };
