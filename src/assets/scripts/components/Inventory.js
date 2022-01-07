class Inventory {
  static async fetchProducts() {
    return await fetch('/api/v.1.0.0/prices.json')
      .then(response => response.json())
  }
}

export { Inventory }