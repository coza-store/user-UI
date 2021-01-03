const listcm = document.getElementById('comment-list');
const template = document.getElementById('comment-template');
const prodId = document.querySelector('[name=productIdDetail]').value;
const length_comment = document.getElementsByClassName('comment-post');
let prev_icon = document.getElementById('prev_icon');
let prev_number = document.getElementById('prev_number');
let current_number = document.getElementById('current_number');
let next_number = document.getElementById('next_number');
let next_icon = document.getElementById('next_icon');

const changePage = async(btn) => {
    const page = btn.value;
    const fetchData = await fetch('/products/' + prodId + '/comment/' + page, {
            method: 'POST'
        })
        .then(result => {
            return result.json();
        })
        .then(data => {
            let run = length_comment.length - 1;
            for (let i = 0; i <= run; i++) {
                listcm.removeChild(listcm.children[0]);
            }
            for (let i = data.comments.length - 1; i >= 0; i--) {
                console.log(i);
                let newCommentHTML = template.innerHTML.replace('{{name}}', data.comments[i].name);
                newCommentHTML = newCommentHTML.replace('{{comment}}', data.comments[i].comment);
                let rating = `<i class="zmdi zmdi-star"></i>`;
                for (let j = 1; j < data.comments[i].rating; j++) {
                    rating += `<i class="zmdi zmdi-star"></i>`
                }
                newCommentHTML = newCommentHTML.replace('{{rating}}', rating);
                let newCommentNode = document.createElement('div');
                newCommentNode.classList.add('flex-w', 'flex-t', 'comment-post');
                newCommentNode.innerHTML = newCommentHTML;
                listcm.insertBefore(newCommentNode, listcm.firstChild);
            }
            prev_icon.value = data.prevPage;
            prev_number.value = data.prevPage;
            prev_number.innerText = data.prevPage;
            current_number.value = data.currentPage;
            current_number.innerText = data.currentPage;
            next_icon.value = data.nextPage;
            next_number.value = data.nextPage;
            next_number.innerText = data.nextPage;

            if (!data.hasPrevPage) {
                prev_icon.classList.add('dis-none');
                prev_number.classList.add('dis-none');
            } else {
                prev_icon.classList.remove('dis-none');
                prev_number.classList.remove('dis-none');
            }
            if (!data.hasNextPage) {
                next_icon.classList.add('dis-none');
                next_number.classList.add('dis-none');
            } else {
                next_icon.classList.remove('dis-none');
                next_number.classList.remove('dis-none');
            }

        })
        .catch(err => console.log(err));
}