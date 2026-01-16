document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = e.target.querySelector("button");
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorBox = document.getElementById("error-box");

      btn.disabled = true;
      btn.textContent = "Đang kiểm tra...";
      errorBox.style.display = "none";

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          document.cookie = `token=${data.token}; path=/; max-age=3600`;
          window.location.href = "/products-view";
        } else {
          errorBox.textContent = data.message || "Sai tài khoản hoặc mật khẩu";
          errorBox.style.display = "block";
          btn.disabled = false;
          btn.textContent = "Đăng nhập";
        }
      } catch (err) {
        console.error("Lỗi kết nối:", err);
        alert("Không thể kết nối đến máy chủ. Vui lòng thử lại!");
        btn.disabled = false;
        btn.textContent = "Đăng nhập";
      }
    });
  }
});
