const config = require('../../../app/utils/config')();
global.config = config;
const controllerCRUD = require('../../../app/controller/main.controller');
const errors = require('../../../app/utils/errors');

const mockConstants = {
    products: [{ 
        productId: 'mockProduct1',
        name: 'Product 1',
        price: 10.00
    }, { 
        productId: 'mockProduct2',
        name: 'Product 2',
        price: 25.25
     }],
    cart: [{ 
        productId: 'mockProductCart1',
        name: 'In Cart 1',
        price: 15.00
    }, { 
        productId: 'mockProductCart2',
        name: 'In Cart 2',
        price: 25.25
    }]
}

describe('main.controller.js', () => {
    let mockRepository;
    beforeEach(() => {
        mockRepository = jasmine.createSpyObj('mockRepository', ['seedProducts', 'getProducts', 'getProduct', 'addProductToCart', 'getCart']);
        mockRepository.getProducts.and.returnValue(mockConstants.products);
        mockRepository.getCart.and.returnValue(mockConstants.cart);
    });

    it('should seed products', () => {
        const controller = controllerCRUD(mockRepository);
        controller.seedProducts();
        expect(mockRepository.seedProducts).toHaveBeenCalled();
    });

    it('should add product to cart', () => {
        const mockProductId = 'product-id';
        const controller = controllerCRUD(mockRepository);
        controller.addProductToCart(mockProductId);
        expect(mockRepository.addProductToCart).toHaveBeenCalledWith(mockProductId);
    });

    it('should get list of products', () => {
        const controller = controllerCRUD(mockRepository);
        expect(controller.getProducts()).toEqual(mockConstants.products);
    });

    it('should get cart with current products', () => {
        const controller = controllerCRUD(mockRepository);
        expect(controller.getCart()).toEqual(mockConstants.cart);
    });

    it('should show error if cart is undefined', () => {
        mockRepository.getCart.and.returnValue(undefined);
        const controller = controllerCRUD(mockRepository);
        expect(function() { controller.getCart() }).toThrowError(errors.cart_not_found);
    });

    describe('should get correct checkout details', () => {
        it('if total price does not have a discount', () => {
            const mockCart = [{ 
                productId: 'mockProductCart1',
                name: 'In Cart 1',
                price: 1.00
            }, { 
                productId: 'mockProductCart2',
                name: 'In Cart 2',
                price: 3.00
            }, { 
                productId: 'mockProductCart3',
                name: 'In Cart 3',
                price: 5.00
            }];
            const expectedOriginalTotal = 9.00;
            mockRepository.getCart.and.returnValue(mockCart);
    
            const controller = controllerCRUD(mockRepository);
            const checkoutDetails = controller.getCheckoutDetails();
            expect(checkoutDetails.originalTotalPrice).toEqual(expectedOriginalTotal);
            expect(checkoutDetails.products).toEqual(mockCart);
            expect(checkoutDetails.isDiscounted).toBeFalse();
        });

        it('if total price falls into discount promo', () => {
            const mockCart = [{ 
                productId: 'mockProductCart1',
                name: 'In Cart 1',
                price: 10.00
            }, { 
                productId: 'mockProductCart2',
                name: 'In Cart 2',
                price: 20.00
            }, { 
                productId: 'mockProductCart3',
                name: 'In Cart 3',
                price: 30.00
            }];
            const expectedOriginalTotal = 60.00;
            const expectedDiscountThreshold = 50;
            const expectedDiscountValue = 0.15;
            const expectedDiscountAmount = 9.00;
            const expectedDiscountedTotal = 51.00;
            mockRepository.getCart.and.returnValue(mockCart);
    
            const controller = controllerCRUD(mockRepository);
            const checkoutDetails = controller.getCheckoutDetails();
            expect(checkoutDetails.originalTotalPrice).toEqual(expectedOriginalTotal);
            expect(checkoutDetails.products).toEqual(mockCart);
            expect(checkoutDetails.isDiscounted).toBeTrue();
            expect(checkoutDetails.discountedTotalPrice).toEqual(expectedDiscountedTotal);
            expect(checkoutDetails.discountThreshold).toEqual(expectedDiscountThreshold);
            expect(checkoutDetails.discountValue).toEqual(expectedDiscountValue);
            expect(checkoutDetails.discountAmount).toEqual(expectedDiscountAmount);
        });
    });
});