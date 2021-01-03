const getRating = (btn) => {
    const rating = document.getElementById('rating');
    rating.value = btn.value
}
const addComment = (btn) => {
    const user_name = btn.parentNode.querySelector('[name=name]').value;
    const user_email = btn.parentNode.querySelector('[name=email]').value;
    const user_review = document.getElementById('review').innerText;
    const user_rating = btn.parentNode.querySelector('[name=rating]').value;

    console.log(user_name, user_email, user_review, user_rating);
}