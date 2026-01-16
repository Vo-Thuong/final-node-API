function previewImage(input) {
  const preview = document.getElementById("avatarPreview");

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.opacity = "0.5";
      setTimeout(() => {
        preview.style.opacity = "1";
      }, 100);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

document.querySelector("form").addEventListener("submit", function () {
  const btn = this.querySelector("button");
  btn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2"></span> Đang lưu...';
});
