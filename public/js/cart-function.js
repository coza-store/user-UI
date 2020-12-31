//kiem tra tong tien trong cart
const TotalPrice = document.getElementsByClassName('total_price');
const SubTotal = document.getElementById('sub_total');
const CartTotal = document.getElementById('cart_total');

let total = 0;
for (let i = 0; i < TotalPrice.length; i++) {
    total = total + '+' + TotalPrice[i].innerText;
}
if (SubTotal && CartTotal) {
    SubTotal.innerText = eval(total).toFixed(2);
    CartTotal.innerText = eval(total).toFixed(2);
}