const mongoose = require('mongoose')
var CryptoJS = require("crypto-js");

const secretKey = "ECSG"

const userSchema = new mongoose.Schema({
    steamid:{
        type: String,
        require: true,
        unique: true
    },
    accountType:{
        type: Boolean,
        default:0,
    },
    name:{
        type: String,
        require: true,
    },
    avatar:{
        type: String,
    },
    money:{
        type: Number,
        default: 0,
    },
    rate:{
        type: Number,
        default: 0,
    },
    email:{
        type: String,
    },
    tradeURL:{
        type: String,
    },
    apiKey:{
        type: String,
    },
    freeze:{
        type: Number,
        default: 0,
    }
})

userSchema.virtual('itemSells',{
    ref:'Item Sell',
    localField: 'steamid',
    foreignField: 'steamid',
})

userSchema.virtual('itemSending',{
    ref:'TradeHistory',
    localField: 'steamid',
    foreignField: 'sellerID',
})

const User = mongoose.model('Users',userSchema);

userSchema.pre('save', async function(next){
    const user =this;

    if(user.isModified(steamPassword)){
        user.steamPassword =  CryptoJS.AES.encrypt(user.steamPassword,secretKey)
    }

    if(user.isModified(steamAuthCode)){
        user.steamAuthCode =  CryptoJS.AES.encrypt(user.steamAuthCode,secretKey)
    }
})

module.exports = User;