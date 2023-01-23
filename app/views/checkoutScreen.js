const readline = require('readline');
const { printProductList } = require('../utils/helpers');

const renderCheckoutDetails = (controller, userId) => {
    const checkoutDetails = controller.getCheckoutDetails(userId);
  
    const checkoutProducts = checkoutDetails.products;
    printProductList('Products in Shopping Cart:', checkoutProducts);
    if (checkoutDetails.isDiscounted) {
      console.log(`\nDiscount applied: ${checkoutDetails.discountValue * 100}% off on total greater than $${checkoutDetails.discountThreshold}`);
      console.log(`ORIGINAL TOTAL: $${checkoutDetails.originalTotalPrice.toFixed(2)}`);
      console.log(`AMOUNT DISCOUNT: $${checkoutDetails.discountAmount.toFixed(2)}`);
      console.log(`\nTOTAL: $${checkoutDetails.discountedTotalPrice.toFixed(2)}`);
    } else {
      console.log('\nNo Discount Applied');
      console.log(`TOTAL: $${checkoutDetails.originalTotalPrice.toFixed(2)}`);
    }
};
  
const renderCheckoutScreen = async (cache, controller, userId) => {
    return new Promise((resolve, reject) => {
      try {
        console.log('Checkout');
        const rl = readline.createInterface(process.stdin, process.stdout);
        rl.setPrompt('Do you want to check out? (Y/N): ');
    
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