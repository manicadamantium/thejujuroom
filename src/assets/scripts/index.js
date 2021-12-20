import { $, $$ } from "./utilities/dom-helpers";
import { ShoppingCart } from "./components/ShoppingCart";
import { Inventory } from "./components/Inventory";

$$(".button").forEach((button) => {
  button.addEventListener("click", (event) => {
    button.classList.add("expanding");

    setTimeout(() => button.classList.remove("expanding"), 700);
  });
});

$$(".cart").forEach(async (cart) => {
  const products = await Inventory.fetchProducts();
  window.shoppingCart = new ShoppingCart(cart, products);

  console.log({ shoppingCart });
});

$$("[data-product-grid]").forEach((section) => {
  section.addEventListener("input", (event) => {
    if (event.target.matches("[data-update-cart]")) {
      const input = event.target;
      handleEvent(input);
    }
  });
});

setTimeout(() => {
  // Pre-populate cart with saved items from previous session
  // via localStorage
  $$("[data-product-card]").forEach((card) => {
    const id = card.id;
    const input = card.querySelector("input[data-update-cart]");

    if (input) {
      input.value = localStorage.getItem(id);
      handleEvent(input);
    }
  });
}, 1000)

function handleEvent(input) {
  const quantity = input.value;
  const productID = input.dataset.updateCart;

  if (quantity > 10 || quantity < 0) {
    alert("Maximum of 10 items per product only");
    return;
  }

  if (quantity && productID) {
    window.shoppingCart.addItem({ id: productID, quantity });

    if (quantity > 0) {
      input.closest(".card").classList.add("selected");
      input.closest(".card").dataset.quantity = quantity;
      localStorage.setItem(productID, quantity);
    } else {
      input.closest(".card").classList.remove("selected");
      delete input.closest(".card").dataset.quantity;
      localStorage.removeItem(productID);
    }
  }
}