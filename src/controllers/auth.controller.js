const authService = require('../services/auth.service');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      console.log('Logout request received');
      console.log('Request headers:', req.headers);
      console.log('User from request:', req.user);

      // Check if user information exists
      if (!req.user) {
        console.log('No user information in request');
        return res.status(401).json({
          success: false,
          message: 'No user information found'
        });
      }

      // Check if userId exists
      if (!req.user.userId) {
        console.log('No userId in user information');
        return res.status(401).json({
          success: false,
          message: 'Invalid user information'
        });
      }

      const userId = req.user.userId;
      console.log('Attempting to logout user:', userId);

      // Perform logout
      await authService.logout(userId);
      console.log('Logout successful for user:', userId);
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Logout failed'
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController(); 