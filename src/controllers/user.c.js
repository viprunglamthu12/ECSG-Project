const steam =require('../Steam/steam')
const User= require('../models/user')
const ItemSell = require('../models/itemSell')
const TradeHistory = require('../models/tradeHistory')
const hbsH = require('../helpers/hbs_helper')
const hbsH2 = require('../helpers/hbs_market_helper')


const getUserSellHistory = async(steamid)=>{
    const result = await TradeHistory.find({$or : [{
        'sellerID': steamid,
    },{
        'buyerID': steamid,
    }]}).lean()

    return result;
}

exports.getRegist = async(req,res,next)=>{
    res.render('regist',{
        isLogin: req.isAuthenticated(),
    })
}

exports.postRegist = async(req,res,next)=>{
    try{
        const check = await User.findOne({
            steamid: req.user.steamid
        })

        if(!check){
            const user = new User({
                ...req.body,
                steamid: req.user.steamid,
                name: req.user.name,  
                avatar: req.user.avatar, 
            })
            await user.save();
            res.redirect('/');

            
        } else{
            next('Can not REgist')
        }
        
    }catch(e){
        throw(e);
    }
}

exports.updateAccount = async(req,res,next)=>{
    const updates = Object.keys(req.body);

    const allowedUpdates = ['tradeURL','apiKey','steamAccount','steamPassword','steamAuthCode'];

    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.send('Invalid Update')
    }

    try{
        const user = await User.findOne({
            steamid: req.user.steamid,
        })

        updates.forEach(update=>{
            user[update] = req.body[update];
        })

        res.send('success');

        await user.save();
    }catch(e){
        next(e);
    }
}

exports.getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/');
    });

}

exports.getInventory = async (req, res, next) => {
    try{
        var search ="";
        if(req.query.search){
            search = req.query.search
        }

        await steam.getInventory(req.user.steamid, (error,inventory) => {
            //return res.send(inventory)
            if(req.query.search){
                inventory = inventory.filter(item=>item.name.includes(search) )
            }
            res.render('inventory',{
                inventory,
                isLogin: req.isAuthenticated(),
                helpers: hbsH,
                error: error,
                user: req.user,
                search,
            })
        })
    }catch(e){
        console.log(e)
    }
    ;

}

exports.getProfile = async(req,res,next)=>{

   

    const userInfo = await User.findOne({steamid: req.user.steamid}).lean().populate('itemSells').populate('itemSending')
    userInfo.itemSending = userInfo.itemSending.filter(item => item.status=="Sending")
    const tradeHistory = await getUserSellHistory(req.user.steamid)
    for (var i =0;i<tradeHistory.length;i++){
        if(tradeHistory[i].buyerID == req.user.steamid){
            tradeHistory[i].type = "Buy"
        }else if(tradeHistory[i].sellerID == req.user.steamid){
            tradeHistory[i].type = "Sell"
        }
    }

    
    steam.getInventory(req.user.steamid,async (err,inventory)=>{
        if(err){
            next(err)
        }else{
            for(var i=0;i<userInfo.itemSending.length;i++){

                const buyer = await User.findOne({
                    steamid: userInfo.itemSending[i].buyerID
                })
                userInfo.itemSending[i].url =buyer.tradeURL;

                const position = inventory.findIndex((item)=>item.assetid ==userInfo.itemSending[i].assetid) ;
                
                userInfo.itemSending[i].page = Math.floor((position+1)/16) + 1;
                userInfo.itemSending[i].index = Math.floor(position%16) + 1;

            }

            

            res.render('profile',{
                isLogin: req.isAuthenticated(),
                tradeHistory,
                user: req.user,
                info: userInfo,
                helpers: hbsH2,
            })
        }
    });
}

exports.updateProfile = async(req,res,next)=>{
    const  updates = Object.keys(req.body);
    const allowedUpdates = ['email','apiKey','tradeURL'];
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try{
        const userInfo = await User.findOne({steamid: req.userInfo.steamid})
        updates.forEach(update=>{
            userInfo[update] = req.body[update]
        })

        await userInfo.save()
        res.status(200).send('Update success')
    }catch(e){
        res.status(400).send(e);
    }
}