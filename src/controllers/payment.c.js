const paypal = require('paypal-node-sdk')
const User = require('../models/user')

exports.postPay = async(req,res,next)=>{
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:3000/payment/success/${req.body.refillAmount}`,
            "cancel_url": "http://localhost:3000/payment/cancel"
        },
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": req.body.refillAmount,
            },
            "description": "Refill Balance"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }

        }
    });
}

exports.getSuccess = async (req,res)=>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": req.params.money
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, async function(error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            try{
                console.log(JSON.stringify(payment));
                const user = await User.findOne({steamid: req.user.steamid});
                user.money += Number(req.params.money);
                await user.save ()
                res.redirect('/user/profile')
            }catch(e){
                throw(e);
            }
           
           
        }
    });
}

exports.getCancel = (req,res)=>{
    res.redirect('/user/profile')
}