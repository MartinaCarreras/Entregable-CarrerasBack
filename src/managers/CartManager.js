import fs from 'fs';
import ProductManager from './ProductManager.js';

const temporalProductManager = new ProductManager();
class CartManager {

    constructor(){
        this.path = './src/data/carrito.json',
        this.carts = fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path, 'utf-8')) : [];
    }
    
    CreateCart(){
        const newCart = {
            id: this.carts.length + 1,
            products: []
        }
        this.carts.push(newCart);
        fs.writeFileSync(`${this.path}`, JSON.stringify(this.carts))
    }
    GetProductsInCart(cid){
        this.carts = fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path, 'utf-8')) : [];
        const especifiedCart = this.carts.find((cart)=> cart.id == cid);
        if (especifiedCart) {
            const especifiedProducts = especifiedCart.products;
            if (especifiedProducts.length == 0) {
                return ('No tienes productos')
            } else {
                const productos = [];
                especifiedProducts.forEach((product)=>{
                    productos.push(temporalProductManager.getProductById(product.id));
                })
                return productos
            }
        }
    }
    AddProductById(cid, pid){
        const cidCart = this.carts.find((cart)=> cart.id == cid);
        const indexCart = this.carts.indexOf(cidCart)
        if (cidCart) {
            const indexProduct = cidCart.products.findIndex(product=> product.id == pid)
            if (indexProduct !== -1) {
                console.log('entré');
                cidCart.products[indexProduct].quantity = cidCart.products[indexProduct].quantity + 1;
            } else {
                cidCart.products.push({id: pid, quantity: 1});
            }
            this.carts.splice(indexCart, 1);
            this.carts.push(cidCart);
            fs.writeFileSync(`${this.path}`, JSON.stringify(this.carts))
        } else {
        }
    }
}

export default CartManager;