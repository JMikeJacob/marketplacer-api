const initProducts = require('../data/products.json');
const repository = () => {
    let productsData = [];
    let productsDataObject = {};
    /*
        productsData schema
        [
            {
                uuid: string,
                name: string,
                price: number
            }
        ]
    */
    const shoppingCartData = {}; // allows multiple users to have different carts

    this.seedProducts = () => { // TO DO: move out initProducts to decouple repository from seed location
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

    /*

        Load a list of products from a file.
        List product details to the user.
        Add products to a Shopping Cart.
        Apply promotional discounts.
        Calculate and display the total cost.

    */

    this.getProducts = () => {
        try {
            return productsData;
        } catch (err) {
            throw new Error('Repository error');
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
            throw new Error('Repository error');
        }
    }

    this.addProductToCart = (userId, productId) => {
        try {
            if (!productsDataObject[productId]) {
                throw new Error('Product not found!');
            }
            if (!shoppingCartData[userId]) {
                shoppingCartData[userId] = [];
            }
            shoppingCartData[userId].push(productsDataObject[productId]);
        } catch (err) {
            throw err;
        }
    }

    this.getCart = (userId) => {
        try {
            return shoppingCartData[userId] || [];
        } catch (err) {
            throw err;
        }
    }

    return this;
}

module.exports = repository;