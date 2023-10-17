import express from 'express';
const router = express.Router();
import { cartManager } from '../cartManager.js';
const cartM = new cartManager('cart.json'); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Create Cart
router.post('/', async (req, res) => {
    try {
        const Cart = await cartM.addCart();

        res.status(201).json({ message: `Carrito ${Cart} created successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Create a new product or add products to Cart
router.post('/:cid/product/:pid', async (req, res) => {
    const CartId = parseInt(req.params.cid, 10);
    const ProductId = parseInt(req.params.pid, 10);

    try {
        cartM.addProductToCart(CartId, ProductId);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

// lo nuevo 
router.get('/hdb/', (req, res) => {
    res.render('index', { style: 'index.css' })
    console.log('handlebars get')

})

export default router;



