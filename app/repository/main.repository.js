const initProducts = require('../data/products.json');
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
    let productsDataObject = {};
    const shoppingCartData = [];

    this.seedProducts = () => {
        const transformedProducts = initProducts.map((p) => {
            const productId = p.uuid.toString();
            const numericPrice = parseFloat(p.price);
            const transformedProduct = {
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
                throw new Error('Product not found!');
            }
            return product;
        } catch (err) {
            throw err;
        }
    }

    this.addProductToCart = (productId) => {
        try {
            if (!productsDataObject[productId]) {
                throw new Error('Product not found!');
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