import { Router } from "express";
import CartManager from "../dao/CartManager.mdb.js";
import cartModel from '../dao/models/carts.model.js'

const router = Router();
const cartManager = new CartManager(cartModel);

router.post('/', async ( req, res )=>{
    await cartManager.CreateCart();
    res.status(200).send('Has creado un carrito')
});

router.get('/:cid', async ( req, res )=>{
    let products = await cartManager.getItems(req.params.cid);
    res.status(200).send(products)
});

router.post('/:cid/product/:pid', async ( req, res )=>{
    const { cid, pid } = req.params;
    await cartManager.addItem(cid, pid);
    let products = await cartManager.getItems(cid);
    res.status(200).send(products)
})

export default router