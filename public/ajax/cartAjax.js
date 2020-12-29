const subTotal = document.getElementById('sub_total');
const cartTotal = document.getElementById('cart_total');

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
        })
        .catch(err => console.log(err));
};