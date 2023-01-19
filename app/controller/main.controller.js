const controller = (repository) => {
    return {
        seedProducts: () => {
            repository.seedProducts();
        },
        addProductToCart: (userId, product) => {
            repository.addProductToCart(userId, product);
        },
        getCart: (userId) => {
            try {
                const cart = repository.getCart(userId);

                if (!cart) {
                    throw new Error('cart not found');
                }

                return cart;
            } catch (err) {
                throw err;
            }
        },
        getCheckoutDetails: (userId) => {
            try {
                const cart = repository.getCart(userId);

                if (!cart) {
                    throw new Error('cart not found');
                }
                
                const originalTotalPrice = cart.reduce((accumulator, product) => accumulator + product.price);
                const checkoutDetails = {
                    products: cart,
                    originalTotalPrice: originalTotalPrice
                };

                let discountedTotalPrice = originalTotalPrice;
                // check for discounts
                const discounts = global.config.discounts;
                for (let i = 0; i < discounts.length; i++) {
                    if (originalTotalPrice > discounts[i].threshold) {
                        discountedTotalPrice = originalTotalPrice * discounts[i].discount;
                        checkoutDetails.isDiscounted = true;
                        checkoutDetails.discountedTotalPrice = discountedTotalPrice;
                        checkoutDetails.discountThreshold = discounts[i].threshold;
                        checkoutDetails.discountAmount = discounts[i].discount;
                        break;
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