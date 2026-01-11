 const jwt = require('jsonwebtoken')
 
 
 module.exports = (paylod)=>{

  const token = jwt.sign(paylod,process.env.SECERT_KEY)

  return token

}