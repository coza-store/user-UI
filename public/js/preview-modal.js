const modal = document.querySelector('.js-modal1');
const closeModal = document.querySelectorAll('.js-hide-modal1');

//modal data
const name = document.querySelector('.detail__name');
const price = document.querySelector('.detail__price');
const description = document.querySelector('.detail_description');
const modalImg = document.querySelectorAll('.modal_img');
const dataThumb = document.querySelectorAll('.item-slick3');
const hrefData = document.querySelectorAll('.href-data');
const dotData = document.querySelectorAll('.dot-data');
const product_id = document.querySelector('.product_id');
const productList = document.querySelectorAll('.product-list');

productList.forEach((product, index) => {
    const quickView = product.querySelector('.js-show-modal1');

    const productImg = product.querySelectorAll('.product__img');
    const productName = product.querySelector('.product__name').innerText;
    const productPrice = product.querySelector('.product__price').innerText;
    const productId = product.querySelector('.productId').innerText;

    quickView.addEventListener('click', () => {
        modal.classList.add('show-modal1');
        name.innerText = productName;
        price.innerText = productPrice;
        product_id.setAttribute('value', productId.trim());

        for (let i = 0; i < 3; i++) {
            modalImg[i].setAttribute('src', productImg[i].getAttribute('src'));
            dataThumb[i].setAttribute('data-thumb', productImg[i].getAttribute('src'));
            hrefData[i].setAttribute('href', productImg[i].getAttribute('src'));
            dotData[i].setAttribute('src', productImg[i].getAttribute('src'));
        }

    });
});

closeModal[0].addEventListener('click', () => {
    modal.classList.remove('show-modal1');
});
closeModal[1].addEventListener('click', () => {
    modal.classList.remove('show-modal1');
});