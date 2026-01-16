const { comments } = require("../models/productModel");

exports.getCommentsByProduct = (req, res) => {
  const productId = parseInt(req.params.id);
  const result = comments.filter((c) => c.productId === productId);
  res.json(result);
};

exports.addComment = (req, res) => {
  const productId = parseInt(req.params.id);
  const { content } = req.body;
  const newComment = { id: comments.length + 1, productId, content };
  comments.push(newComment);
  res.status(201).json({ message: "Đã thêm bình luận", data: newComment });
};
