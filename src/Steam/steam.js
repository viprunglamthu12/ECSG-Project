const tradeOfferManager = require('steam-tradeoffer-manager')
const SteamCommunity = require('steamcommunity');
const SteamUser = require('steam-user');
const SteamID = SteamCommunity.SteamID;
const request = require('request')

const appID = 730;
const contextID = 2;

const community = new SteamCommunity();

const sendItem = (manager, parnerURL, assetID) => {
    const offer = manager.createOffer(parnerURL);
    offer.addTheirItem({ "appid": appID, "contextid": contextID, "assetid": assetID })
    offer.setMessage('ECSG');
    offer.send((err, status) => {
        if (err) {
            console.log(err);
        } else {
            console.log('trade sent');
            console.log(status)
            console.log(offer.id)
        }
    })
}


module.exports = {
    getInventory: async (id, callback) => {
        await community.getUserInventoryContents(new SteamID(id), appID, contextID, true, 'en', (err, invetory) => {
            callback(err,invetory)
        })
    },

    getInventoryAll: async(id,callback)=>{
        await community.getUserInventoryContents(new SteamID(id), appID, contextID, false, 'en', (err, invetory) => {
           callback(err,invetory);
        })
    },

    logInToSendItem: (user) => {
        try {
            const client = new SteamUser();

            var manager = new tradeOfferManager({
                steam: client,
                domain: "localhost",
                language: 'en'

            })

            const logInOptions = {
                accountName: user.accountName,
                password: user.password,
            }

            client.logOn(logInOptions);

            client.on('webSession', (sid, cookies) => {
                console.log(sid)
                manager.setCookies(cookies, () => {
                    sendItem(manager,user.parnerURL,user.assetID);
                })

            })

            client.on('error', (err) => {
                console.log(err);
            })

            client.logOff();


        } catch (e) {
            console.log(1);
            throw (e);
        }
    },

    loadOfferSend: (apiKey,callback)=>{
        const url = `https://api.steampowered.com/IEconService/GetTradeOffers/v1?key=${apiKey}&get_sent_offers=true&get_received_offers=false&get_descriptions=true&language=en&active_only=false&historical_only=false&time_historical_cutoff=0&fbclid=IwAR21ltlKV18mdupjrY7lZjgbfqzVUiHdzrpJwA_0fTv5blVZcElySmbvV-M`

        request({url,json:true},(error,{body})=>{
            if(error){
                callback('Unable to read',undefined)
            }else{
                callback(undefined,body)
            }
        })
    },

    getAccountid: (id)=>{
        return new SteamID(id).accountid

    }



}