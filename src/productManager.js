'use strict'

import * as fs from 'node:fs/promises'

export class  productManager {
    constructor(path) {
        this.products = [];
        this.productIdCounter = 1;
        this.error = {
            AddError: "Todos los campos son obligatorios",
            GetError: 'Error al leer el archivo ',
            UpError: 'No se encontro el producto',
            DeleteError: 'Error al borrar al producto  '

        };
        this.funciona = {
            addFunciona: "Producto agregado:",
            upFunciona: "Producto actualizado:",
            deleteFunciona: 'Se borro el producto'
        }
        this.path = path;


    }

    addProduct(title, description, price, thumbnail, code, stock,status,category) {
        if (!title || !description || !price  || !code || !stock || !status || !category) {
            throw error(this.error.AddError);
            ;
        }

        if (this.products.some(product => product.code === code)) {
            throw error(this.error.GetError);
            ;
        }
        const product = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status:true,
            category
        };

        this.products.push(product);
        fs.writeFile(this.path, JSON.stringify(this.products));
        console.log(this.funciona.addFunciona, product);
    }
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        }

        catch (err) {
            console.log(this.error.GetError)
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');

            const product = JSON.parse(data).find(product => product.id === id);
            if (product) {
                return product;
            } else {
                throw error("Producto no encontrado");
                
            }
        }
        catch (err) {
            return(this.error.UpError)
        }
    }
    async updateProduct(id, datoActualizar, nuevoValor) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const productosParse = JSON.parse(data);
            const productIndex = productosParse.findIndex(product => product.id === id);
            if (productIndex === -1) {
                throw new Error(this.error.UpError)
            }
            if (datoActualizar) {
                productosParse[productIndex][datoActualizar] = nuevoValor

            } else {
                const { title, description, price, thumbnail, code, stock, status,category } = nuevoValor
                const product = {
                    id,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    status,
                    category
                };
                productosParse[productIndex] = product
                //productIndex =  es la posicion de product en el array json 
            }
            fs.writeFile(this.path, JSON.stringify(productosParse));
            return this.funciona.upFunciona

        }
        catch (err) {
            console.log(this.error.UpError)
        }

    }
    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const productosParse = JSON.parse(data);
            const productIndex = productosParse.findIndex(product => product.id === id);
            if (productIndex === -1) {
                throw new Error(this.error.UpError)
            }
            productosParse.splice(productIndex, 1);
            fs.writeFile(this.path, JSON.stringify(productosParse));
            return this.funciona.deleteFunciona

        }
        catch (err) {
            console.log(this.error.DeleteError)
        }

    }

}


