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