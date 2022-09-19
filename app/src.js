require('dotenv').config()
require('./database/connection')

const express = require('express')
const path = require('path')
const userRoutes = require('../routes/users.api')
const postRoutes = require('../routes/posts.api')

const app = express()

const staticDir = path.join(__dirname, '../public')
app.use(express.static(staticDir))

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use("/user",userRoutes)
app.use("/post",postRoutes)

module.exports = app 