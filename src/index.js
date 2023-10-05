'use strict'

import express from 'express';
import productsRoutes from './Routes/productos.js'; 
import cartRoutes from './Routes/cart.js';
const app = express();
const port = 8080;
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port} http://localhost:8080/api/products
    `);
});


