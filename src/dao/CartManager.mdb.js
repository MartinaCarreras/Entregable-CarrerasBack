import productModel from "./models/products.model.js";

class MDBCartManager {
    constructor(model) {
        this.cart = {},
        this.model = model
    };

    createCart = async( ) => {
        const newCart = {
            products: []
        }

        const mongoUser = await this.model.create(newCart);
        return JSON.parse(JSON.stringify(mongoUser._id));
    };
    
    getItems = async ( id ) => {
        // this.cart = await this.model.findById(id);
        this.cart = await this.model.findById(id).populate({path: 'products._product_id', model: productModel});
        console.log(this.cart);
        let tempArray = [];
        this.cart.products.forEach(product=> {
            let tempObj = {
                _product_id: {
                    _id: product._product_id._id,
                    title: product._product_id.title,
                    code: product._product_id.code,
                    description: product._product_id.description,
                    price: product._product_id.price,
                    thumbnail: product._product_id.thumbnail,
                    stock: product._product_id.stock,
                    category: product._product_id.category
                },
                quantity: product.quantity
            }
            tempArray.push(tempObj);
        })
        return tempArray;
    };
    
    addItem = async ( id, pid ) => {
        this.cart = await this.model.findById(id);
        if (this.cart.products.length != 0) {
            const indexProduct = await this.cart.products.findIndex(product=> product._product_id == pid);
            if (indexProduct != -1) {
                this.cart.products[indexProduct].quantity = await this.cart.products[indexProduct].quantity + 1;
                console.log(this.cart.products);
                await this.model.findByIdAndUpdate(id, {$set: {products: this.cart.products}});
            } else {
                let newProduct = { _product_id: pid, quantity:1 };
                await this.cart.products.push(newProduct)
                await this.model.findByIdAndUpdate(id, {$set: {products: this.cart.products}});
            }
        } else {
            let newProduct = { _product_id: pid, quantity:1 };
            await this.cart.products.push(newProduct)
            await this.model.findByIdAndUpdate(id, {$set: {products: this.cart.products}});
        }
    }

    deleteItem = async ( cid, pid ) => {
        this.cart = await this.model.findById(cid);
        let nuevosProducts = [];
        this.cart.products.forEach(product=> {
            if (product._product_id != pid) {
                nuevosProducts.push(product)
            }
        })
        this.cart = await this.model.findByIdAndUpdate(cid, {$set: {products: nuevosProducts}});
        return await this.getItems(cid);
    }
    
    deleteItems = async ( cid ) => {
        this.cart = await this.model.findByIdAndUpdate(cid, {$set: {products: []}});
    }
    
    updateCart = async ( cid, body ) => {
        if (typeof body == "array") {
            await this.model.findByIdAndUpdate(cid, {$set: {products: body}});
            return this.getItems(cid);
        } else {
            return 'ERROR, su body no es compatible'
        }
    }
    
    updateProduct = async ( cid, pid, body ) => {
        if (Object.keys(body).includes('quantity')) {
            this.cart = await this.model.findById(cid);
            let productsAct = []
            await this.cart.products.forEach(product => {
                if (product._product_id != pid) {
                    productsAct.push(product);
                    return 'si'
                } else {
                    let nuevoProduct = {_product_id: product._product_id ,quantity: +body.qty, _id: product._id};
                    productsAct.push(nuevoProduct)
                    return 'no'
                }
            })
            this.cart = await this.model.findByIdAndUpdate(cid, {$set: {products: productsAct}});
            return await this.getItems(cid);
        } else {
            return 'ERROR. Debes ingresar un JSON con un objeto con propiedad "quantity'
        }
        
    }
}

export default MDBCartManager;