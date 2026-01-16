const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Product, Comment } = require("../models/productModel");
const User = require("../models/userModel");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// --- 1. CẤU HÌNH MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// --- 2. AUTH API ---
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login-view");
});

// --- 3. PRODUCT API (DÀNH CHO AJAX/FETCH) ---

/**
 * @route   GET /api/products
 * @desc    Lấy danh sách sản phẩm có bộ lọc (JSON)
 * @access  Protect
 */
router.get("/products", protect, async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let query = {};

    // Lọc theo tên
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Lọc theo danh mục
    if (category) {
      query.category = category;
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // Trả về dữ liệu dạng JSON cho Frontend xử lý
    res.json(products);
  } catch (error) {
    console.error("Lỗi lấy API sản phẩm:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi lấy dữ liệu" });
  }
});

// --- 4. PROFILE API ---
router.post(
  "/profile/update",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { username } = req.body;
      const updateData = { username };

      if (req.file) {
        updateData.avatar = `/uploads/${req.file.filename}`;
        if (
          req.user.avatar &&
          !req.user.avatar.includes("default-avatar.png")
        ) {
          const oldPath = path.join(__dirname, "../../public", req.user.avatar);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      await User.findByIdAndUpdate(req.user._id, updateData);
      res.redirect("/profile");
    } catch (error) {
      res.status(500).send("Không thể cập nhật hồ sơ");
    }
  }
);

// --- 5. PRODUCT CRUD API ---

// Thêm sản phẩm
router.post(
  "/products/form",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, category, description } = req.body;
      const imagePath = req.file
        ? `/uploads/${req.file.filename}`
        : "/uploads/default.png";

      await Product.create({
        name,
        price: Number(price),
        category,
        description,
        image: imagePath,
      });
      res.redirect("/products-view");
    } catch (error) {
      res.status(500).send("Lỗi khi thêm sản phẩm");
    }
  }
);

// Chỉnh sửa sản phẩm
router.post(
  "/products/edit/:id",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      const updateData = {
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category,
        description: req.body.description,
      };

      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
        if (product.image && product.image !== "/uploads/default.png") {
          const oldImagePath = path.join(
            __dirname,
            "../../public",
            product.image
          );
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
      }

      await Product.findByIdAndUpdate(id, updateData);
      res.redirect("/products-view");
    } catch (error) {
      res.status(500).send("Lỗi khi cập nhật");
    }
  }
);

// Xóa sản phẩm
router.get("/products/delete/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product && product.image && product.image !== "/uploads/default.png") {
      const absolutePath = path.join(__dirname, "../../public", product.image);
      if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products-view");
  } catch (error) {
    res.status(500).send("Lỗi khi xóa sản phẩm");
  }
});

// COMMENT API
router.post("/comments/product/:id", protect, async (req, res) => {
  try {
    await Comment.create({
      productId: req.params.id,
      content: req.body.content,
      username: req.user.username || "Thợ bánh ẩn danh",
      userAvatar: req.user.avatar || "/uploads/default-avatar.png",
    });
    res.redirect("/products-view/" + req.params.id);
  } catch (error) {
    res.status(500).send("Lỗi gửi bình luận");
  }
});

module.exports = router;
