var paypal = require('paypal-node-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AckN_305ooLz38aHfzwJvAlIW8L0_uaF1dO-TKkntcok7VJuvXcv6YgdzMlJJSQx81gDs1SAJbKIf8gT',
    'client_secret': 'EJ24iTScf3nsRGSZa73QG0a96NX6cKMr6O3uRG9dsReK_g5cM_8Grm_hAdw-84QR9tp4a41MrLtesZDW'
});

module.exports = paypal