//cap nhat anh cho modal
const detailImg = document.querySelectorAll('.dot-data');
const productImg = document.querySelectorAll('.product__img');
for (let i = 0; i < 3; i++) {
    detailImg[i].setAttribute('src', productImg[i].getAttribute('src'));
}