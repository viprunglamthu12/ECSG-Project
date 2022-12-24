const blogC = require("../controllers/blog.c")
const app = require('express');
const router = app.Router();

router.get('/',blogC.getBlog)

module.exports = router;
