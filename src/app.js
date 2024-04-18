import fs from "fs"
import express from 'express';

const app = express();

class ProductManager {
    constructor() {
      this.path = "./datos/products.json",
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
    addProduct({title, code, description, price, thumbnail, stock}) {

      let newProduct = {
        title: title,
        code: code,
        description: description,
        price: price,
        thumbnail: thumbnail,
        stock: stock,
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

const nuevaClase = new ProductManager();

app.get('/', (req,res)=>{
  res.send('<h1>Este es mi entregable</h1><h2>Puedes poner /add para añadir los productos de ejemplo</h2>')
})

app.get('/addExample', (req, res)=> {
  let productJSON = JSON.parse(fs.readFileSync('./exampleProducts.json'));
  productJSON.forEach((productJSON)=>{
    nuevaClase.addProduct(productJSON);
  })
  res.send('Has añadido los productos de ejemplo')
})

app.get('/products', (req, res)=> {
  if(req.query.limit){
    res.send(nuevaClase.getProducts(+req.query.limit));
  }else {
    res.send(nuevaClase.getProducts(0));
  }
})
app.get('/products/:pid', (req, res)=> {
  res.send(nuevaClase.getProductById(+req.params.pid))
})

app.listen(8080, ()=>{
  console.log('Iniciando servidor');
})