const mongoose = require('mongoose')
const User = require('./user')
const ItemSell = require('./itemSell')

const tradeHistorySchema = new mongoose.Schema({
    sellerID:{
        type:String,
        require: true,
        ref:User,
    },
    buyerID:{
        type:String,
        require: true,
        ref:User,
    },
    assetid:{
        type:String,
        require: true,
        ref: ItemSell,
    },
    status:{
        type: String,
        require: true,
    },
    price:{
        type: Number,
        require: true,
    },
    name:{
        type: String,
        required: true,
    },
    icon_url:{
        type: String,
        required: true,
    },
    category:{
        type:String,
    },
    rarity:{
        type:String,
    },
    exterior:{
        type:String,
    },
    quality:{
        type:String,
    },
    offerID:{
        type: String,
    }

},{
    timestamps: true,
})



const TradeHistory = mongoose.model('TradeHistory',tradeHistorySchema)

module.exports = TradeHistory