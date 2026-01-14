// models/order-model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true } // السعر وقت الشراء
        }
    ],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
        street: String,
        city: String,    // مثلاً Lagos, Abuja
        state: String,
        phone: { type: String, required: true } // مهم جداً للتوصيل في نيجيريا
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    paymentReference: String // الكود اللي بيجيلك من Paystack
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);