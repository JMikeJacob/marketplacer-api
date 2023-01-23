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

const setPrompt = function(reader, mode) {
  switch (mode) {
    case 'main': {
      reader.setPrompt(`Products Menu\n0: Add to Cart\n1: Checkout\n2: Exit\n\nYour Input: `);
      reader.prompt();
      break;
    }
    case 'add': {
      reader.setPrompt(`Input number to add corresponding item to cart, input 0 to cancel: `);
      reader.prompt();
      break;
    }
  }
}

const renderProductsScreen = async (cache, controller) => {
    return new Promise((resolve, reject) => {
        try {
        const rl = readline.createInterface(process.stdin, process.stdout);
        let answer;
        renderProducts(cache, controller);
        console.log('');
        renderCart(cache, controller);

        let mode = 'main';
        setPrompt(rl, mode);

        rl.on('line', (line) => {
          switch(mode) {
            case 'main': {
              if (line == 1 || line == 2) {
                answer = line;
                rl.close();
                return;
              } else if (line == 0) {
                mode = 'add';
                setPrompt(rl, mode);
              } else {
                console.error('Invalid input! Please try again.');
                rl.prompt();
              }
              break;
            }
            case 'add': {          
              const answerInt = parseInt(line);
              if (answerInt === 0) {
                mode = 'main';
                setPrompt(rl, mode);
              } else if (!isNaN(answerInt) && answerInt > 0 && answerInt <= cache.products.length) {
                controller.addProductToCart(cache.products[answerInt - 1].productId);
                console.clear();
                renderProducts(cache, controller);
                console.log('');
                renderCart(cache, controller);
                mode = 'main'
                setPrompt(rl, mode);
              } else {
                  console.error('Invalid input! Please try again.');
                  rl.prompt();
              }

              break;
            }
          }
        }).on('close',function(){
            resolve(answer); // final input
        });

        } catch (err) {
          reject(err);
        }
    });
}

module.exports = renderProductsScreen;