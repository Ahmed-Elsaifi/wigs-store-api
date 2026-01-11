
const mongoose =require('mongoose')

const productSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true,
    tirm:true
  },
  price:{
    type:Number,
    required:true
  },
  images:[
    {
      type:String,
      required:true,
    }
  ],
  categories:[
    {
      type:String,
      required:true,
    }
  ],
  length:{
    type:String,
  },
  color:{
    type:String,
  },
  material:{
    type:String,
  },
  stock:{
    type:Number,
  },
  rating:{
    type:Number,
  },
  numReviews:{
    type:Number,
  },
  imgCover:{
    type:String,
    default:'uploads/download.png'
  }
  
})

module.exports =mongoose.model('Product',productSchema)