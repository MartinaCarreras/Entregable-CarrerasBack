class ProductManager {
    constructor() {
      this.products = []
    }
    addProduct(title, code, description, price, tbumbnail, stock) {
      let newProduct = {
        title: title,
        code: code,
        description: description,
        price: price,
        thumbnail: thumbnail,
        stock: stock,
        id: this.products.length + 1
      }
      let exists = this.products.some((product) => product.code == newProduct.code)
      if (exists === false && Object.values(newProduct).includes(undefined) == false) {
        this.products.push(newProduct)
      }
    }
    getProducts() {
      if (this.products.length > 0) {
        return(this.products);
      } else {
        return "No tienes productos";
      }
    }
    getProductById(id){
      let itExists = this.products.find((element)=> element.id == id)
      if (itExists) {
        return itExists;
      } else {
        return "no existe este producto";
      }
    }
  }