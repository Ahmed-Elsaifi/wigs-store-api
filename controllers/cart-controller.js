// controllers/cart-controller.js
const Cart = require('../models/cart-model');
const Product = require('../models/products-model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const addToCart = asyncWrapper(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.currentUser.id; // المفروض تكون جايبها من الـ Auth middleware

    // 1. التأكد إن المنتج موجود
    const product = await Product.findById(productId);
    if (!product) {
        return next(appError.create('Product not found', 404, httpStatusText.FAIL));
    }

    // 2. البحث عن سلة المستخدم
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        // لو مفيش سلة، ننشئ واحدة جديدة
        cart = new Cart({
            userId,
            items: [{ productId, quantity, price: product.price }],
            totalPrice: product.price * quantity
        });
    } else {
        // لو السلة موجودة، نشوف المنتج موجود فيها ولا لأ
        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            // المنتج موجود، نزود الكمية
            cart.items[itemIndex].quantity += quantity;
        } else {
            // منتج جديد، نضيفه للسلة
            cart.items.push({ productId, quantity, price: product.price });
        }
        
        // إعادة حساب السعر الإجمالي
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    }

    await cart.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { cart } });
});

// وظيفة عرض السلة
const getCart = asyncWrapper(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.currentUser.id }).populate('items.productId');
    res.json({ status: httpStatusText.SUCCESS, data: { cart } });
});

// إضافة هذه الوظائف في ملف controllers/cart-controller.js

// 1. حذف منتج معين من السلة
const removeFromCart = asyncWrapper(async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.currentUser.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        return next(appError.create('Cart not found', 404, httpStatusText.FAIL));
    }

    // فلترة المنتجات لاستبعاد المنتج المراد حذفه
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // إعادة حساب السعر الإجمالي
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    await cart.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { cart } });
});

// 2. مسح السلة بالكامل (مثلاً بعد إتمام عملية الشراء)
const clearCart = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id;

    const cart = await Cart.findOneAndDelete({ userId });

    if (!cart) {
        return next(appError.create('Cart already empty', 404, httpStatusText.FAIL));
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: null, message: "Cart cleared successfully" });
});

// تأكد من إضافة الـ Functions دي في الـ module.exports
module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
};

