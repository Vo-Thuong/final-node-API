const { products, comments } = require("../models/productModel");

// 1. Lấy danh sách + Filter + Phân trang
exports.getAllProducts = (req, res) => {
  let { search, category, page, limit } = req.query;
  let filtered = [...products];

  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 5;
  const startIndex = (p - 1) * l;
  const result = filtered.slice(startIndex, startIndex + l);

  res.json({ total: filtered.length, page: p, limit: l, data: result });
};

// 2. Chi tiết sản phẩm kèm comments
exports.getProductDetail = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

  const productComments = comments.filter((c) => c.productId === id);
  res.json({ ...product, comments: productComments });
};

// 3. Thêm sản phẩm
exports.createProduct = (req, res) => {
  const { name, price, category } = req.body;
  const newProduct = { id: products.length + 1, name, price, category };
  products.push(newProduct);
  res.status(201).json({ message: "Đã thêm sản phẩm", data: newProduct });
};

// 4. Sửa sản phẩm
exports.updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Không tìm thấy" });

  products[index] = { ...products[index], ...req.body };
  res.json({ message: "Đã cập nhật", data: products[index] });
};
