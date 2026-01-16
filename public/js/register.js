document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const submitBtn = e.target.querySelector("button");

      const errorBox = document.getElementById("error-box");
      const successBox = document.getElementById("success-box");

      errorBox.style.display = "none";
      successBox.style.display = "none";

      if (password !== confirmPassword) {
        errorBox.textContent = "Mật khẩu xác nhận không khớp!";
        errorBox.style.display = "block";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm"></span> Đang tạo tài khoản...';

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          successBox.style.display = "block";
          setTimeout(() => {
            window.location.href = "/login-view";
          }, 2000);
        } else {
          errorBox.textContent =
            data.message || "Đăng ký thất bại, vui lòng thử lại";
          errorBox.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.textContent = "Tạo tài khoản";
        }
      } catch (err) {
        console.error("Lỗi kết nối:", err);
        errorBox.textContent = "Không thể kết nối đến máy chủ!";
        errorBox.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "Tạo tài khoản";
      }
    });
  }
});
