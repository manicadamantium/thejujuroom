import { createElement } from "../utilities/dom-helpers";

/**
 *
 * @class ShoppingCart
 * @deprecated
 */
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

  removeAllChildren(cart._UI.list);

  cart.list
    .filter((item) => item.quantity && item.quantity > 0)
    .forEach((item) => {
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
    node.removeChild(node.lastChild);
  }
}

/**
 *
 *
 * @class ShoppingCartManager
 * @property
 */
class ShoppingCartManager {
  /**
   * Creates an instance of ShoppingCartManager.
   * @param {*} [products=[]] the list of products
   * @memberof ShoppingCartManager
   */
  constructor(products = []) {
    if (products == null) {
      throw Error("Products array is null");
    } else {
      console.log("[SHOPPING_CART_MANAGER] products", products);
    }

    /**
     * the list of available products
     * @property {Array}
     * @public
     */
    this.products = products;

    /**
     * @property {*}
     * @private
     */
    this._UI = {
      lists: [...document.querySelectorAll("[data-cart-list]:is(ul, ol)")],
      totalDisplays: [
        ...document.querySelectorAll(
          "[data-cart-total]:is(output, [aria-role=status])"
        ),
      ],
    };

    this.events = {
      change: [],
    };

    this.events.change.forEach((fn) =>
      fn({
        product: null,
        products: this.products,
        total: this.total,
        totalItems: this.totalItems,
      })
    );

    this._shippingFeeCalculator = () => 0;
  }

  /**
   * Adds an item to the cart
   *
   * @param {*} object
   * @param {string} object.id the ID of the product
   * @param {number} quantity the quantity of the product
   * @memberof ShoppingCartManager
   */
  addItem({ id, quantity }) {
    const item = this.products.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
    }

    this._renderCarts();
    this.events.change.forEach((fn) =>
      fn({
        product: item,
        products: this.products,
        total: this.total,
        totalItems: this.totalItems,
      })
    );
  }

  /**
   *
   * @property {number}
   * @readonly
   * @memberof ShoppingCartManager
   */
  get total() {
    return this.totalProducts + this.shippingFee;
  }

  get totalProducts() {
    return this.products
      .filter((item) => item.quantity != null && item.quantity > 0)
      .reduce((previous, current) => {
        const itemPrice = current.price * current.quantity;
        return previous + itemPrice;
      }, 0);
  }

  get totalItems() {
    return this.products
      .filter((item) => item.quantity != null && item.quantity > 0)
      .reduce((previous, current) => {
        return previous + current.quantity;
      }, 0);
  }

  set shippingFee(fn) {
    this._shippingFeeCalculator = fn ? fn : () => 0;
  }

  get shippingFee() {
    return this._shippingFeeCalculator(this.totalProducts);
  }

  _renderCarts() {
    this._UI.lists.forEach((list) => {
      removeAllChildren(list);
      this.products
        .filter((item) => item.quantity && item.quantity > 0)
        .forEach((item) => {
          const li = createElement("li");
          li.classList.add("cart-item");
          li.innerHTML = `<span class="cart-item__name"><a href="#${item.id}">${item.name}</a> &times ${item.quantity}</span>`;
          li.innerHTML += `<span class="cart-item__price">$ ${(
            item.price * item.quantity
          ).toFixed(2)}</span>`;

          list.appendChild(li);
        });

      if (this.totalItems > 0) {
        const shippingFee = document.createElement("li");
        shippingFee.classList.add("cart-item");
        shippingFee.innerHTML = `<span class="cart-item__name">Shipping Fee</span><span class="cart-item__price">$ ${this.shippingFee.toFixed(2)}</span>`;
        list.appendChild(shippingFee);
      }
    });

    const totalPrice = this.total;

    this._UI.totalDisplays.forEach(
      (i) => (i.innerHTML = `$ ${totalPrice.toFixed(2)}`)
    );
  }
}

export { ShoppingCart, ShoppingCartManager };
