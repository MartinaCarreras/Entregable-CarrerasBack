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

router.post('/realtimeproducts', ( req, res )=> {
    console.log('llega');
    const socketServer = req.app.get('socketServer');
    const tempManag = new ProductManager()
    socketServer.emit('Product', tempManag.maxId(tempManag.products) + 1)
})

export default router