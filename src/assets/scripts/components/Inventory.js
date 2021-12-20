class Inventory {
  static async fetchProducts() {
    return await fetch('/api/v.1.0.0/products.json')
      .then(response => response.json())
  }
}

export { Inventory }