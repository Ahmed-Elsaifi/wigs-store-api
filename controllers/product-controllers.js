

const {validationResult}=require('express-validator')
const Product = require ('../models/products-model')
const httpStatusText = require('../utils/httpStatusText')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')


const getProducts = asyncWrapper(async (req, res) => {
  const query =req.query
  
  const limit = query.limit || 12
  const page = query.page || 1
  const skip = (page - 1) * limit
  
const products =  await Product.find({},{"__v":false}).limit(limit).skip(skip)
const totalProducts = await Product.countDocuments();


  res.json({status:httpStatusText.SUCCESS,totalProducts,data:{products}})
})
const getSpesificProduct =asyncWrapper(async (req,res,next)=>{

   const product = await Product.findById(req.params.productId)

     
  if(!product){

  const error=  AppError.create('product not found',404,httpStatusText.FAIL)
 return next(error)

  // return res.status(400).json({status:httpStatusText.FAIL,message:{mes:'not found '}})
 }
 res.json({status:httpStatusText.SUCCESS,data:{product}});
  
// try{
 

// }catch(error){
//   return res.status(404).json({status:httpStatusText.ERRORR,message:{mes:'invalid object id '}})

// }
    
})

const addProduct = asyncWrapper(async(req,res ,next)=>{
  
  const errors =validationResult(req)
  if (!errors.isEmpty()) {

    const error = AppError.create(errors,400,httpStatusText.FAIL)
    return next(error)
    
  }
  const newProduct =   new Product(req.body)

      await newProduct.save()
  res.json({status:httpStatusText.SUCCESS,data:{newProduct}})

}
)
const editProduct =asyncWrapper(async (req,res,next)=>{
  
  const errors =validationResult(req)

  if (!errors.isEmpty()){
    const error = AppError.create(errors,400,httpStatusText.FAIL)
    return next(error)

  }
  const productId = req.params.productId

const editProduct=await  Product.updateOne({_id:productId},{$set:{...req.body}})

  
  if (!editProduct ){
    const error = AppError.create('can not find object id  ',404,httpStatusText.FAIL)
    return next(error)
    // return res.status(404).json({status:httpStatusText.FAIL,message:{mes:'can not find object id  '}})
  }

  
  res.json({status:httpStatusText.SUCCESS,data:{editProduct}})

})
const deleteProduct = asyncWrapper(async (req,res)=>{


  const productId = req.params.productId

  
    const deleteProduct= await Product.deleteOne({_id:productId})

  if (!deleteProduct ){

    const error =AppError.create('deleted product not foun',400,httpStatusText.FAIL)

    return next(error)
    // return res.status(400).json({status:httpStatusText.FAIL,message:{mes:'not found '}})
  }

  res.json({status:httpStatusText.SUCCESS,data:{message:true}})

  }
  

)

module.exports ={
  getProducts,
  getSpesificProduct,
  addProduct,
  editProduct,
  deleteProduct

}