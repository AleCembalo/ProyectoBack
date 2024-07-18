import { Server } from 'socket.io';

const initSocket = (httpServer) => {
    let messages = [];
    
    const io = new Server(httpServer, {
        cors: {
            origin:"*",
            methods: ["GET", "POST", "DELETE", "PUT"]
        }
    });

    io.on('connection', client => {
        
        client.emit('chatLog', messages);
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
    
        client.on('newMessage', data => {
            messages.push(data);
            console.log(`Mensaje recibido desde ${client.id}: ${data}`);
    
            io.emit('messageArrived', data);
        });
    });

    return io;
}

export default initSocket;
