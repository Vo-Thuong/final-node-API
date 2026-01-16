document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterForm");
  const productContainer = document.getElementById("product-list-container");
  const slider = document.getElementById("price-slider");

  // --- 1. HÀM VẼ LẠI GIAO DIỆN (RENDER) ---
  const renderProducts = (products) => {
    if (products.length === 0) {
      productContainer.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 50px;">
            <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
            <p>Không tìm thấy món bánh nào phù hợp với yêu cầu của bạn.</p>
            <a href="/products-view">Xem lại tất cả bánh</a>
        </div>`;
      return;
    }

    productContainer.innerHTML = products
      .map(
        (p, index) => `
      <div class="bakery-shop-card" style="opacity: 0; transform: translateY(20px);">
          <div class="bakery-shop-img-box">
              <span class="bakery-shop-badge">${p.category}</span>
              <img src="${p.image || "/uploads/default.png"}" alt="${
          p.name
        }" class="bakery-shop-img">
          </div>
          <div class="bakery-shop-body">
              <h3 class="bakery-shop-name">${p.name}</h3>
              <div class="bakery-shop-price">
                  ${
                    p.price ? p.price.toLocaleString("vi-VN") : 0
                  } <small>VNĐ</small>
              </div>
              <div class="bakery-shop-actions">
                  <a href="/products-view/${
                    p._id
                  }" class="bakery-shop-btn btn-view" title="Xem chi tiết">
                      <i class="bi bi-eye"></i>
                  </a>
                  <a href="/products/edit/${
                    p._id
                  }" class="bakery-shop-btn btn-edit" title="Chỉnh sửa">
                      <i class="bi bi-pencil"></i>
                  </a>
                  <a href="/api/products/delete/${
                    p._id
                  }" class="bakery-shop-btn btn-delete" title="Xóa">
                      <i class="bi bi-trash"></i>
                  </a>
              </div>
          </div>
      </div>
    `
      )
      .join("");

    const cards = productContainer.querySelectorAll(".bakery-shop-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
        card.style.transition = "all 0.4s ease-out";
      }, index * 50);
    });
  };

  // --- 2. HÀM GỌI API LỌC (FETCH) ---
  const fetchFilteredProducts = async () => {
    const formData = new FormData(filterForm);
    const params = new URLSearchParams(formData).toString();

    productContainer.style.opacity = "0.5";

    try {
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Lỗi mạng");
      const data = await response.json();
      renderProducts(data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      productContainer.innerHTML = "<p>Đã có lỗi xảy ra khi tải dữ liệu.</p>";
    } finally {
      productContainer.style.opacity = "1";
    }
  };

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchFilteredProducts();
  });

  if (slider) {
    const minInput = document.getElementById("minPrice");
    const maxInput = document.getElementById("maxPrice");
    const minLabel = document.getElementById("min-price-label");
    const maxLabel = document.getElementById("max-price-label");

    noUiSlider.create(slider, {
      start: [
        parseInt(minInput.value) || 0,
        parseInt(maxInput.value) || 500000,
      ],
      connect: true,
      step: 1000,
      range: { min: 0, max: 100000 },
      format: {
        to: (v) => Math.round(v),
        from: (v) => parseFloat(v),
      },
    });

    slider.noUiSlider.on("update", (values, handle) => {
      const val = values[handle];
      if (handle === 0) {
        minInput.value = val;
        minLabel.innerText = parseInt(val).toLocaleString("vi-VN") + "đ";
      } else {
        maxInput.value = val;
        maxLabel.innerText = parseInt(val).toLocaleString("vi-VN") + "đ";
      }
    });
    slider.noUiSlider.on("change", fetchFilteredProducts);
  }

  productContainer.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) {
      const isConfirmed = confirm(
        "Bạn có chắc chắn muốn xóa chiếc bánh thơm ngon này khỏi thực đơn không?"
      );
      if (!isConfirmed) {
        e.preventDefault();
      }
    }
  });

  const initialCards = document.querySelectorAll(".bakery-shop-card");
  initialCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
      card.style.transition = "all 0.5s ease-out";
    }, index * 80);
  });
});
