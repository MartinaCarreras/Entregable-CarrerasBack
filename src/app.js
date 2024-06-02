import express  from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ViewsRoutes from './routes/views.routes.js';
import ProductRoutes from './routes/products.routes.js';
import CartRoutes from './routes/carts.routes.js';
import { config } from './config.js';
import mongoose from 'mongoose';
import innerSocket from './socket.js'

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use('', ViewsRoutes)
app.use('/api/products', ProductRoutes);
app.use('/api/carts', CartRoutes);
app.use(express.static(`${config.DIRNAME}/public`));


const httpServer = app.listen(config.PORT, async ()=> {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`Servidor iniciado en ${config.PORT}`);
})

app.set('socketServer', innerSocket(httpServer))
