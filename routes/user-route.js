const express = require ('express')



const router = express.Router()

const userController= require('../controllers/user-controllers')
const verifyToken = require('../middlewares/verifyToken')


router.route('/')
            .get(verifyToken,userController.getUsers )

router.route('/register')
            .post(userController.register )

router.route('/login')
            .post(userController.login )
            



module.exports = router

