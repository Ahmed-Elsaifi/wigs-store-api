require('dotenv').config()

const express = require('express')
const httpStatusText =require('./utils/httpStatusText')

const cors = require('cors')

const app = express()
const path =require('path')

app.use('/uploads',express.static(path.join(__dirname,'uploads')))


const mongoose = require('mongoose');
const port =process.env.PORT


const url = process.env.HTTP_URL



mongoose.connect(url).then( ()=>{
  console.log('connect started');
  
})
app.use(cors())

app.use(express.json())


const productRouter =require('./routes/products-route')
const userRouter = require('./routes/user-route')
const dashRouter = require('./routes/dash-route')
const aiRouter = require('./routes/ai-route')
const cartRouter = require('./routes/cart-route')
const orderRouter = require('./routes/order-route')
const wishlistRouter = require('./routes/wishlist-route')


app.use('/api/products',productRouter)
app.use('/api/user',userRouter)
app.use('/api/dashboard',dashRouter)
app.use('/api/ai',aiRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/wishlist',wishlistRouter)


app.use((error,req,res,next)=>{
  res.status(error.statusCode || 500).json({status:error.statusText || httpStatusText.ERRORR,message:error.message})
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
