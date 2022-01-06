import "./components/Dialog";
import { $$ } from "./utilities/dom-helpers";
import { ShoppingCartManager } from "./components/ShoppingCart";
import { Inventory } from "./components/Inventory";

$$(".button").forEach((button) => {
  button.addEventListener("click", (event) => {
    button.classList.add("expanding");

    setTimeout(() => button.classList.remove("expanding"), 700);
  });
});

(async function () {
  const products = await Inventory.fetchProducts();
  const cartManager = new ShoppingCartManager(products);
  cartManager.shippingFee = (total) => (total > 150 ? 0 : total > 0 ? 20 : 0);

  window.shoppingCart = cartManager;
  console.log(cartManager);

  // Pre-populate cart with saved items from previous session
  // via localStorage
  $$("[data-product-card]").forEach((card) => {
    const id = card.id;
    const input = card.querySelector("input[data-update-cart]");

    if (input) {
      input.value = localStorage.getItem(id) || 0;
      handleEvent(input);
    }
  });
})();

$$("[data-product-grid]").forEach((section) => {
  section.addEventListener("input", (event) => {
    if (event.target.matches("[data-update-cart]")) {
      const input = event.target;
      handleEvent(input);
    }
  });
});

function handleEvent(input) {
  const quantity = input.valueAsNumber;
  const productID = input.dataset.updateCart;

  if (quantity > 10 || quantity < 0) {
    alert("Maximum of 10 items per product only");
    return;
  }

  if (quantity > -1 && productID) {
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

document.getElementById("place-order").addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.target;
  const submission = {
    name: form["full-name"].value,
    email: form["email"].value,
    products: window.shoppingCart.products.filter(
      (item) => item.quantity && item.quantity > 0
    ),
    shippingFee: window.shoppingCart.shippingFee
  };

  console.log({ submission });

  fetch(PLACEMENT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error("Response is not ok.");
      }
    })
    .then((json) => {
      console.log("RESPONSE", json);
      e.target.setAttribute("hidden", "");
      document.getElementById("order-placed").removeAttribute("hidden");

      $$("[data-customer-name]").forEach(
        (e) => (e.innerText = submission.name)
      );
      $$("[data-customer-email]").forEach(
        (e) => (e.innerText = submission.email)
      );
      $$("[data-cart-total]").forEach(
        (e) => (e.innerText = `$ ${window.shoppingCart.total.toFixed(2)}`)
      );

      // Reset local storage
      $$("[data-product-card]").forEach((card) => {
        const id = card.id;
        const input = card.querySelector("input[data-update-cart]");

        if (input) {
          localStorage.removeItem(id);
          input.value = 0;
          handleEvent(input);
        }
      });
    })
    .catch((error) => console.log("ERROR", error));
});

console.log("PLACEMENT_ENDPOINT", PLACEMENT_ENDPOINT);
