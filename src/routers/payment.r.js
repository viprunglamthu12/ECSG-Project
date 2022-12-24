const app = require('express');
const router = app.Router();
const  paymentController = require('../controllers/payment.c')
const auth = require('../middlewares/auth')

router.post('/pay',auth.auth,paymentController.postPay)
router.get('/success/:money',auth.auth,paymentController.getSuccess)
router.get('/cancel',auth.auth,paymentController.getCancel)

module.exports = router