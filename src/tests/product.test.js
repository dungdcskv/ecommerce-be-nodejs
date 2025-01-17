const redisPubSubService = require("../services/redisPubSub.service")


class ProductsServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId, quantity
        }

        redisPubSubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductsServiceTest()