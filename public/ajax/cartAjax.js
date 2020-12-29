const subTotal = document.getElementById('sub_total');
const cartTotal = document.getElementById('cart_total');


const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const cartId = btn.parentNode.querySelector('[name=cartItemId]').value;

    const cartElement = btn.closest('tr');
    fetch('/product/' + cartId + '/' + prodId, {
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