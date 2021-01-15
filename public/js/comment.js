(function() {
    Pusher.logToConsole = true;

    const serverUrl = "/",
        comments = [],
        pusher = new Pusher('a050f5822d5da15b38a1', {
            cluster: 'ap1',
            encrypted: true
        }),
        // Subscribing to the 'flash-comments' Channel
        channel = pusher.subscribe('real-time-comment');


    const commentForm = document.getElementById('comment-form');


    commentForm.addEventListener("submit", addNewComment);
    const user_image = document.querySelector('[name=userImage]');

    function addNewComment(event) {
        event.preventDefault();
        let image;
        if (user_image == null || user_image.value == "") {
            image = '/images/user/guest-user.jpg';
        } else {
            image = user_image.value;
        }
        var newComment = {
            "productId": document.querySelector('[name=productIdDetail]').value,
            "name": document.getElementById('name').value,
            "email": document.getElementById('email').value,
            "userImage": image,
            "comment": document.getElementById('review').value,
            "rating": document.getElementById('rating').value
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://cozafashion.herokuapp.com/" + "comment", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4 || xhr.status != 200) return;

            // On Success of creating a new Comment
            console.log("Success: " + xhr.responseText);
            commentForm.reset();
        };
        xhr.send(JSON.stringify(newComment));
    }

    const commentList = document.getElementById('comment-list');
    const commentTemplate = document.getElementById('comment-template');
    const clear_notice = document.getElementById('no_products');
    const paging_sec = document.getElementById('pagination-comment');
    const totalComment = document.getElementById('total_comment');
    let current_page = document.getElementById('current_number');
    channel.bind('new_comment', newCommentHandler);

    async function newCommentHandler(data) {
        const productPathId = window.location.href.split('/')[4];
        if (productPathId === data.productId) {
            if (current_page.value == 1) {
                let newCommentHTML = commentTemplate.innerHTML.replace('{{name}}', data.name);
                newCommentHTML = newCommentHTML.replace('{{comment}}', data.comment);
                if (data.purchaseConfirm == true) {
                    newCommentHTML = newCommentHTML.replace('{{purchase}}', "Purchase Confirm");
                } else {
                    newCommentHTML = newCommentHTML.replace('{{purchase}}', "");

                }
                let rating = `<i class="zmdi zmdi-star"></i> `;
                for (let i = 1; i < data.rating; i++) {
                    rating += `<i class="zmdi zmdi-star"></i> `
                }
                newCommentHTML = newCommentHTML.replace('{{rating}}', rating);
                newCommentHTML = newCommentHTML.replace('{{image}}', data.userImage);
                let newCommentNode = document.createElement('div');
                newCommentNode.classList.add('flex-w', 'flex-t', 'comment-post');
                newCommentNode.innerHTML = newCommentHTML;
                if (clear_notice) {
                    clear_notice.innerHTML = "";
                    paging_sec.classList.remove('dis-none');
                }
                totalComment.innerText = +totalComment.innerText + +1;
                commentList.insertBefore(newCommentNode, commentList.firstChild);
                if (commentList.childElementCount - 2 > 4) {
                    commentList.removeChild(commentList.children[commentList.childElementCount - 3]);
                }
            } else {
                const btn = { value: 1 };
                changePage(btn, 1);
            }
        }
    }

})();

const getRating = (btn) => {
    const rating = document.getElementById('rating');
    rating.value = btn.value
}