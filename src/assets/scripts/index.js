import { $, $$ } from "./utilities/dom-helpers";
import { ShoppingCart } from "./components/ShoppingCart";
import { Inventory } from "./components/Inventory";

$$(".button").forEach((button) => {
  button.addEventListener("click", (event) => {
    button.classList.add("expanding");

    setTimeout(() => button.classList.remove("expanding"), 700);
  });
});

$$('.cart').forEach(async cart => {
  const products = await Inventory.fetchProducts();
  window.shoppingCart = new ShoppingCart(cart, products)
  
  console.log({ shoppingCart })
})

$$("[data-product-grid]").forEach((section) => {
  section.addEventListener("input", (event) => {
    console.log(event);

    if (event.target.matches("[data-update-cart]")) {
      const input = event.target
      const quantity = input.value
      const productID = input.dataset.updateCart

      if (quantity && productID) {
        shoppingCart.addItem({ id: productID, quantity })
      }
    }
  });
});