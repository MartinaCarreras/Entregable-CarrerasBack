import { Router } from "express";
import ProductManager from "../dao/ProductManager.mdb.js";
import model from "../dao/models/products.model.js";

const newManager = new ProductManager(model);

const router = Router();

router.get('/', async ( req, res )=>{
    const { limit, page, sort, query } = req.query;
    let products = await newManager.getItems(limit, page, query, sort);
    res.status(200).send({ status: 'success', payload: products});
});

router.post('/', async ( req, res )=>{
    await newManager.addItem(req.body);
    let products = await (newManager.getItems(0));
    res.status(200).send(products)
})

router.get('/:pid', async ( req, res )=>{
    let products = await newManager.getById(req.params.pid)
    res.status(200).send(products);
});

router.put('/:pid', async ( req, res )=>{
    await newManager.updateItem(req.params.pid, req.body)
    let products = await newManager.getById(req.params.pid)
    res.send(products);
});

router.delete('/:pid', async ( req, res )=>{
    await newManager.deleteItem(req.params.pid);
    res.status(200).send(`Has eliminado el producto con id ${req.params.pid}`)
})

router.get('/carts', ( req, res )=>{
    res.status(200).send({payload: 'Cart'})
});


export default router;