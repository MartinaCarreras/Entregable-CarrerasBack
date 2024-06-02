import { Router } from "express";
// import ProductManager from "../dao/ProductManager.js";
import ProductManager from "../dao/ProductManager.mdb.js";
import CartManager from "../dao/CartManager.mdb.js";
import model from "../dao/models/products.model.js";
import cartModel from '../dao/models/carts.model.js'


const router = Router();

const tempProdManag = new ProductManager(model);
const tempCartManag = new CartManager(cartModel);

router.get('/', (req, res)=> {
    res.render('home', {data: tempProdManag.getProducts(0)})
})

router.get('/products', async (req, res)=> {
    let { limit, page, sort, query, available, cid } = req.query;
    if (cid){cid = cid} else {cid = await tempCartManag.createCart()}
    let resp = await tempProdManag.getItems(limit, page, sort, query, available, cid);
    res.render('products', {data: resp.payload, ...resp, cid: cid});
})

router.get('/carts/:cid', async (req, res)=> {
    const {cid} = req.params
    const resp = await tempCartManag.getItems(cid);
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

export default router