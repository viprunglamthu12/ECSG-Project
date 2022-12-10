function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromSlider.value = from;
  }
}
function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
  const rangeDistance = to.max - to.min;
  const fromPosition = from.value - to.min;
  const toPosition = to.value - to.min;
  controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
}
function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}
function getParsed(currentFrom, currentTo) {
  const from = parseFloat(currentFrom.value);
  const to = parseFloat(currentTo.value);
  return [from, to];
}

// for Price
function controlPriceToInput(toSlider, fromInput, toInput, controlSlider) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
  setPriceToggleAccessible(toInput);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
  }
}
function controlPriceToSlider(priceFromSlider, priceToSlider, priceToInput) {
  const [from, to] = getParsed(priceFromSlider, priceToSlider);
  fillSlider(priceFromSlider, priceToSlider, '#C6C6C6', '#25daa5', priceToSlider);
  setPriceToggleAccessible(priceToSlider);
  if (from <= to) {
    priceToSlider.value = to;
    priceToInput.value = to;
  } else {
    priceToInput.value = from;
    priceToSlider.value = from;
  }
}

function setPriceToggleAccessible(currentTarget) {
  const priceToSlider = document.querySelector('#priceToSlider');
  if (Number(currentTarget.value) <= 0) {
    priceToSlider.style.zIndex = 2;
  } else {
    priceToSlider.style.zIndex = 0;
  }
}
const priceFromSlider = document.querySelector('#priceFromSlider');
const priceToSlider = document.querySelector('#priceToSlider');
const priceFromInput = document.querySelector('#priceFromInput');
const priceToInput = document.querySelector('#priceToInput');
fillSlider(priceFromSlider, priceToSlider, '#C6C6C6', '#25daa5', priceToSlider);
setPriceToggleAccessible(priceToSlider);

priceFromSlider.oninput = () => controlFromSlider(priceFromSlider, priceToSlider, priceFromInput);
priceToSlider.oninput = () => controlPriceToSlider(priceFromSlider, priceToSlider, priceToInput);
priceFromInput.oninput = () => controlFromInput(priceFromSlider, priceFromInput, priceToInput, priceToSlider);
priceToInput.oninput = () => controlPriceToInput(priceToSlider, priceFromInput, priceToInput, priceToSlider);
// for Float
function controlFloatToInput(toSlider, fromInput, toInput, controlSlider) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
  setFloatToggleAccessible(toInput);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
  }
}
function controlFloatToSlider(floatFromSlider, floatToSlider, floatToInput) {
  const [from, to] = getParsed(floatFromSlider, floatToSlider);
  fillSlider(floatFromSlider, floatToSlider, '#C6C6C6', '#25daa5', floatToSlider);
  setFloatToggleAccessible(floatToSlider);
  if (from <= to) {
    floatToSlider.value = to;
    floatToInput.value = to;
  } else {
    floatToInput.value = from;
    floatToSlider.value = from;
  }
}

function setFloatToggleAccessible(currentTarget) {
  const floatToSlider = document.querySelector('#floatToSlider');
  if (Number(currentTarget.value) <= 0) {
    floatToSlider.style.zIndex = 2;
  } else {
    floatToSlider.style.zIndex = 0;
  }
}
const floatFromSlider = document.querySelector('#floatFromSlider');
const floatToSlider = document.querySelector('#floatToSlider');
const floatFromInput = document.querySelector('#floatFromInput');
const floatToInput = document.querySelector('#floatToInput');
fillSlider(floatFromSlider, floatToSlider, '#C6C6C6', '#25daa5', floatToSlider);
setFloatToggleAccessible(floatToSlider);

floatFromSlider.oninput = () => controlFromSlider(floatFromSlider, floatToSlider, floatFromInput);
floatToSlider.oninput = () => controlFloatToSlider(floatFromSlider, floatToSlider, floatToInput);
floatFromInput.oninput = () => controlFromInput(floatFromSlider, floatFromInput, floatToInput, floatToSlider);
floatToInput.oninput = () => controlFloatToInput(floatToSlider, floatFromInput, floatToInput, floatToSlider);


function filterButton() {
  let filter = document.getElementById("filter");
  if (filter.style.display === "none") {
    filter.style.display = "initial";
  }
  else {
    filter.style.display = "none";
  }
}
function screenSize() {
  let screen = window.matchMedia("(min-width: 960px)");
  if (screen.matches) {
    document.getElementById("filter").style.display = "initial";
  }
}