const User = require("../models/user.model");

class UserService {
  async register(username, password, email, fullname) {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    // Create new user
    const user = new User({
      username,
      password,
      email,
      fullname,
    });

    await user.save();

    return {
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByIds(userIds) {
    const users = await User.find({ _id: { $in: userIds } }).select(
      "-password -refreshToken"
    );
    return users;
  }

  async updateProfile(userId, updateData) {
    // Remove undefined or null values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v != null)
    );

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: cleanUpdateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

module.exports = new UserService();
