const ItemSell = require('../models/itemSell')
const TradeHistory = require('../models/tradeHistory')
const User = require('../models/user')
const steam = require('../Steam/steam')
const hbsH = require('../helpers/hbs_market_helper')
const {sendSellerEmail,sendBuyerEmail} = require('../email/email')

const getUserSellItem = async (steamid)=>{
    const result = await ItemSell.find({
        'steamid': steamid
    })
    console.log(result);
    return result;
}




exports.getMarket = async(req,res,next)=>{
    const match ={
        exterior : ['Factory New',"Minimal Wear","Field-Tested","Well-Worn","Battle-Scarred",undefined],
        quality: ["Normal","StatTrak™","Souvenir",undefined],
        rarity: [undefined,"Consumer Grade","Mil-Spec Grade","Industrial Grade","Restricted","Classified","Covert","Distinguished","Exceptional","Superior","Master","Base Grade","Extraordinary","High Grade","Remarkable","Exotic","Contraband"],
        category: [undefined,"Knive","Glove","Rifle","Sniper Rifle","Pistol","SMG","Shotgun","Machinegun","Container","Graffiti"],
        search: "",
        minPrice: 0,
        maxPrice: 21999,
    };

    const matchReturn = {
        exterior:[],
        quality: [],
        rarity: [],
        category: [],
        search: "",
    }

    const sort = {}

    if(req.query.minPrice && req.query.maxPrice){
        match.minPrice = req.query.minPrice;
        match.maxPrice = req.query.maxPrice;
        matchReturn.minPrice = req.query.minPrice;
        matchReturn.maxPrice = req.query.maxPrice;
    }

    if(req.query.sort){
        match.sort =req.query.sort
        matchReturn.sort = req.query.sort
        if(req.query.sort == "priceAsc"){
           sort['price'] = 1
        }else if(req.query.sort == "priceDesc"){
            sort['price'] = -1
        }
    }

    if(req.query.search){
        match.search = req.query.search
        matchReturn.search =  req.query.search
    }

    if(req.query.rarity){
        if(req.query.rarity != "All" && !req.query.rarity.includes("All")){
            if(!Array.isArray(req.query.rarity) ){
                match.rarity = [];
                match.rarity.push(req.query.rarity)
                matchReturn.rarity = match.rarity
            }
            else{
                match.rarity = req.query.rarity;
                matchReturn.rarity = req.query.rarity;
            }
        } else{
            matchReturn.rarity = ["All"]
        }
    }

    if(req.query.exterior){
        if(req.query.exterior != "All" && !req.query.exterior.includes("All")){
            if(!Array.isArray(req.query.exterior)){
                match.exterior = [];
                match.exterior.push(req.query.exterior)
                matchReturn.exterior = match.exterior
            }
            else{
                match.exterior = req.query.exterior;
                matchReturn.exterior = req.query.exterior;
            }
        }
    }


    if(req.query.quality){
        if(req.query.quality != "All" ){
            if(!Array.isArray(req.query.quality)){
                match.quality = [];
                match.quality.push(req.query.quality)
                matchReturn.quality = match.quality
            }
            else{
                match.quality = req.query.quality;
                matchReturn.quality = req.query.quality;
            }
        } else{
            matchReturn.quality = ["All"]
        }
    }

    if(req.query.category){
        if(req.query.category != "All" && !req.query.category.includes("All")){
            if(!Array.isArray(req.query.category)){
                match.category = [];
                match.category.push(req.query.category)
                matchReturn.category = match.category
            }
            else{
                match.category = req.query.category;
                matchReturn.category = req.query.category;
            }
        } else{
            matchReturn.category = ["All"]
        }
       
    }

    if(req.query.minPrice && req.query.maxPrice){
        match.price = {$gte: req.query.minPrice, $lte: req.query.maxPrice};
    }



    try{
        const itemSells = await ItemSell.find({
            rarity: {$in: match.rarity},
            quality: {$in: match.quality},
            exterior: {$in: match.exterior},
            category: {$in: match.category},
            name: {"$regex": match.search},
            price: {$gte: match.minPrice, $lte: match.maxPrice},
        }).sort(sort);
  
        res.render('market',{
            itemSells,
            helpers: hbsH,
            match: matchReturn,
            isLogin: req.isAuthenticated(),
            user: req.user,
        })
    }catch(e){
        next(e)
    }
}

exports.postSellItem = async(req,res,next)=>{
    try{
        await steam.getInventory(req.user.steamid, async (error,inventory) => {
            if(error){
                next(error);
            }
            const found = inventory.find(item=>item.assetid == req.params.assetid)
            if(found){
                var category,rarity,exterior,quality;
                var foundAttr = found.tags.find(tag=> tag.category == "Exterior")
                if(foundAttr){
                 exterior = foundAttr.name;
                }
                foundAttr = found.tags.find(tag=> tag.category == "Quality")
                if(foundAttr){
                 quality = foundAttr.name;
                }
                foundAttr = found.tags.find(tag=> tag.category == "Rarity")
                if(foundAttr){
                 rarity = foundAttr.name;
                }
                foundAttr = found.tags.find(tag=> tag.category == "Type")
                if(foundAttr){
                 category = foundAttr.name;
                }
                try{
                    const itemSell = new ItemSell({
                        assetid: found.assetid,
                        steamid: req.user.steamid,
                        price: req.body.price,
                        name: found.name,
                        icon_url: found.icon_url,
                        category,
                        rarity,
                        exterior,
                        quality
                        
                    })
                    await itemSell.save();
                }catch(e){
                    console.log(e  )
                    return res.status(400).send(e);
                }
                
                
                res.send("Sell item successfull");
            }else{
                res.status(400).send('There was a Error when sell Item. It can be Item not in your inventory anymore or lock tradign')
            }
        });
        
        
    }catch(e){
        res.status(400).send(e);
    }

    
}

exports.deleteSellItem = async(req,res,next)=>{
    const _id = req.params.assetid;
    try{
        const sellItem = await ItemSell.findOneAndDelete({
            assetid:_id,
            steamid: req.user.steamid,
        })
        if(sellItem){
            res.send('Delete sell item success');
        }else{
            next('You can not delete this item')
        }
    }catch(e){
        throw (e);
    }
}

exports.postBuyItem = async (req,res,next)=>{
    // try{
    //     const item = await ItemSell.findOne({
    //         assetid: req.body.assetid,
    //     })

    //     const seller = await User.findOne({
    //         steamID: item.steamid
    //     })
    //     //Khong du tien
    //     if(req.userInfo.money < item.price){
            
    //     }

    //     const sendInfo = {
    //         accountName: req.userInfo.steamAccount,
    //         password: req.userInfo.steamPassword,
    //         authcode: req.userInfo.steamAuthCode,
    //         assetid: req.body.assetid,
    //         parnerURL: seller.tradeURL,

    //     }
    //     steam.logInToSendItem(sendInfo)

        
    // }catch(e){
    //     next(e);
    // }


    try{
        const assetid = req.params.assetid
        const userInfo = await User.findOne({
            steamid: req.userInfo.steamid, 
        })
        const itemSell = await ItemSell.findOne({
            assetid,
        })
        if(itemSell==undefined){
            return res.send({
                status: 'Error',
                message: 'Item not exist anymore'}
                )
        }
       
        if(userInfo.steamid == itemSell.steamid){
            return res.send({
                status: 'Warning',
                message: 'You can not buy item of yourself'}
                )
        }
        if(userInfo.money < itemSell.price){
            return res.send({
                status: 'Warning',
                message: 'You dont have enough money.'}
                )
            
        }
        if(userInfo.tradeURL == null || userInfo.apiKey == null || userInfo.email ==null){
            return res.send({
                status: 'Warning',
                message: 'You need to provide enough Information to buy this.'}
                )
        }

        const trade = new TradeHistory({
            status: 'Sending',
            assetid,
            buyerID: userInfo.steamid,
            sellerID: itemSell.steamid,
            price: itemSell.price,
            name: itemSell.name,
            icon_url: itemSell.icon_url,
            category: itemSell.category,
            rarity: itemSell.rarity,
            exterior: itemSell.exterior,
            quality: itemSell.quality,
        })

        await trade.save();

        userInfo.money -= itemSell.price;
        userInfo.freeze += itemSell.price;
        await userInfo.save();
        const seller = await User.findOne({
            steamid: itemSell.steamid
        })
        sendSellerEmail(seller.email,itemSell.name);
        await ItemSell.findOneAndDelete({
            assetid: itemSell.assetid,
        })

        return res.send({
            status: 'Success',
            message: 'Buy success. Waiting seller to send you item.'}
            )
        
    }catch(e){
        next(e);
    }
}

exports.checkSendItem = async(req,res,next)=>{
    try{
        const tradeHistory = await TradeHistory.findById(req.params._id)
        const buyer = await User.findOne({steamid: tradeHistory.buyerID})
        const seller = await User.findOne({steamid: tradeHistory.sellerID})

        steam.loadOfferSend(req.userInfo.apiKey,async (err,data)=>{
            if(err){
                next(err);
            }else{
                const _offer = data.response.trade_offers_sent.find((offer)=>{
                    if( offer.accountid_other == steam.getAccountid(tradeHistory.buyerID)&&(offer.trade_offer_state == 2 || offer.trade_offer_state == 3 )){
                        if(offer.items_to_give){
                            const _item = offer.items_to_give.find((item)=>item.assetid == tradeHistory.assetid );
                            if(_item){
                                return true;
                            }else{
                                return false;
                            }
                        }
                    }
                     return false;
                })
                if(_offer){
                    tradeHistory.offerID = _offer.tradeofferid;
                    tradeHistory.status = 'completed';
                    buyer.freeze -= tradeHistory.price;
                    seller.money += tradeHistory.price * 0.98;

                    await tradeHistory.save();
                    await buyer.save();
                    await seller.save();
                    await sendBuyerEmail(buyer.email)
                    res.send({
                        status: 'Success',
                        message: 'Check successful'})
                }else{
                    res.send({
                        status: 'Error',
                        message: 'Check fail. Please try again'})
                }
            }
        })
    }catch(e){
        next(e);
    }
   
}