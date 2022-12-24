const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY ="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"
const severmail="ecommercecsgo@hotmail.com"

sgMail.setApiKey(SENDGRID_API_KEY)

const sendSellerEmail = (email,item)=>{
    sgMail.send({
        to: email,
        from: severmail,
        subject: 'Someone bought your item',
        text: `We found a buyer for your ${item}, go to Website to send your item and confirm`
    })
}

const sendBuyerEmail = (email)=>{
    sgMail.send({
        to: email,
        from: severmail,
        subject: 'Your item has been arrived',
        text: `Your item has been arrived please receive`
    })
}

module.exports ={
    sendSellerEmail,sendBuyerEmail
}