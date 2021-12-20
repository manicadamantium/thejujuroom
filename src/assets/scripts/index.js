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

      if (quantity > 10 || quantity < 0) {
        alert("Maximum of 10 items per product only")
        return
      }

      if (quantity && productID) {
        shoppingCart.addItem({ id: productID, quantity })

        if (quantity > 0) {
          input.closest(".card").classList.add("selected");
          input.closest(".card").dataset.quantity = quantity;
        } else {
          input.closest(".card").classList.remove("selected")
          delete input.closest(".card").dataset.quantity
        }
      }
    }
  });
});