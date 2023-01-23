const initProducts = require('../data/products.json');
const errors = require('../utils/errors');
const repository = () => {
    /*
        productsData schema
        [
            {
                productId: string,
                name: string,
                price: number
            }
        ]
    */
    let productsData = [];
    /*
        productsDataObject schema
        {
            productId: {
                productId: string,
                name: string,
                price: number
            }
        }
    */
    let productsDataObject = {}; // allows for faster get of specific product for larger inventory
    /*
        shoppingCartData schema
        [
            {
                productId: string,
                name: string,
                price: number
            }
        ]
    */
    const shoppingCartData = [];

    this.seedProducts = () => {
        const transformedProducts = initProducts.map((p) => {
            const productId = p.uuid.toString();
            const numericPrice = parseFloat(p.price);
            const transformedProduct = { // converts seed data to conform to schema
                ...p,
                productId: productId,
                price: numericPrice
            };
            productsDataObject[productId] = transformedProduct;
            return transformedProduct;
        });
        productsData = productsData.concat(transformedProducts);
    }

    this.getProducts = () => {
        try {
            return productsData;
        } catch (err) {
            throw err;
        }
    }

    this.getProduct = (productId) => {
        try {
            const product = productsDataObject[productId];
            if (!productsDataObject) {
                throw new Error(errors.product_not_found);
            }
            return product;
        } catch (err) {
            throw err;
        }
    }

    this.addProductToCart = (productId) => {
        try {
            if (!productsDataObject[productId]) {
                throw new Error(errors.product_not_found);
            }

            shoppingCartData.push(productsDataObject[productId]);
        } catch (err) {
            throw err;
        }
    }

    this.getCart = () => {
        try {
            return shoppingCartData;
        } catch (err) {
            throw err;
        }
    }

    return this;
}

module.exports = repository;