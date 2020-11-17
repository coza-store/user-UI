const modal = document.querySelector('.js-modal1');
const closeModal = document.querySelectorAll('.js-hide-modal1');

//modal data
const name = document.querySelector('.detail__name');
const price = document.querySelector('.detail__price');
const description = document.querySelector('.detail_description');
const modalImg = document.querySelector('.modal_img');

const productList = document.querySelectorAll('.product-list');

productList.forEach((product, index) => {
    const quickView = product.querySelector('.js-show-modal1');

    const productImg = product.querySelector('.product__img').getAttribute('src');
    const productName = product.querySelector('.product__name').innerText;
    const productPrice = product.querySelector('.product__price').innerText;

    quickView.addEventListener('click', () => {
        modal.classList.add('show-modal1');
        name.innerText = productName;
        price.innerText = productPrice;
        modalImg.setAttribute('src', productImg);
    });


});

closeModal[0].addEventListener('click', () => {
    modal.classList.remove('show-modal1');
});
closeModal[1].addEventListener('click', () => {
    modal.classList.remove('show-modal1');
})