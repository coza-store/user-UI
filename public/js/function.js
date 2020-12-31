//cap nhat anh cho modal
const detailImg_detail = document.querySelectorAll('.dot-data-detail');
const productImg_detail = document.querySelectorAll('.product__img');
for (let i = 0; i < 3; i++) {
    detailImg_detail[i].setAttribute('src', productImg_detail[i].getAttribute('src'));
}