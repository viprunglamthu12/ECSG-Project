const homeController = require("../controllers/home.c")
const app = require('express');
const router = app.Router();

router.get('/',homeController.getHome)

module.exports = router;

