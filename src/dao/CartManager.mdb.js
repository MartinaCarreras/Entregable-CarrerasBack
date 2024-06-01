import productModel from "./models/products.model.js";

class MDBCartManager {
    constructor(model) {
        this.cart = {},
        this.model = model
    };

    createCart = async( ) => {
        let carts = await this.model.collection.countDocuments();
        const newCart = {
            id: carts + 1,
            products: []
        }
        await this.model.create(newCart);
        return newCart.id
    };
    
    getItems = async ( id ) => {
        this.cart = await this.model.findOne({id: id}).populate({path: 'products._product_id', model: productModel});
        return this.cart.products;
    };
    
    addItem = async ( id, pid ) => {
        this.cart = await this.model.findOne({id: id});
        if (this.cart.products.length != 0) {
            const indexProduct = await this.cart.products.findIndex(product=> product._product_id == pid);
            if (indexProduct != -1) {
                this.cart.products[indexProduct].quantity = await this.cart.products[indexProduct].quantity + 1;
                console.log(this.cart.products);
                await this.model.findOneAndUpdate({id: +id}, {$set: {products: this.cart.products}});
            } else {
                let newProduct = { _product_id: pid, quantity:1 };
                await this.cart.products.push(newProduct)
                await this.model.findOneAndUpdate({id: +id}, {$set: {products: this.cart.products}});
            }
        } else {
            let newProduct = { _product_id: pid, quantity:1 };
            await this.cart.products.push(newProduct)
            await this.model.findOneAndUpdate({id: +id}, {$set: {products: this.cart.products}});
        }
    }
}

export default MDBCartManager;