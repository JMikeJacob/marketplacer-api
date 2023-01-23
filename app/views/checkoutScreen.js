const readline = require('readline');
const { printProductList } = require('../utils/helpers');

const renderCheckoutDetails = (controller, userId) => {
    const checkoutDetails = controller.getCheckoutDetails(userId);
  
    const checkoutProducts = checkoutDetails.products;
    printProductList('Products in Shopping Cart:', checkoutProducts);
    console.log('');
    if (checkoutDetails.isDiscounted) {
      console.log(`Discount applied: ${checkoutDetails.discountAmount * 100}% off on total greater than $${checkoutDetails.discountThreshold}`);
      console.log(`TOTAL: $${checkoutDetails.discountedTotalPrice.toFixed(2)}`);
    } else {
      console.log(`TOTAL: $${checkoutDetails.originalTotalPrice.toFixed(2)}`);
    }
};
  
const renderCheckoutScreen = async (cache, controller, userId) => {
    return new Promise((resolve, reject) => {
      try {
        const rl = readline.createInterface(process.stdin, process.stdout);
        rl.setPrompt('Do you want to check out? ');
    
        renderCheckoutDetails(controller, userId);
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
            resolve(answer);
        });
      } catch(err) {
        reject(err);
      }
    });
};

module.exports = renderCheckoutScreen;