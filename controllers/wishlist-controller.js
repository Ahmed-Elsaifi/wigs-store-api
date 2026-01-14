// controllers/wishlist-controller.js
const Wishlist = require('../models/wishlist-model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');

const toggleWishlist = asyncWrapper(async (req, res) => {
    const { productId } = req.body;
    const userId = req.currentUser.id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
        // لو مفيش قائمة، ننشئ واحدة جديدة ونضيف المنتج
        wishlist = new Wishlist({ userId, products: [productId] });
    } else {
        const isExist = wishlist.products.includes(productId);

        if (isExist) {
            // لو موجود، نشيله (Remove)
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        } else {
            // لو مش موجود، نضيفه (Add)
            wishlist.products.push(productId);
        }
    }

    await wishlist.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { wishlist } });
});

const getMyWishlist = asyncWrapper(async (req, res) => {
    const wishlist = await Wishlist.findOne({ userId: req.currentUser.id }).populate('products');
    res.json({ status: httpStatusText.SUCCESS, data: { wishlist } });
});

module.exports = { toggleWishlist, getMyWishlist };