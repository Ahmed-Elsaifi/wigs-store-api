const asyncWrapper = require('../middlewares/asyncWrapper')
const Product = require('../models/products-model')
const User = require('../models/user-model')
const httpStatusText = require('../utils/httpStatusText')


const  getdashBoard = asyncWrapper(async(req,res,next)=>{

 // عدد المنتجات
  const totalProducts = await Product.countDocuments()

  // عدد المستخدمين
  const totalUsers = await User.countDocuments()

  // جلب كل المنتجات لحساب Avg Rating و Total Views
  const products = await Product.find()

  // حساب متوسط Rating
  const totalRating = products.reduce((acc, prod) => acc + prod.rating, 0)
  const productsWithRating = products.filter(prod => prod.numReviews > 0)
  const avgRating = productsWithRating.length > 0 
    ? parseFloat((totalRating / productsWithRating.length).toFixed(1)) 
    : 0

  // حساب مجموع Views
  const totalViews = products.reduce((acc, prod) => acc + prod.numReviews, 0)
    
  // رجع كل البيانات مرة واحدة
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: {
      totalProducts,
      totalUsers,
      avgRating,
      totalViews
    }
  })

})

module.exports = {
  getdashBoard
}