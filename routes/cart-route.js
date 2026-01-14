const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart-controller');
const verifyToken = require('../middlewares/verifyToken');

// كل الـ Routes هنا محتاجة verifyToken لأن السلة خاصة بكل مستخدم
router.use(verifyToken);

router.route('/')
    .get(cartController.getCart)      // جلب محتويات السلة
    .post(cartController.addToCart);  // إضافة منتج جديد أو تحديث كمية

router.route('/:productId')
    .delete(cartController.removeFromCart); // حذف منتج معين من السلة

router.route('/clear')
    .delete(cartController.clearCart); // مسح السلة بالكامل بعد الدفع مثلاً

module.exports = router;