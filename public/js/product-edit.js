document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.querySelector('input[name="image"]');
  const previewImg = document.querySelector(".current-img");
  const updateBtn = document.querySelector(".btn-update");
  const editForm = document.querySelector("form");

  if (fileInput && previewImg) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", () => {
      updateBtn.disabled = true;
      updateBtn.innerHTML =
        '<span class="loading-spinner"></span> Đang cập nhật...';
    });
  }
});
