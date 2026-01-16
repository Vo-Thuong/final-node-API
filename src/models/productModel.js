const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    username: { type: String, default: "Khách ẩn danh" },
    userAvatar: { type: String, default: "/uploads/default-avatar.png" },
    content: {
      type: String,
      required: [true, "Nội dung bình luận không được để trống"],
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá không được nhỏ hơn 0"],
    },
    image: {
      type: String,
      default: "/uploads/default.png",
    },
    category: {
      type: String,
      required: [true, "Vui lòng chọn phân loại sản phẩm"],
      enum: ["Bánh ngọt", "Bánh mì", "Bánh kem", "Đồ uống", "Khác"],
    },
    description: {
      type: String,
      default: "Hương vị thơm ngon khó cưỡng từ MyBakery.",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const Comment = mongoose.model("Comment", commentSchema);

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({ name: String }, { timestamps: true })
);

module.exports = { Product, Comment, Category };
