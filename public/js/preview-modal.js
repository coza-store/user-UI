const modal = document.querySelector('.js-modal1');
const closeModal = document.querySelectorAll('.js-hide-modal1');

//modal data
const pname = document.querySelector('.detail__name');
const price = document.querySelector('.detail__price');
const description = document.querySelector('.detail_description');
const modalImg = document.querySelectorAll('.modal_img');
const dataThumb = document.querySelectorAll('.item-slick3');
const hrefData = document.querySelectorAll('.href-data');
const dotData = document.querySelectorAll('.dot-data');
const product_id = document.querySelector('.product_id');
const productList = document.querySelectorAll('.product-list');
productList.forEach(async(product, index) => {
    const quickView = product.querySelector('.js-show-modal1');
    const productImg = product.querySelectorAll('.product__img');
    const productName = product.querySelector('#product__name').innerText.trim();
    const productPrice = product.querySelector('.product__price').innerText;
    const productId = product.querySelector('.productId').innerText;
    quickView.addEventListener('click', () => {
        modal.classList.add('show-modal1');
        pname.innerText = productName;
        price.innerText = productPrice;
        product_id.setAttribute('value', productId.trim());
        for (let i = 0; i < 3; i++) {
            let img;
            if (i == 0) {
                img = productImg[i].getAttribute('src');
            } else {
                img = productImg[i].innerText.trim();
            }
            modalImg[i].setAttribute('src', img);
            dataThumb[i].setAttribute('data-thumb', img);
            hrefData[i].setAttribute('href', img);
            dotData[i].setAttribute('src', img);
        }

    });
});

closeModal[0].addEventListener('click', () => {
    modal.classList.remove('show-modal1');
});
closeModal[1].addEventListener('click', () => {
    modal.classList.remove('show-modal1');
});