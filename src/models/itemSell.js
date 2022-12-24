const mongoose = require('mongoose')
const User = require('../models/user')

const itemSellSchema = new mongoose.Schema({
    assetid: {
        type: String,
        required: true,
        unique:true,
    },
    steamid:{
        type: String,
        required: true,
        ref: User,
    },
    price:{
        type: Number,
        required: true,
        validate(value){
            if(value<= 0){
                throw new Error('Price must be greater than 0')
            }
        }
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
    }
});

itemSellSchema.post('save',(error,doc,next)=>{
    if (error.name === 'MongoError' && error.code === 11000) {
        error.message = 'Item is selling!'
      } else {
        next();
      }
})

const ItemSell = mongoose.model('Item Sell',itemSellSchema)



module.exports = ItemSell