require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Import Models & Middlewares
const { Product, Comment } = require("./models/productModel");
const { protect } = require("./middlewares/authMiddleware");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// --- 1. CONFIGURATION ---
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myBakery")
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// --- 2. AUTH VIEWS ---
app.get("/", (req, res) => res.redirect("/login-view"));
app.get("/login-view", (req, res) => res.render("auth/login"));
app.get("/register-view", (req, res) => res.render("auth/register"));

// --- 3. USER VIEWS ---
app.get("/profile", protect, (req, res) => {
  res.render("user/profile", { user: req.user });
});

// --- 4. PRODUCT VIEWS ---

// Danh sách sản phẩm (Cập nhật logic Lọc theo Giá)
app.get("/products-view", protect, async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let query = {};

    // 1. Lọc theo tên bánh
    if (search) query.name = { $regex: search, $options: "i" };

    // 2. Lọc theo loại bánh
    if (category) query.category = category;

    // 3. Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const data = await Product.find(query).sort({ createdAt: -1 });

    res.render("products/index", {
      products: data,
      user: req.user,
      query: req.query,
    });
  } catch (err) {
    res.status(500).send("Lỗi tải danh sách");
  }
});

app.get("/products/add", protect, (req, res) => {
  res.render("products/add", { user: req.user });
});

app.get("/products-view/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const comments = await Comment.find({ productId: req.params.id }).sort({
      createdAt: -1,
    });

    if (!product) return res.status(404).send("Sản phẩm không tồn tại");
    res.render("products/detail", { product, comments, user: req.user });
  } catch (err) {
    res.redirect("/products-view");
  }
});

app.get("/products/edit/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product, user: req.user });
  } catch (err) {
    res.redirect("/products-view");
  }
});

// --- 5. API ROUTES ---
app.use("/api", apiRoutes);

// --- 6. ERROR HANDLING ---
app.use((req, res) =>
  res.status(404).render("404", { user: req.user || null })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Lỗi hệ thống!");
});

// --- 7. START SERVER ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
