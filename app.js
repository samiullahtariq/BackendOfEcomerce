const express = require('express')
// dotenv library
const dotenv = require("dotenv")
//connection routes 
const Conn = require('./connection/db')
//importing auth routes (login , register)
const registerRoute = require("./routes/auth")
const loginRoute = require("./routes/auth")
// importing the cart route
const cartRoute = require("./routes/cart")
//importing the product route
const products = require("./routes/product")
//importing the order route
const orderRoute = require("./routes/order")
///importing stripe router payment method
const stripeRoute = require("./routes/stripe")
//importing userRoute
const userRoute = require("./routes/user")


dotenv.config()

//making connection of mongodb by calling it in app file
Conn()

const app = express()
//express middleware
app.use(express.json())



//userRoute
app.use("/api/users" , userRoute)
//auth routes
app.use("/api/auth" , registerRoute)

app.use("/api/auth" , loginRoute)
//product routes
app.use("/api/products" , products)
//cart routes
app.use("/api/carts" , cartRoute)
//order routes
app.use("/api/orders" , orderRoute)
///stripe payment method
app.use("/api/checkout", stripeRoute);




const port = process.env.PORT || 8000

app.listen(port , ()=>{
    console.log(`App is running on port ${port}`)
})