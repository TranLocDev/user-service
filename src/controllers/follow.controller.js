const User = require("../models/user.model");
const followService = require("../services/follow.service");

class followController {
    // ----------------FOLLOW USER----------------

    async toggleFollow(req, res, next) {
        try {
            const followerId = req.user._id;
            const { userId } = req.body;

            if (followerId === userId) {
                return res.status(400).json({ success: false, message: "Cannot follow yourself" });
            }

            const isFollowing = await followService.checkFollow(followerId, userId);

            if (isFollowing) {
                await followService.unfollowUser(followerId, userId);
                return res.json({ success: true, message: "Unfollowed successfully", followed: false });
            } else {
                await followService.followUser(followerId, userId);
                return res.json({ success: true, message: "Followed successfully", followed: true });
            }
        } catch (error) {
            next(error);
        }
    }



}

module.exports = new followController();
