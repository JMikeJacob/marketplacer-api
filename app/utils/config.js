module.exports = function() {
    return {
        app: {
            discounts: process.env.DISCOUNTS ? JSON.parse(process.env.DISCOUNTS) : [{
                threshold: 100,
                discount: 0.2
            }, {
                threshold: 50,
                discount: 0.15
            }, {
                threshold: 20,
                discount: 0.1
            }]
        }
    };
}