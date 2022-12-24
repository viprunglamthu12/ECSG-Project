const CookieParser = require('cookie-parser');
const express = require('express');
const steam =require('./Steam/steam')



const app = express();
const port = 3000;

//cấu hình static assets
app.use(express.static(__dirname + '/public'));
//cấu hình passport
const passport = require('./config/passport')(app);
//cấu hình database
require('./db/mongoose')
//cấu hình paypal
require('./config/paypal')

//cấu hình handlebars
require('./config/hbs')(app);
//parse dữ liệu
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(CookieParser());



app.post('/logincheck',async(req,res)=>{
    try{
        res.send(steam.logInToSendItem(req.body))
    }catch(e){
        console.log(1)
        res.send(e);
    }
    
})

// app.get('/user/inventory',async (req,res)=>{
//     var inventory = []
//     await steam.getInventory('76561198329918048',(inventory)=>{
//         console.log(inventory)
//         res.send(inventory)
//     });
   
// })

app.use('/',require('./routers/home.r'))

app.use('/auth',require('./routers/auth.r'))

app.use('/user',require('./routers/user.r'))

app.use('/market',require('./routers/market.r'))

app.use('/blog',require('./routers/blog.r'))

app.use('/payment',require('./routers/payment.r'))

app.listen(port,()=>console.log(`Server is listening on port ${port}`))



