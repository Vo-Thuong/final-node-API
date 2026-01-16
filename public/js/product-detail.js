document.addEventListener("DOMContentLoaded", () => {
  const commentForm = document.querySelector(".bakery-comment-form form");
  const submitBtn = document.querySelector(".bakery-comment-submit");

  if (commentForm) {
    commentForm.addEventListener("submit", () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Đang gửi cảm nhận...";
    });
  }
});
