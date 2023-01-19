const initProducts = require('../data/products.json');
const repository = (dataStore) => {
    const productsData = [];
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
    const __self = this;

    this.seedProducts = () => { // TO DO: move out initProducts to decouple repository from seed location
        const transformedProducts = initProducts.map((p) => {
            return {
                ...p,
                uuid: p.uuid.toString(),
                price: parseFloat(p.price)
            };
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
            const product = productsData.find((p) => productId === p.id);
            return product;
        } catch (err) {
            throw new Error('Repository error');
        }
    }

    this.addProductToCart = (userId, product) => {
        try {
            if (!shoppingCartData[userId]) {
                shoppingCartData[userId] = [];
            }
            shoppingCartData[userId].push(product);
        } catch (err) {
            throw new Error('Repository error adding product to cart');
        }
    }

    this.getCart = (userId) => {
        try {
            return shoppingCartData[userId] || [];
        } catch (err) {
            throw new Error('Repository error getting cart');
        }
    }

    return this;
}

module.exports = repository;