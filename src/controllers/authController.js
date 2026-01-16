const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "MY_SUPER_SECRET_KEY";

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Kiểm tra xem email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email đã được đăng ký" });
    }

    // 2. Mã hóa mật khẩu
    const hash = await bcrypt.hash(password, 10);

    // 3. Lưu vào MongoDB
    await User.create({
      username,
      email,
      password: hash,
    });

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi đăng ký" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập" });
  }
};
