document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.querySelector('input[name="image"]');
  const previewContainer = document.createElement("img");
  previewContainer.id = "image-preview";

  imageInput.parentNode.insertBefore(previewContainer, imageInput);

  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewContainer.src = e.target.result;
        previewContainer.style.display = "block";
      };

      reader.readAsDataURL(file);
    } else {
      previewContainer.style.display = "none";
    }
  });

  const form = document.querySelector("form");
  form.addEventListener("submit", () => {
    const btnSave = document.querySelector(".btn-save");
    btnSave.disabled = true;
    btnSave.textContent = "Đang tải lên...";
  });
});
