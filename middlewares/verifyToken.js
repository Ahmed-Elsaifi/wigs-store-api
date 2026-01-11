const jwt = require('jsonwebtoken')
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')


const verifyToken = async(req,res,next)=>{

   const authHeader = req.headers['authorization'] || req.headers['Authorization']

  if(!authHeader){
      const error = appError.create('token is required',404,httpStatusText.FAIL)
         return next(error)
  }

   const token = authHeader.split(' ')[1]
   try {
   const currentUser=  await jwt.verify(token,process.env.SECERT_KEY)
   req.currentUser = currentUser
    next()
   }catch(err){
      const error = appError.create('invalid token',404,httpStatusText.FAIL)
         return next(error)

   }

}
module.exports = verifyToken