const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = {
  checkLogin: async function (req, res, next) {
    try {
      const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decoded = jwt.verify(token, "secret");
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  },
};
