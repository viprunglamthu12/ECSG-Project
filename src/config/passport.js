const passport = require('passport');
const steamStragery = require('passport-steam').Strategy;
const session = require('express-session');

const apiKey='BDBD1ED3476F7820F41752B3BB68EF9F'

passport.serializeUser((user,done)=>{
    console.log(user._json);
    done(null,user._json);
})

passport.deserializeUser((obj,done)=>{
    done(null,obj);
})

passport.use(new steamStragery({
    returnURL: 'http://localhost:3000/auth/steam/return'
    ,realm: 'http://localhost:3000/'
    ,apiKey
},(identifier,profile,done)=>{
    process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
       });
}))

module.exports = (app) =>{
    app.use(session({
        key: 'session_id'
        , secret: 'vmhm'
        , resave: true
        , saveUninitialized: true
        , cookie: {
            maxAge: 259200000
        }
    }))
    app.use(passport.initialize());
    app.use(passport.session());

    return passport;
}