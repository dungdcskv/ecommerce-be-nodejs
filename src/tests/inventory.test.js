const redisPubSubService = require("../services/redisPubSub.service")


class InventoryServiceTest {

    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ${productId} yyyyyyyyyyyyyy ${quantity}`);

    }
}

module.exports = new InventoryServiceTest()