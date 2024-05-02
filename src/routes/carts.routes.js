import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post('/', ( req, res )=>{
    cartManager.CreateCart();
    res.status(200).send('Has creado un carrito')
});

router.get('/:cid', ( req, res )=>{
    res.status(200).send(cartManager.GetProductsInCart(req.params.cid));
});

router.post('/:cid/product/:pid', ( req, res )=>{
    const { cid, pid } = req.params;
    cartManager.AddProductById(cid, pid)
    res.status(200).send(cartManager.GetProductsInCart(cid));
})

export default router