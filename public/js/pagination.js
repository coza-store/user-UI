const form_page = document.getElementById('paging-form');

const pageBody = document.getElementById('pageBody');
const getPage = (btn, e) => {
    e.preventDefault();
    pageBody.value = btn.value;
    console.log(pageBody.value);
    form_page.submit();
}