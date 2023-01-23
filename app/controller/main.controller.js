const errors = require("../utils/errors");

const controller = (repository) => {
    return {
        seedProducts: () => {
            try {
                repository.seedProducts();
            } catch (err) {
                throw err;
            }
        },
        addProductToCart: (productId) => {
            try {
                repository.addProductToCart(productId);
            } catch (err) {
                throw err;
            }
        },
        getProducts: () => {
            return repository.getProducts();
        },
        getCart: () => {
            try {
                const cart = repository.getCart();

                if (!cart) {
                    throw new Error(errors.cart_not_found);
                }

                return cart;
            } catch (err) {
                throw err;
            }
        },
        getCheckoutDetails: () => {
            try {
                const cart = repository.getCart();

                if (!cart) {
                    throw new Error(errors.cart_not_found);
                }
                
                const originalTotalPrice = cart.reduce((accumulator, product) => accumulator + product.price, 0);
                const checkoutDetails = {
                    products: cart,
                    originalTotalPrice: originalTotalPrice
                };

                const discounts = global.config.discounts;
                if (discounts && discounts.length > 0) {
                    let discountedTotalPrice = originalTotalPrice;
                    // check for discounts
                    for (let i = 0; i < discounts.length; i++) {
                        if (originalTotalPrice > discounts[i].threshold) {
                            discountedTotalPrice =  originalTotalPrice * (1 - discounts[i].discount);
                            checkoutDetails.isDiscounted = true;
                            checkoutDetails.discountedTotalPrice = discountedTotalPrice;
                            checkoutDetails.discountThreshold = discounts[i].threshold;
                            checkoutDetails.discountAmount = discounts[i].discount;
                            break;
                        }
                    }
                }

                return checkoutDetails;
            } catch (err) {
                throw err;
            }
        }
    }
};

module.exports = controller;