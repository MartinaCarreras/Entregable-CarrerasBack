import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

router.get('/', (req, res)=> {
    const tempManag = new ProductManager()
    res.render('home', {data: tempManag.getProducts(0)})
})

router.get('/realtimeproducts', (req, res)=>{
    const tempManag = new ProductManager()
    res.render('realTimeProducts', {data: tempManag.getProducts(0), new: false})
})

router.post('realtimeproducts', ( req, res )=> {
    const socketServer = req.app.get('socketServer');
    tempManag.addProduct (req.body)
    res.render('realTimeProducts', {data: tempManag.getProducts(0), new: true})
})

export default router