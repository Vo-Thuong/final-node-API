const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SECRET_KEY = "MY_SUPER_SECRET_KEY";

const protect = async (req, res, next) => {
  let token = req.cookies.token;
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("Truy cập bị từ chối: Không tìm thấy token.");
    return res.redirect("/login-view");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      console.log("Người dùng không còn tồn tại trên hệ thống.");
      res.clearCookie("token");
      return res.redirect("/login-view");
    }

    req.user = currentUser;
    res.locals.user = currentUser;

    next();
  } catch (error) {
    console.log("Lỗi xác thực:", error.message);
    res.clearCookie("token");
    return res.redirect("/login-view");
  }
};

module.exports = { protect };
