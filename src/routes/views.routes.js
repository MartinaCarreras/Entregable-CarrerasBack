import { Router } from "express";
// import ProductManager from "../dao/ProductManager.js";
import ProductManager from "../dao/ProductManager.mdb.js";
import CartManager from "../dao/CartManager.mdb.js";
import UserManager from "../dao/UserManager.mdb.js";
import productModel from "../dao/models/products.model.js";
import cartModel from '../dao/models/carts.model.js'
import userModel from "../dao/models/users.model.js";
import passport from "passport";
import AuthConfig from '../auth/passport.config.js'


const router = Router();
AuthConfig();

const tempProdManag = new ProductManager(productModel);
const tempCartManag = new CartManager(cartModel);
const tempUserManag = new UserManager(userModel);

router.get('/', (req, res)=> {
    res.render('home', {data: tempProdManag.getProducts(0)})
})

router.get('/products', async (req, res)=> {
    let { limit, page, sort, query, available, cid } = req.query;
    if (cid){ cid = cid } else {
        req.session.user? cid = req.session.user._cart_id : cid = await tempCartManag.createCart()
    }
    let resp = await tempProdManag.getItems(limit, page, sort, query, available, cid);
    let user;
    if (req.session.user) {user = req.session.user} else {user = null};

    res.render('products', {data: resp.payload, ...resp, cid: cid, user: user});
})

router.get('/carts/:cid', async (req, res)=> {
    const {cid} = req.params
    const resp = await tempCartManag.getItems(cid);
    console.log(resp);
    res.render('carts', {data: resp});
})

router.get('/realtimeproducts', (req, res)=>{
    const tempManag = new ProductManager()
    res.render('realTimeProducts', {data: tempManag.getProducts(0), new: false})
})

router.post('/realtimeproducts', ( req, res )=> {
    
    const socketServer = req.app.get('socketServer');
    const tempManag = new ProductManager()
    const {type, content} = req.body;

    if (type == 'add') {

        tempManag.addProduct(content);
        socketServer.emit('added', tempManag.maxId(tempManag.products))

    } else if (type == 'delete') {
        tempManag.deleteProduct(content);
        socketServer.emit('deleted', content);

    }
})

router.get('/register', async (req,res) =>{
    if (req.session.user) {
        res.redirect('/products');
    } else {
        res.render('register', {});
    }
})

router.post('/register', passport.authenticate('register'), async (req,res) =>{
    try {
        req.session.user = req.user;
        res.redirect('/products')
    } catch {
        res.status(500);
    }
});

router.get('/login', async (req,res) =>{
    if (req.session.user) {
        res.redirect('/products');
    } else {
        res.render('login', {});
    }
})

router.post('/login', passport.authenticate('login'), async (req,res) =>{
    try {
        req.session.user = req.user;
        res.redirect('/products')
    } catch {
        res.status(500);
    }

})

router.get('/profile', async (req,res) =>{
    if(!req.session.user) return res.redirect('/login');
    res.render('profile', {firstName: req.session.user.firstName, lastName: req.session.user.lastName, role: req.session.user.role, cid: req.session.user._cart_id})
})

router.get('/logout', async (req,res) =>{
    if (!req.session.user) return res.status(500).send('Nunca iniciaste sesión');
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch {
        res.status(500).send('Error al cerrar sesión.')
    }
})

export default router