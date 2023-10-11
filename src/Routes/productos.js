import express from 'express';
const router = express.Router();
import { productManager } from '../productManager'; 


const productManager = new productManager('products.json'); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit, 10);
        if (!isNaN(limit)) {
            res.json(JSON.parse(products.slice(0, limit)))
        } else {
            res.json(JSON.parse(products));
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }

    try {
        const product = await productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        if (error.message === productManager.error.UpError) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Create a new product
router.post('/', async (req, res) => {
    const { title, description, price, thumbnails, code, stock, status, category } = req.body;

    try {
        productManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        if (error.message === 'El producto ya existe') {
            res.status(400).json({ error: 'Product already exists' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Update a product by ID
router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    if (isNaN(productId)) {
        res.status(400).json({ error: ' ID invalido ' });
        return;
    }
    const { fieldToUpdate, newValue } = req.body;

    try {
        const message = await productManager.updateProduct(productId, fieldToUpdate, newValue);
        res.json({ message });
    } catch (error) {
        if (error.message === productManager.error.UpError) {
            res.status(404).json({ error: 'No se encontro el producto ' });
        } else {
            res.status(500).json({ error: 'Error de servidor ' });
        }
    }
});

// Delete a product by ID
router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    if (isNaN(productId)) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }

    try {
        const message = await productManager.deleteProduct(productId);
        res.json({ message });
    } catch (error) {
        if (error.message === productManager.error.UpError) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

export default router;