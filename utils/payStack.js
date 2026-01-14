// utils/paystack.js
const axios = require('axios');

const initializePayment = async (email, amount) => {
    const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email,
            amount: amount * 100, // Paystack بيحسب بالكوبو (Kobo)، لازم نضرب في 100
            currency: "NGN"
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data; // هيرجع رابط الدفع (authorization_url)
};

module.exports = { initializePayment };