const userService = require("../services/user.service");

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
      const userId = req.user.userId;
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
}

module.exports = new UserController();
