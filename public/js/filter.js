const form = document.getElementById('filter-form');
const colorBody = document.getElementById('colorBody');
const tagBody = document.getElementById('tagBody');
const lowestPrice = document.getElementById('lowestPriceBody');
const highestPrice = document.getElementById('highestPriceBody');
const sortBody = document.getElementById('sortBody');

const getColor = (btn, e) => {
    e.preventDefault();
    colorBody.value = btn.innerText;
    form.submit();
}
const getTag = (btn, e) => {
    e.preventDefault();
    tagBody.value = btn.innerText.toLowerCase();
    if (btn.innerText == "Women") {
        tagBody.value = "woman";
    }
    form.submit();
}

const removeFilter = (e) => {
    e.preventDefault();
    colorBody.value = "";
    tagBody.value = "";
    lowestPrice.value = "";
    highestPrice.value = "";
    form.submit();
}

const getPrice = (btn, e) => {
    e.preventDefault();
    const range = btn.value.split("-");
    lowestPrice.value = range[0];
    highestPrice.value = range[1];
    if (range[1] == undefined) {
        highestPrice.value = 10000000000;
    }
    form.submit();
}

const getSort = (btn, e) => {
    e.preventDefault();
    sortBody.value = btn.value;
    form.submit();
}