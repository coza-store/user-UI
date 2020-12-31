const subTotal = document.getElementById('sub_total');
const cartTotal = document.getElementById('cart_total');

const warning_1 = document.getElementById('warning-1');
const warning_2 = document.getElementById('warning-2');

const warning_size = document.getElementById('warning-detail-size');
const warning_color = document.getElementById('warning-detail-color');

const cart_total_show = document.getElementById('cart-total');
const modal_popup = document.querySelector('.js-modal1');

const deleteProduct = async(btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const cartId = btn.parentNode.querySelector('[name=cartItemId]').value;

    const cartElement = btn.closest('tr');
    const fetchData = await fetch('/cart/' + cartId + '/' + prodId, {
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
            swal({
                title: data.productName,
                text: "is removed from cart",
                icon: "success",
            });
        })
        .catch(err => console.log(err));
};

const changeQuantityDown = async(btn) => {
    const cartId = btn.parentNode.querySelector('[name=cartItemId]').value;
    const prodId = btn.parentNode.querySelector('[name=productId]').value;

    let quantity = btn.parentNode.querySelector('[name=quantity]').value;
    if (quantity > 1) {
        quantity -= 1;


        const product_price = document.getElementById(`product_price_${cartId}`);
        const product_total = document.getElementById(`product_total_${cartId}`);

        const fetchData = await fetch('/cart/' + cartId + '/' + prodId + '/' + quantity, {
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

const changeQuantityUp = async(btn) => {
    const cartId = btn.parentNode.querySelector('[name=cartItemId]').value;
    const prodId = btn.parentNode.querySelector('[name=productId]').value;

    let quantity = btn.parentNode.querySelector('[name=quantity]').value;
    quantity = +quantity + +1;

    const product_price = document.getElementById(`product_price_${cartId}`);
    const product_total = document.getElementById(`product_total_${cartId}`);

    const fetchData = await fetch('/cart/' + cartId + '/' + prodId + '/' + quantity, {
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


const addToCart = async(btn) => {
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
        warning_1.innerText = "Please choose size";
    } else {
        warning_1.innerText = "";
        checkSize = true;
    }

    if (productColor.options[0].selected === true) {
        warning_2.innerText = "Please choose favorite color";
    } else {
        warning_2.innerText = "";
        checkColor = true;
    }

    if (checkColor == true && checkSize == true) {
        const fetchData = await fetch('/cart/' + prodId + '/' + size + '/' + color + '/' + quantity, {
                method: 'PUT'
            })
            .then(result => {
                return result.json();
            })
            .then(data => {
                console.log(data);
                cart_total_show.setAttribute('data-notify', data.totalQty);
                swal({
                    title: data.productName,
                    text: "is added to cart",
                    icon: "success",
                });
                if (modal_popup) {
                    modal.classList.remove('show-modal1');
                }

            })
            .catch(err => console.log(err));
    }
};

const addToCartDetail = async(btn) => {
    const prodId = btn.parentNode.querySelector('[name=productIdDetail]').value;
    const size = document.querySelector('#select2-productSizeDetail-container').innerText;
    const color = document.querySelector('#select2-productColorDetail-container').innerText;
    const quantity = btn.parentNode.querySelector('[name=quantityDetail]').value;
    console.log(prodId, size, color, quantity);

    let checkSize = false;
    let checkColor = false;

    //kiem tra
    let productSize = document.getElementById('productSizeDetail');
    let productColor = document.getElementById('productColorDetail');


    if (productSize.options[0].selected === true) {
        warning_size.innerText = "Please choose size";
    } else {
        warning_size.innerText = "";
        checkSize = true;
    }

    if (productColor.options[0].selected === true) {
        warning_color.innerText = "Please choose favorite color";
    } else {
        warning_color.innerText = "";
        checkColor = true;
    }

    if (checkColor == true && checkSize == true) {
        const fetchData = await fetch('/cart/' + prodId + '/' + size + '/' + color + '/' + quantity, {
                method: 'PUT'
            })
            .then(result => {
                return result.json();
            })
            .then(data => {
                console.log(data);
                cart_total_show.setAttribute('data-notify', data.totalQty);
                swal({
                    title: data.productName,
                    text: "is added to cart",
                    icon: "success",
                });
                if (modal_popup) {
                    modal.classList.remove('show-modal1');
                }

            })
            .catch(err => console.log(err));
    }
};