const exphbs = require('express-handlebars');

module.exports = (app) =>{
    app.engine('hbs',exphbs.engine({
        extname: 'hbs',
    }));
    app.set ('view engine','hbs')
}