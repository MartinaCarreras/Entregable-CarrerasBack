import { Router } from "express";
import AuthConfig from '../auth/passport.config.js';

// import ProductManager from "../dao/ProductManager.js";
import ProductManager from "../dao/ProductManager.mdb.js";
import CartManager from "../dao/CartManager.mdb.js";
import UserManager from "../dao/UserManager.mdb.js";

import productModel from "../dao/models/products.model.js";
import cartModel from '../dao/models/carts.model.js';
import userModel from "../dao/models/users.model.js";

const router = Router();
AuthConfig();

const tempProdManag = new ProductManager(productModel);
const tempCartManag = new CartManager(cartModel);
const tempUserManag = new UserManager(userModel);

router.get('/', async (req, res)=> {
    console.log( await tempProdManag.getItems());
    res.render('home', {data: await tempProdManag.getItems()})
});

router.get('/error', (req, res) => {
    const { error } = req.query;
    res.render('error', {error})
});

router.get('/products', async (req, res)=> {
    let { limit, page, sort, query, available, cid } = req.query;
    if (cid){ cid = cid } else {
        req.session.user? cid = req.session.user._cart_id : cid = await tempCartManag.createCart()
    }
    let resp = await tempProdManag.getItems(limit, page, sort, query, available, cid);
    let user;
    if (req.session.user) {user = req.session.user} else {user = null};

    res.render('products', {data: resp.payload, ...resp, cid: cid, user: user});
});

router.get('/carts/:cid', async (req, res)=> {
    const {cid} = req.params
    try {
        const resp = await tempCartManag.getItems(cid)
        res.render('carts', {data: resp});
    } catch {
        res.render ('error', {error: 'Error al encontrar el carrito'});
    }
});

router.get('/realtimeproducts', async (req, res)=>{
    res.render('realTimeProducts', {data: await tempProdManag.getItems(), new: false})
});

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
});

router.get('/register', async (req,res) =>{
    if (req.session.user) {
        res.redirect('/products');
    } else {
        res.render('register', {});
    }
});

router.get('/login', async (req,res) =>{
    if (req.session.user) {
        res.redirect('/products');
    } else {
        const {error} = req.query;
    res.render('login', { error: error? true : false, error_data: error?  error : null});
    }
});

router.get('/profile', async (req,res) =>{
    if(!req.session.user) return res.redirect('/login');
    res.render('profile', {firstName: req.session.user.firstName, lastName: req.session.user.lastName, role: req.session.user.role, cid: req.session.user._cart_id})
});

export default router