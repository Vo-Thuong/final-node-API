const express = require("express");
const router = express.Router();
const { Product, Comment } = require("../models/productModel");
const User = require("../models/userModel");
const { protect } = require("../middlewares/authMiddleware");

// --- 1. TRANG CHỦ & DANH SÁCH SẢN PHẨM ---
router.get("/products-view", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render("products/index", {
      products,
      user: req.user || null,
    });
  } catch (error) {
    res.status(500).send("Lỗi tải danh sách sản phẩm");
  }
});

// --- 2. TRANG CHI TIẾT SẢN PHẨM ---
router.get("/products-view/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Không tìm thấy bánh này");
    const comments = await Comment.find({ productId: req.params.id }).sort({
      createdAt: -1,
    });

    res.render("products/detail", {
      product,
      comments,
      user: req.user || null,
    });
  } catch (error) {
    res.status(500).send("Lỗi tải chi tiết sản phẩm");
  }
});

// --- 3. TRANG HỒ SƠ NGƯỜI DÙNG (PROFILE) ---
router.get("/profile", protect, async (req, res) => {
  try {
    res.render("user/profile", { user: req.user });
  } catch (error) {
    res.redirect("/login-view");
  }
});

// --- 4. CÁC TRANG AUTH (ĐĂNG NHẬP / ĐĂNG KÝ) ---
router.get("/login-view", (req, res) => {
  res.render("auth/login");
});

router.get("/register-view", (req, res) => {
  res.render("auth/register");
});

// --- 5. TRANG QUẢN TRỊ (ADD/EDIT SẢN PHẨM) ---
router.get("/products/add", protect, (req, res) => {
  res.render("products/add-form");
});

router.get("/products/edit-view/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/edit-form", { product });
  } catch (error) {
    res.redirect("/products-view");
  }
});

module.exports = router;
