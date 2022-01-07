import { createElement, removeAllChildren } from "../utilities/dom-helpers";

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
  addItem({ id, quantity, variantID = null }) {
    const item = this.products.find((i) => i.id === id);
    if (item) {
      let variant;
      if (variantID && item.variants) {
        variant = item.variants.find((i) => i.id === variantID);
        item.selectedVariant = variant;
      }

      if ((variant != null && variant.price != null) || item.price) {
        item.quantity = quantity;
      }
      console.log(item);
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
   * The total cost of selected items and the shipping fee
   *
   * @readonly
   * @memberof ShoppingCartManager
   */
  get total() {
    return this.subtotal + this.shippingFee;
  }

  /**
   * The total cost of selected items without the shipping fee
   *
   * @readonly
   * @memberof ShoppingCartManager
   */
  get subtotal() {
    return this.products
      .filter((item) => item.quantity > 0)
      .reduce((previous, current) => {
        let itemPrice = 1;
        if (current.selectedVariant) {
          itemPrice = current.selectedVariant.price;
        } else {
          itemPrice = current.price;
        }

        const itemTotal = itemPrice * current.quantity;
        return previous + itemTotal;
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
    return this._shippingFeeCalculator(this.subtotal);
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

          let itemPrice = 1;
          if (item.selectedVariant) {
            itemPrice = item.selectedVariant.price;
          } else {
            itemPrice = item.price;
          }

          const itemTotal = itemPrice * item.quantity;
          li.innerHTML += `<span class="cart-item__price">$ ${itemTotal.toFixed(2)}</span>`;

          list.appendChild(li);
        });

      if (this.subtotal > 0) {
        const shippingFee = document.createElement("li");
        shippingFee.classList.add("cart-item", "margin-top--xl");
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

export { ShoppingCartManager };
