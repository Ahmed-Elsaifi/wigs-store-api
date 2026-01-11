const express =require('express')
const verifyToken = require('../middlewares/verifyToken')
const dashController = require('../controllers/dashBoard-controllers')



const router =express.Router()



router.route('/')
            .get(verifyToken,dashController.getdashBoard)


            


module.exports =router
