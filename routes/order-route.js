const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo'); // ميديول الصلاحيات لو موجود عندك
const userRoles = require('../utils/userRoles');

// كل الـ Routes هنا محتاجة تسجيل دخول
router.use(verifyToken);

router.route('/')
    // المستخدم يطلب الأوردر الخاص به
    .post(orderController.createOrder)
    
    // لو مستخدم عادي هيشوف طلباته، لو آدمن هيشوف كل طلبات المحل
    // (ممكن تعدل المنطق ده في الـ Controller)
    .get(orderController.getMyOrders);

// Route خاص بالآدمن فقط لتغيير حالة الطلب (مثلاً من Processing لـ Shipped)
// router.route('/:orderId/status')
//     .patch(allowedTo(userRoles.ADMIN,userRoles.MANAGER), orderController.updateOrderStatus);

module.exports = router;