'use strict'

const _ = require('lodash')

const getIntoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

// ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

// ['a', 'b'] => {a: 0, b: 0}
const ungGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}


const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })
    return obj
}

/**
    a: {
        b: 1,
        c: 2,
    }
        =>  a.b = 1,
            a.c = 2
 */
const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj || {}).forEach(k => {
        // if obj[k] = null it will pass to 2 above condition
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response || {}).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        } else {
            final[k] = obj[k]
        }
    })

    return final
}

module.exports = {
    getIntoData,
    getSelectData,
    ungGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
}