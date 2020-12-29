//kiem tra form addToCart da co du lieu chua ?
const addToCartForm = document.getElementById('addToCart-form');
const warning_1 = document.getElementById('warning-1');
const warning_2 = document.getElementById('warning-2');


addToCartForm.onsubmit = checkData = (e) => {
    e.preventDefault();
    let checkSize = false;
    let checkColor = false;

    //kiem tra
    let productSize = document.getElementById('productSize');
    let productColor = document.getElementById('productColor');


    if (productSize.options[0].selected === true) {
        warning_1.innerText = "Please choose your size";
    } else {
        warning_1.innerText = "";
        checkSize = true;
    }

    if (productColor.options[0].selected === true) {
        warning_2.innerText = "Please choose your favorite color";
    } else {
        warning_2.innerText = "";
        checkColor = true;
    }

    if (checkColor == true && checkSize == true) {
        addToCartForm.submit();
    }
}