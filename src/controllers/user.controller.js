const userService = require("../services/user.service");
const s3Service = require("../services/s3.service");

class UserController {
  async register(req, res) {
    try {
      const { username, password, email, fullname } = req.body;
      const user = await userService.register(username, password, email, fullname);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user._id;
      const user = await userService.getUserById(userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const { fullname, bio, link } = req.body;
      let avatarUrl = null;

      // Handle image upload if file exists
      if (req.file) {
        const file = req.file;
        const result = await s3Service.uploadImage(file);
        avatarUrl = result.Location;
      }


      // Update profile with new data
      const user = await userService.updateProfile(userId, {
        fullname,
        avatar: avatarUrl,
        bio,
        link
      });

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
