const mongoose = require('mongoose')
const validator = require('validator')
const userRoles=require('../utils/userRoles')



const userSchema = new mongoose.Schema({

  firstName:{
    type:String,
    requied: true,

  },
  lastName:{
    type:String,
    requied: true,

  },
  email:{
    type:String,
    requied: true,
    unique:true,
    validate:[validator.isEmail,'filed must be a valid email']
    

  },
  password:{
    type:String,
    requied: true,

  },
  token:{
    type:String
  },
  role:{
    type:String,
    enum:[userRoles.USER,userRoles.ADMIN,userRoles.MANAGER],
    default:userRoles.USER

  }
})

module.exports = mongoose.model("User",userSchema)