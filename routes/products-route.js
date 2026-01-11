const express = require ('express')

const {validationSchema} = require ('../middlewares/validationSchema')

const router = express.Router()


const productsController = require('../controllers/product-controllers')
const verifyToken = require('../middlewares/verifyToken')
const allowedTo = require('../middlewares/allowedTo')
const userRoles = require('../utils/userRoles')

router.route('/')
            .get(productsController.getProducts )
            .post(verifyToken,validationSchema(), productsController.addProduct   )


router.route('/:productId')
              .get(productsController.getSpesificProduct)
              .patch(verifyToken,validationSchema(),productsController.editProduct)
              .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),productsController.deleteProduct)




module.exports = router

