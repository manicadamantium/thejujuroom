module.exports = {
  markdown: function (value) {
    let markdown = require("markdown-it")({
      html: true,
    });
    return markdown.render(value);
  },
  icon: function (value) {
    return `<svg class="feather" aria-hidden="true"><use href="/assets/images/feather-sprite.svg#${value}" /></svg>`;
  },
  fixed: function (number, length = 2) {
    return number.toFixed(length)
  },
  randomID: function (length = 10) {
    return new Array(10)
      .fill(0)
      .map((i) => Math.floor(Math.random() * 10))
      .join("");
  }
};
