
const asyncWrapper = require('../middlewares/asyncWrapper')
const User =require('../models/user-model')
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken');
const generatejwt = require('../utils/generatejwt')


const getUsers = asyncWrapper(async (req, res) => {
  const query =req.query
 
  
  const limit = query.limit || 12
  const page = query.page || 1
  const skip = (page - 1) * limit
const users =  await User.find({},{"__v":false,'password':false}).limit(limit).skip(skip)

const totalUsers = await User.countDocuments()


  res.json({status:httpStatusText.SUCCESS,totalUsers,data:{users}})
})


const register = asyncWrapper (async (req,res,next)=>{
  console.log(req.body);

  const {firstName,lastName,email,password,role} = req.body
  const olduser =  await User.findOne({email:email})
  if(olduser){
      const error = appError.create('email already exsit',404,httpStatusText.FAIL)
        return next(error)
  }
    const hashPassword = await bcrypt.hash(password,10)
  const newUser = new User({
    firstName,
    lastName,
    email,
    password:hashPassword,
    role
  })
    const token = generatejwt({email:newUser.email,id:newUser._id,role:newUser.role})

  newUser.token = token

  await newUser.save()

  res.status(201).json({status:httpStatusText.SUCCESS,data:{newUser}})
  
})
const login = asyncWrapper (async (req,res,next)=>{
  

  const {email,password,role} = req.body

  if(!email && !password){
    
    const error = appError.create('email and password required',400,httpStatusText.FAIL)
      return next(error)

  }

  const loginUser =  await User.findOne({email:email})

  if(!loginUser){

      const error = appError.create('invalid email',404,httpStatusText.FAIL)
        return next(error)
  }

  const matchedPassword = await bcrypt.compare(password,loginUser.password)

  if(loginUser && matchedPassword){ 

    const token = generatejwt({email:loginUser.email,id:loginUser._id,role:loginUser.role})
     
  res.json({status:httpStatusText.SUCCESS,data:{token}})

  }else {
    const error = appError.create('somthing wrong',500,httpStatusText.FAIL)
     return next(error)

  }

})


module.exports = {
  getUsers,
  register,
  login
}