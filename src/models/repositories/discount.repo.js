const { getSelectData, ungGetSelectData } = require("../../utils")
const { inventory } = require("../inventory.model")

const findAllDiscountCodeUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(ungGetSelectData(unSelect))
        .lean()

    return documents
}

const findAllDiscountCodeSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return documents
}

module.exports = {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
}