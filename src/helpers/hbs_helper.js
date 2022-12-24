module.exports = {
    getQuality: function(){
        const found = this.tags.find(tag=> tag.category == "Quality")
        if(found){
            return found.name;
        }
        
    },

    getExterior: function(){
        const found = this.tags.find(tag=> tag.category == "Exterior")
       if(found){
        return found.name;
       }
    },

    getType: function(){
        const found = this.tags.find(tag=> tag.category == "Type")
       if(found){
        return found.name;
       }
    },
    getCategory: function(){
        const found = this.tags.find(tag=> tag.category == "Weapon")
        if(found){
         return found.name;
        }
    },

    getImg: function(){
        return "https://steamcommunity-a.akamaihd.net/economy/image/" + this.icon_url;
    }
}