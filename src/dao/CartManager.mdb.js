class MDBCartManager {
    constructor(model) {
        this.cart = [],
        this.model = model
    };

    createCart( id ){
        const newCart = {
            id: id,
            products: []
        }
        this.model.create(newCart);
    };
    
    getItems = async ( id ) => {
        this.cart = await this.model.findById(id);
        return this.cart.products;
    };
    
    addItem = async ( id, pid ) => {
        this.cart = await this.model.findById(id);
        indexProduct = await this.cart.products.findIndex(product=> product.id == pid);
        if (indexProduct) {
            this.cart.products[indexProduct].quantity = await cidCart.products[indexProduct].quantity + 1;
            this.model.findByIdAndUpdate(id, {id: id,}, {products: this.cart.products});
        } else {
            let newProduct = { id:pid, quantity:1 };
            await this.cart.push(newProduct)
            this.model.findByIdAndUpdate(id, {id: id,}, {products: this.cart.products});
        }
    }
}

export default MDBCartManager;