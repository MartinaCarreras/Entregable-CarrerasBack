import { Router } from "express";
import CartManager from "../dao/CartManager.mdb.js";
import cartModel from '../dao/models/carts.model.js'
import Swal from "sweetalert2";

const router = Router();
const cartManager = new CartManager(cartModel);

router.get('/:cid', async ( req, res )=>{
    let products = await cartManager.getItems(req.params.cid);
    res.status(200).send(products)
});

router.post('/', async ( req, res )=>{
    await cartManager.createCart();
    res.status(200).send(`Has creado un carrito con id ${await cartManager.createCart()}`)
});

router.post('/:cid/products/:pid', async ( req, res )=>{
    const { cid, pid } = req.params;
    await cartManager.addItem(cid, pid);
    let products = await cartManager.getItems(cid);
    res.status(200).send(products)
})

router.delete('/:cid', async( req, res ) =>{
    const {cid} = req.params
    let resp = await cartManager.deleteItems(cid)
    res.status(200).send(resp)
})

router.delete('/:cid/products/:pid', async( req, res ) =>{
    const {cid, pid} = req.params
    let resp = await cartManager.deleteItem(cid, pid)
    res.status(200).send(resp)
})

router.put('/:cid', async ( req, res )=> {
    const {cid} = req.params
    let resp = await cartManager.updateCart(cid, req.body)
    res.status(200).send(resp)
})

router.put('/:cid/products/:pid', async ( req, res )=> {
    const {cid, pid} = req.params
    let resp = await cartManager.updateProduct(cid, pid, req.body)
    res.status(200).send(resp)
})

export default router