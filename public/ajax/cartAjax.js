const subTotal = document.getElementById('sub_total');
const cartTotal = document.getElementById('cart_total');

const warning_1 = document.getElementById('warning-1');
const warning_2 = document.getElementById('warning-2');

const cart_total_show = document.getElementById('cart-total');


const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const cartId = btn.parentNode.querySelector('[name=cartItemId]').value;

    const cartElement = btn.closest('tr');
    fetch('/cart/' + cartId + '/' + prodId, {
            method: 'DELETE'
        })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data);
            cartElement.parentNode.removeChild(cartElement);
            subTotal.innerText = data.cartTotal;
            cartTotal.innerText = data.cartTotal;
            cart_total_show.setAttribute('data-notify', data.totalQty);
        })
        .catch(err => console.log(err));
};

const changeQuantityDown = (btn) => {
    const cartId = btn.parentNode.querySelector('[name=cartItemId]').value;
    const prodId = btn.parentNode.querySelector('[name=productId]').value;

    let quantity = btn.parentNode.querySelector('[name=quantity]').value;
    if (quantity > 1) {
        quantity -= 1;


        const product_price = document.getElementById(`product_price_${cartId}`);
        const product_total = document.getElementById(`product_total_${cartId}`);

        fetch('/cart/' + cartId + '/' + prodId + '/' + quantity, {
                method: 'PUT'
            })
            .then(result => {
                return result.json();
            })
            .then(data => {
                console.log(data);
                subTotal.innerText = data.cartTotal;
                cartTotal.innerText = data.cartTotal;
                btn.parentNode.querySelector('[name=quantity]').value = quantity;
                product_total.innerHTML = eval(+product_price.innerHTML * +quantity);
                cart_total_show.setAttribute('data-notify', data.totalQty);
            })
            .catch(err => console.log(err));
    }
};

const changeQuantityUp = (btn) => {
    const cartId = btn.parentNode.querySelector('[name=cartItemId]').value;
    const prodId = btn.parentNode.querySelector('[name=productId]').value;

    let quantity = btn.parentNode.querySelector('[name=quantity]').value;
    quantity = +quantity + +1;

    const product_price = document.getElementById(`product_price_${cartId}`);
    const product_total = document.getElementById(`product_total_${cartId}`);

    fetch('/cart/' + cartId + '/' + prodId + '/' + quantity, {
            method: 'PUT'
        })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data);
            subTotal.innerText = data.cartTotal;
            cartTotal.innerText = data.cartTotal;
            btn.parentNode.querySelector('[name=quantity]').value = quantity;
            product_total.innerHTML = eval(+product_price.innerHTML * +quantity);
            cart_total_show.setAttribute('data-notify', data.totalQty);

        })
        .catch(err => console.log(err));
};


const addToCart = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const size = document.querySelector('#select2-productSize-container').innerText;
    const color = document.querySelector('#select2-productColor-container').innerText;
    const quantity = btn.parentNode.querySelector('[name=quantity]').value;
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
        fetch('/cart/' + prodId + '/' + size + '/' + color + '/' + quantity, {
                method: 'PUT'
            })
            .then(result => {
                return result.json();
            })
            .then(data => {
                console.log(data);
                cart_total_show.setAttribute('data-notify', data.totalQty);
            })
            .catch(err => console.log(err));
    }
};