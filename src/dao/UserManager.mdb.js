import cartManager from './CartManager.mdb.js'
import cartModel from './models/carts.model.js'

class MDBUserManager {

    constructor (model) {
        this.user = {},
        this.model = model
    }

    register = async ( email, password, firstName, lastName, gender, role ='usuario' ) => {
        const exists = await this.model.findOne({email: email});
        if (exists) {
            console.log('Ya hay un usuario registrado con el email que ingresaste');
        } else {
            const manager = new cartManager(cartModel);
            const cartId = await manager.createCart( email );
            const newUser = {
                email: email,
                password : password,
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                role: role,
                _cart_id: cartId
            };
            await this.model.create(newUser);
            return newUser;
        }
    }
    login = async ( email, password ) => {
        const exists = await this.model.findOne({email: email, password: password})
        return exists;
    }
}

export default MDBUserManager