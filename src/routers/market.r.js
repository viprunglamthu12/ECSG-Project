const app = require('express');
const router = app.Router();
const  marketController = require('../controllers/market.c')
const auth = require('../middlewares/auth')


router.get('/',marketController.getMarket)
router.post('/sell/:assetid',auth.auth2,marketController.postSellItem)
router.delete('/:assetid',auth.auth2,marketController.deleteSellItem)
router.post('/buy/:assetid',auth.auth2,marketController.postBuyItem)
router.post('/checkSentItem/:_id',auth.auth2,marketController.checkSendItem)



module.exports = router;