const readline = require('readline');

require('./utils/config');

const factory = require('./utils/factory')();

const repository = require('./repository/main.repository')();
const controller = require('./controller/main.controller')(repository);

factory.setRepository(repository);
factory.setController(controller);

const cache = {
  products: null,
  cart: null
};

const renderProducts = () => {
  let products;
  if (!cache.products) {
    products = controller.getProducts();
    cache.products = products;
  } else {
    products = cache.products;
  }

  let productsListMessage = 'List of Products:\n';
  for (let i = 0; i < products.length; i++) {
    productsListMessage += `${i + 1}. ${products[i].name} - ${products[i].price}\n`;
  }
  console.log(productsListMessage);
};

const renderCart = (userId, shouldUpdateCart = true, showTotal = true) => {
  let cart;
  if (!cache.cart || shouldUpdateCart) {
    cart = controller.getCart(userId);
    cache.cart = cart;
  } else {
    cart = cache.cart;
  }

  if (cart.length > 0) {
    let cartMessage = 'Products in Cart:\n';
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      cartMessage += `${i + 1}. ${cart[i].name} - ${cart[i].price}\n`;
      total += cart[i].price;
    }
    console.log(cartMessage);
    
    if (showTotal) {
      console.log(`Total Price: ${total}`);
    }
  } else {
    console.log('No Products in Cart');
  }

};

const renderProductsScreen = async (userId) => {
  return new Promise((resolve, reject) => {
    try {
      const rl = readline.createInterface(process.stdin, process.stdout);
      let answer;

      renderProducts();
      renderCart(userId);

      rl.setPrompt(`Input number to add item to your cart, input 0 to checkout, input q to exit: `);
      rl.prompt();
  
      rl.on('line', (line) => {
        if (line === 'q' || line === '0') {
          answer = line;
          rl.close();
          return;
        }

        const answerInt = parseInt(line);
        if (!isNaN(answerInt)) {
          if (answerInt < 0 || answerInt >= cache.products.length) {
            console.error('Invalid input! Please try again.');
            rl.prompt();
          }
          controller.addProductToCart(userId, cache.products[answerInt - 1].productId);
          renderCart(userId);
          rl.prompt();
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

const renderCheckoutDetails = (userId) => {
  const checkoutDetails = controller.getCheckoutDetails(userId);
  console.log(checkoutDetails);

  const checkoutProducts = checkoutDetails.products;
  console.log('Products in Shopping Cart:');
  for (let i = 0; i < checkoutProducts.length; i++) {
    console.log(`${i + 1}. ${checkoutProducts[i].name} - ${checkoutProducts[i].price}`);
  }
  console.log('\n');
  if (checkoutDetails.isDiscounted) {
    console.log(`Discount applied: ${checkoutDetails.discountAmount * 100}% off on total greater than $${checkoutDetails.discountThreshold}`);
    console.log(`TOTAL: $${checkoutDetails.discountedTotalPrice.toFixed(2)}`);
  } else {
    console.log(`TOTAL: $${checkoutDetails.originalTotalPrice.toFixed(2)}`);
  }
}

const renderCheckoutScreen = async (userId) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt('Do you want to check out? ');

    renderCheckoutDetails(userId);
    rl.prompt();
    rl.on('line', (line) => {
      if (line === 'Y' || line === 'N') {
        answer = line;
        rl.close();
        return;
      } else {
        console.error('Invalid input! Please try again.');
        rl.prompt();
      }
    }).on('close',function(){
      resolve(answer);// this is the final result of the function
    });
  });
};

const main = async () => {
  const userId = 'guest';
  controller.seedProducts();
  
  try {
    const productAnswer = await renderProductsScreen(userId);
    console.log(`productAnswer: ${productAnswer}`)
    if (productAnswer === 'q') {
      console.log('exiting');
      process.exit(0);
    } else if (productAnswer == 0) {
      const checkoutAnswer = await renderCheckoutScreen(userId);
      if (checkoutAnswer === 'Y') {
        console.log('Thank you for your purchase!');
        process.exit();
      } 
    }
  } catch (err) {
    console.error(err);
    main();
  }
}

main();