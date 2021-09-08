const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('./data'))
app.use('/',require('./index'))
app.listen(3010)
