const User = require("../models/user.model");

exports.getUserById = async (id) => {
  return await User.findById(id);
};
