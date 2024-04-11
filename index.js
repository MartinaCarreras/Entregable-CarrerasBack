import fs from "fs"



class ProductManager {
    constructor() {
      this.path = "./datos/products.json",
      this.products = fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path, "utf-8")) : [];
    }
    addProduct(product) {
      let {title, code, description, price, thumbnail, stock} = product;
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
        fs.writeFileSync(`${this.path}`, JSON.stringify(this.products));
      } else {
        console.log("este producto ya existe")
      }
    }
    getProducts() {
      const productsFile = JSON.parse(fs.readFileSync(this.path));
      this.products = productsFile || [];
      if (this.products.length > 0) {
        return(this.products);
      } else {
        return "No tienes productos";
      }
    }
    getProductById(id){
      const productsFile = JSON.parse(fs.readFileSync(this.path));
      this.products = productsFile || [];
      let itExists = this.products.find((element)=> element.id == id)
      if (itExists) {
        return itExists;
      } else {
        return "no existe este producto";
      }
    }
    deleteProduct(id) {
      const exists = this.products.find(product => product.id == id );
      if (exists) {
        const where = this.products.indexOf(exists);
        this.products.splice(where, 1);
        fs.writeFileSync(`${this.path}`, JSON.stringify(this.products));
      }
    }
    updateProduct(id, prop, value) {
      let productToUpdate = this.products.find(product => product.id == id );
      if (productToUpdate) {
        const newProp = prop.toLowerCase()
        const exists = Object.keys(productToUpdate).includes(newProp);
        if (exists){
          let indexUpdate = this.products.indexOf(productToUpdate);
          let newProduct = { ...productToUpdate, [prop]: value };
          this.products.splice(indexUpdate, 1);
          this.products.push(newProduct);
          fs.writeFileSync(`${this.path}`, JSON.stringify(this.products));
        }
      }

    }
  }

const product1 = {
  title: "title1",
  code: "code1",
  description: "description1",
  price: "price1",
  thumbnail: "thumbnai1",
  stock: "stock1"
}
const product2 = {
    title: "title2",
    code: "code2",
    description: "description2",
    price: "price2",
    thumbnail: "thumbnai2l",
    stock: "stock2"
}

const nuevaClase = new ProductManager();
// nuevaClase.addProduct(product1);
// nuevaClase.addProduct(product2);
// console.log(nuevaClase.getProducts());
// console.log(nuevaClase.getProductById(2));
// console.log(nuevaClase.getProductById(3));
// nuevaClase.deleteProduct(2);
// nuevaClase.deleteProduct(1)
// nuevaClase.addProduct(product1);
nuevaClase.updateProduct(1, "title", "manzana")
console.log(nuevaClase)

