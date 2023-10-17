

'use strict'

import express from 'express';
const router = express.Router();
import { productManager } from '../productManager.js';

const productoManager = new productManager('products.json');


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

export default function RealtimeProductsRoutes(io) {
    router.get('/', async (req, res) => {
        try {
            const products = await productoManager.getProducts();
            const limit = parseInt(req.query.limit, 10);
            if (!isNaN(limit)) {
                res.render('realTimeProducts', { products });
            } else {
                res.render('realTimeProducts', { products });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        router.post('/product', async (req, res) => {
            const { title, description, price, stock, thumbnails, status, code, category } = req.body
            
            io.emit('productAdded', req.body);
            try {
                await productoManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
                res.send('Producto Creado')
            } catch (error) {
                if (error.message === 'El producto ya existe') {
                    res.status(400).json({ error: 'Product already exists' });
                } else {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }

        })
    });

    return router;
}