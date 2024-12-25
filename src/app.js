const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()
require('dotenv').config();

// init middlewares

// hiển thị log dễ đọc hơn cho dev
app.use(morgan('dev'))
// app.use(morgan('combine'))
// app.use(morgan('common'))
// app.use(morgan('short'))
// app.use(morgan('tiny'))

// chặn lộ thông tin các package đang sử dụng
app.use(helmet())

//compression giúp giảm size response tầm 100 lần 
app.use(compression())

app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))

// init db
require('./dbs/init.mongodb')
const { countConnect, checkOverLoad } = require('./helpers/check.connect')
countConnect()
checkOverLoad()

// init  router
app.use('/', require('./routers'))

// handling error


module.exports = app