import fs from 'fs';

class ProductManager {
    constructor() {
      this.path = "./src/data/products.json",
      this.products = fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path, "utf-8")) : [];
    }
    maxId(array) {
      let actId;
      if(array.length != 0) {
        let onlyIds = array.map((product)=>{
            return (product.id)
        })
        let sortedArray = onlyIds.sort((a,b)=> a-b);
        let MaxArray = sortedArray[array.length - 1];
        actId = MaxArray;
      } else {
        actId = 0;
      }
      return actId;
    }
    addProduct({title, code, description, price, thumbnail, stock, category}) {

      let newProduct = {
        title: title,
        code: code,
        description: description,
        price: price,
        thumbnail: thumbnail,
        stock: stock,
        status: true,
        category: category,
        id: this.maxId(this.products) + 1
      }
      let exists = this.products.some((product) => product.code == newProduct.code)
      if (exists === false && Object.values(newProduct).includes(undefined) == false) {
        this.products.push(newProduct)
        fs.writeFileSync(`${this.path}`, JSON.stringify(this.products));
      } else {
        console.log("este producto ya existe")
      }
    }
    getProducts(limit) {
      const productsFile = JSON.parse(fs.readFileSync(this.path));
      this.products = productsFile || [];
      if (this.products.length > 0) {
        if (limit != 0) {
          let temporalProducts = this.products;
          temporalProducts.splice(limit , temporalProducts.length - limit);
          return(temporalProducts);
        } else {
          return(this.products);
        }
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
    updateProduct(id, rest) {
      let productToUpdate = this.products.find(product => product.id == id );
      if (productToUpdate) {
        Object.keys(rest).forEach((valor)=>{
          const exists = Object.keys(productToUpdate).includes(valor);
          if (exists) {
            if (rest[valor] != "") {
              productToUpdate[valor] = rest[valor];
            }
          }
        })
        let indexUpdate = this.products.indexOf((product)=> product.id == id);
        this.products.splice(indexUpdate, 1);
        this.products.push(productToUpdate);
        fs.writeFileSync(`${this.path}`, JSON.stringify(this.products));
      }
    }
  }

  export default ProductManager;