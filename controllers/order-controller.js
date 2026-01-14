// controllers/order-controller.js
const Order = require('../models/order-model');
const Cart = require('../models/cart-model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const { initializePayment } = require('../utils/payStack');

// const createOrder = asyncWrapper(async (req, res, next) => {
//     const userId = req.currentUser.id;
//     const { shippingAddress } = req.body;

//     // 1. نجيب سلة المستخدم
//     const cart = await Cart.findOne({ userId });
//     if (!cart || cart.items.length === 0) {
//         return next(appError.create('Your cart is empty', 400, httpStatusText.FAIL));
//     }

//     // 2. إنشاء الطلب من بيانات السلة
//     const newOrder = new Order({
//         userId,
//         items: cart.items,
//         totalPrice: cart.totalPrice,
//         shippingAddress
//     });

//     await newOrder.save();

//     // 3. مسح السلة بعد تحويلها لطلب (اختياري: ممكن تمسحها بعد التأكد من الدفع)
//     await Cart.findOneAndDelete({ userId });

//     res.status(201).json({
//         status: httpStatusText.SUCCESS,
//         data: { order: newOrder }
//     });
// });

// في ملف controllers/order-controller.js


const createOrder = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id;
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
        return next(appError.create('Cart is empty', 400, httpStatusText.FAIL));
    }

    // 1. إنشاء الطلب في قاعدة البيانات كـ Pending
    const newOrder = new Order({
        userId,
        items: cart.items,
        totalPrice: cart.totalPrice,
        shippingAddress
    });

    // 2. طلب رابط الدفع من Paystack
    const paymentData = await initializePayment(req.currentUser.email, cart.totalPrice);

    // ربط الـ reference بالطلب لمتابعته لاحقاً
    newOrder.paymentReference = paymentData.data.reference;
    await newOrder.save();

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { 
            order: newOrder, 
            paymentUrl: paymentData.data.authorization_url // العميل هيفتح الرابط ده عشان يدفع
        }
    });
});

const getMyOrders = asyncWrapper(async (req, res) => {
    const orders = await Order.find({ userId: req.currentUser.id }).sort({ createdAt: -1 });
    res.json({ status: httpStatusText.SUCCESS, data: { orders } });
});

module.exports = { createOrder, getMyOrders };