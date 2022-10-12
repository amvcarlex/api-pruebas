const express = require('express')

const app = express()

//config - midelwers
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(require('./routers'))
module.exports = app