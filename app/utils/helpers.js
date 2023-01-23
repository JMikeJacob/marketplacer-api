const printProductList = function(title, list) {
    console.log(title);
    for (let i = 0; i < list.length; i++) {
      console.log(`${i + 1}. ${list[i].name} - ${list[i].price}`);
    }
};

exports.printProductList = printProductList;