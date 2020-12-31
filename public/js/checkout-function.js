const stripe = Stripe('pk_test_51HyteKG8oVt195nhRCjiFshG5hjbAUcFfOlOMs9nHtLzadlAQc6Hb88V9tC2zV8hqwnzuPnn33quLuzxebpZvc9H00i3qAPQgR');
const orderBtn = document.getElementById('order-button');
const form = document.getElementById('order-form');
const sessionId = document.getElementById('sessionId').innerText;
const warning_1 = document.getElementById('warning-1');
const warning_2 = document.getElementById('warning-2');
const warning_3 = document.getElementById('warning-3');
const warning_4 = document.getElementById('warning-4');
const warning_5 = document.getElementById('warning-5');

orderBtn.addEventListener('click', function(e) {
    e.preventDefault();
    let checkAddress = false;
    let checkPhone = false;
    let checkEmail = false;
    let checkCity = false;
    let checkDistrict = false;
    //lay thong tin ca nhan cua khach hang
    const address = document.getElementById('address');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const city = document.getElementById('provinces');
    const district = document.getElementById('district');

    if (address.value === "" || address.value === null) {
        warning_1.innerText = "Please enter address";
        address.classList.add('invalid');
    } else {
        warning_1.innerText = "";
        checkAddress = true;
    }
    if (phone.value.length !== 10 || phone.value === "" || phone.value === null) {
        warning_2.innerText = "Invalid phone number";
        phone.classList.add('invalid');
    } else {
        warning_2.innerText = "";
        checkPhone = true;
    }
    if (!validateEmail(email.value) || email.value === "" || email.value === null) {
        warning_3.innerText = "Invalid email";
        email.classList.add('invalid');
    } else {
        warning_3.innerText = "";
        checkEmail = true;
    }

    if (city.options[0].selected === true) {
        warning_4.innerText = "Please choose city";
    } else {
        warning_4.innerText = "";
        checkCity = true;
    }

    if (district.options[0].selected === true) {
        warning_5.innerText = "Please choose district";
    } else {
        warning_5.innerText = "";
        checkDistrict = true;
    }

    if (checkAddress == true && checkPhone == true && checkEmail == true && checkCity == true && checkDistrict == true) {
        stripe.redirectToCheckout({
            sessionId: sessionId
        });
        form.submit();
    }
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}