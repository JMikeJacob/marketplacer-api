const readline = require('readline');
const { printProductList } = require('../utils/helpers');

const renderProducts = (cache, controller) => {
    let products;
    if (!cache.products) {
      products = controller.getProducts();
      cache.products = products;
    } else {
      products = cache.products;
    }
  
    printProductList('List of Products:', products);
  };
  
  const renderCart = (cache, controller, shouldUpdateCart = true, showTotal = true) => {
    let cart;
    if (!cache.cart || shouldUpdateCart) {
      cart = controller.getCart();
      cache.cart = cart;
    } else {
      cart = cache.cart;
    }
  
    if (cart.length > 0) {
      printProductList('Products in Cart:', cart)
      
      if (showTotal) {
        const total = cart.reduce((accumulator, product) => accumulator + product.price, 0);
        console.log(`\nTotal Price: $${total.toFixed(2)}\n`);
      }
    } else {
      console.log('No Products in Cart\n');
    }
  
  };
  
const renderProductsScreen = async (cache, controller) => {
    return new Promise((resolve, reject) => {
        try {
        const rl = readline.createInterface(process.stdin, process.stdout);
        let answer;

        renderProducts(cache, controller);
        console.log('');
        renderCart(cache, controller);

        rl.setPrompt(`Products Menu\n1 to ${cache.products.length}: Add product with this number to cart\n0: Proceed to Checkout\nq: Exit application\n\nYour Input: `);
        rl.prompt();

        rl.on('line', (line) => {
            if (line === 'q' || line === '0') {
                answer = line;
                rl.close();
                return;
            }

            const answerInt = parseInt(line);
            if (!isNaN(answerInt)) {
                if (answerInt < 0 || answerInt > cache.products.length) {
                    console.error('Invalid input! Please try again.');
                    rl.prompt();
                } else {
                    controller.addProductToCart(cache.products[answerInt - 1].productId);
                    console.clear();
                    renderProducts(cache, controller);
                    console.log('');
                    renderCart(cache, controller);
                    rl.prompt();
                }
            } else {
                console.error('Invalid input! Please try again.');
                rl.prompt();
            }
        }).on('close',function(){
            resolve(answer);// this is the final result of the function
        });
        
        } catch (err) {
        reject(err);
        }
    });
}

module.exports = renderProductsScreen;