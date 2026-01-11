const {body}=require('express-validator')


const validationSchema = ()=>{

return  [
                        body('title')
                          .notEmpty()
                          .isLength({min:2})
                          .withMessage('at lest 2 digits'),
  
                        body('price')
                          .notEmpty()
  
  ]
}
module.exports = {
  validationSchema
}