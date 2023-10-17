'use strict'

import { createServer } from 'node:http'
import express from 'express';
import productsRoutes from './routes/productos.js'
import cartRoutes from './routes/cart.js';
import RealtimeProductsRoutes from './routes/realtimeprods.js';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { productManager } from './productManager.js';
import { join } from 'node:path'

const productoManager = new productManager('products.json'); 
const app = express();
const server = createServer(app)
const io = new Server(server)
const port = 3000;

// motor de plantilla handlebars
app.engine('.hbs', engine({
    extname: '.hbs',
    // layoutsDir: join(app.get('views'), 'layouts'),
    defaultLayout: 'main'
}))
// Tell Express to use the handlebars template engine for rendering HTML files with .hbs extension
app.set("view engine", ".hbs");

app.set('views', join(process.cwd(), 'src', 'views'));
app.use(express.static(join(process.cwd(), '/public')));


app.use('/api/products', productsRoutes);

app.use('/api/carts', cartRoutes);

app.use('/realtimeproducts', RealtimeProductsRoutes(io))

io.on('connection', (socket) => {
    console.log('Probando')
    socket.on('message', data => {
        console.log(`Mensaje recibido ${data}`)
    }
    )

    socket.on('productAdded', (productData) => {
        // Broadcast the product data to all connected clients
        io.emit('productAdded', productData);
    });

})

// Start the Socket server
server.listen(port, () => {
console.log(`Server is running on port  ${port}`);
});