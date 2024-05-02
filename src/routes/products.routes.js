import { Router } from "express";
import productManager from '../managers/ProductManager.js'

const newManager = new productManager();

const router = Router();

router.get('/', ( req, res )=>{
    if(req.query.limit){
        res.status(200).send(newManager.getProducts(req.query.limit));
    }else{
        res.status(200).send(newManager.getProducts(0))
    }
});

router.post('/', ( req, res )=>{
    newManager.addProduct(req.body);
    res.status(200).send(newManager.getProducts(0))
})

router.get('/:pid', ( req, res )=>{
    res.status(200).send(newManager.getProductById(req.params.pid))
});

router.put('/:pid', ( req, res )=>{
    newManager.updateProduct(req.params.pid, req.body)
    res.send(newManager.getProductById(req.params.pid));
});

router.delete('/:pid', ( req, res )=>{
    newManager.deleteProduct(req.params.pid);
    res.status(200).send(`Has eliminado el producto con id ${req.params.pid}`)
})

router.get('/carts', ( req, res )=>{
    res.status(200).send({payload: 'Cart'})
});


export default router;