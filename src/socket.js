import { Server } from "socket.io";
import productManager from './dao/ProductManager.mdb.js'
import cartManager from './dao/CartManager.mdb.js'

const socketEngine = (http) => { // Hago una función con un http de parámetro

    const socketServer = new Server(http); // Uso el parámetro para crear el servidor socketServer
    
    
    socketServer.on('connection', client =>{  
        console.log(`Conectado id: ${client.id}, dirección: ${client.handshake.address}`); 
    
        client.on('newMessage', data => {
            console.log(`Mensaje recibido desde [${client.id}]: ${data.data}`);
            client.emit('newMessageConfirmation', data);
        });
    });

    return socketServer // Devuelvo todo lo relacionado a afuera de la función

}

export default socketEngine