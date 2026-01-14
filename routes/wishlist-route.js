// routes/wishlist-route.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist-controller');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken);

router.route('/')
    .get(wishlistController.getMyWishlist)
    .post(wishlistController.toggleWishlist);

module.exports = router;