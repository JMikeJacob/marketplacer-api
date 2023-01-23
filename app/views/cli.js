const renderProductsScreen = require('../views/productsScreen');
const renderCheckoutScreen = require('../views/checkoutScreen');

const cache = {
    products: null,
    cart: null
};

const cli = async function(controller) {
    try {        
        let isInProductsScreen = true;

        while (true) { // keeps CLI alive until user exits
            console.clear();
            if (isInProductsScreen) {
                const productAnswer = await renderProductsScreen(cache, controller);
                if (productAnswer == 2) {
                    console.log('\nThank you for visiting!');
                    process.exit(0);
                } else if (productAnswer == 1) { // go to checkout screen
                    isInProductsScreen = false;
                }
            } else {
                const checkoutAnswer = await renderCheckoutScreen(cache, controller);
                if (checkoutAnswer === 'Y') {
                    console.log('\nThank you for your purchase!');
                    process.exit();
                } else { // return to products screen
                    isInProductsScreen = true;
                }
            }
        }
    } catch(err) {
        console.error(err);
        process.exit(0);
    }
};

module.exports = cli;