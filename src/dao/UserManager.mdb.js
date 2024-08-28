import cartManager from './CartManager.mdb.js'
import cartModel from './models/carts.model.js'
import bcrypt from 'bcrypt'

class MDBUserManager {

    constructor (model) {
        this.user = {},
        this.model = model
    }

    register = async ( email, password, firstName, lastName, gender = 'None', role ='usuario' ) => {
        const exists = await this.model.findOne({email: email});
        if (exists) {
            return {error: 500};
        } else {
            const manager = new cartManager(cartModel);
            const cartId = await manager.createCart( email );
            let codedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

            const newUser = {
                email: email,
                password : codedPassword,
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
        const exists = await this.model.findOne({email: email})
        let returns = {};
        if (exists && bcrypt.compareSync(password, exists.password)){
            returns = exists;
        } else {
            returns = {error: 401};
        }
        return returns;
    }

    loginHub = async ( email, password, name ) => {
        // console.log(`${email} ${password} ${name}`);
        let result = await this.login(email, password);
        if (Object.keys(result).includes('error')) {
            let user = name.split(" ");
            let lastname = user.pop();
            result = await this.register(email, password, user.join(' '), lastname);
        }
        result = await this.model.findOne({email: email})
        return result;
    }
}

export default MDBUserManager