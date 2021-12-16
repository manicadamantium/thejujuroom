import { $$ } from "./utilities/dom-helpers";
$$(".button").forEach((button) => {
  button.addEventListener("click", (event) => {
    button.classList.add("expanding");

    setTimeout(() => button.classList.remove("expanding"), 700);
  });
});
