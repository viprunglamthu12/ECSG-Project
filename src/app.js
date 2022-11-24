const express = require('express');

const app = express();
const port = 3000;

//cấu hình static assets
app.use(express.static(__dirname + '/public'));
//cấu hình handlebars
require('./config/hbs')(app);
//parse dữ liệu
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.render('home');
})

app.listen(port,()=>console.log(`Server is listening on port ${port}`))