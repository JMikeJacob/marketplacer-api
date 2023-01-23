const readline = require('readline');
const factory = require('./utils/factory')();

const repository = require('./repository/main.repository')();
const controller = require('./controller/main.controller')(repository);

factory.setRepository(repository);
factory.setController(controller);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const mainMenu = () => {
  return new Promise((resolve, reject) => {
    const products = controller.getProducts();
    const cart = controller.getCart();
    const productsListMessage = 'List of Products:\n';
    const cartMessage = 'Products in Cart:\n';
    for (let i = 0; i < products.length; i++) {
      productsListMessage += `${i + 1}. ${products.name} - ${products.price}`;
    }

    rl.question(`Press button to add item to your cart`)
  });
}