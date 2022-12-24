module.exports = {
    getImg: function(){
        return "https://steamcommunity-a.akamaihd.net/economy/image/" + this.icon_url;
    },

    getName: function(){
        return this.name;
    },
    getPrice: function(){
        return this.price;
    },
    getCategory: function(){
        return this.category;
    },
    getRarity: function(){
        return this.rarity;
    },
    getExterior: function(){
        return this.exterior;
    },
    getQuality: function(){
        return this.quality;
    },
    getAssetid: function(){
        return this.assetid;
    },
    getPaymentType: function(){
        if(this.buyerID == this.steamid){
            return "Buy"
        }else if(this.sellerID == this.steamid){
            return "Sell"
        }
    }
}