function controlPriceToReceive() {
    const yourPrice = document.getElementById("yourPrice");
    yourPrice.value = yourPrice.value;

    const youReceive = document.getElementById("youReceive");
    youReceive.value = yourPrice.value * 0.98;

}
function controlReceiveToPrice() {
    const youReceive = document.getElementById("youReceive");
    youReceive.value = youReceive.value;
    const yourPrice = document.getElementById("yourPrice");
    yourPrice.value = youReceive.value * 1.02;

}

$('#yourPrice').on('input', controlPriceToReceive)
$('#youReceive').on('input', controlPriceToReceive)

