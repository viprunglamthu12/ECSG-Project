const userController = require('../controllers/user.c')
const app = require('express');
const auth = require('../middlewares/auth');
const router = app.Router();



router.get('/logout',auth.auth,userController.getLogout)
router.get('/inventory',auth.auth,userController.getInventory)
router.get('/regist',auth.auth,userController.getRegist)
router.post('/regist',auth.auth,userController.postRegist)
router.post('/update',auth.auth,userController.updateAccount)
router.get('/profile',auth.auth,userController.getProfile)
router.patch('/profile',auth.auth,userController.updateProfile)

module.exports = router;