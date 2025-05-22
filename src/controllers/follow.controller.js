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
                return res.json({ success: true, message: "Unfollowed successfully", followed: false, following: userId });
            } else {
                await followService.followUser(followerId, userId);
                return res.json({ success: true, message: "Followed successfully", followed: true, following: userId });
            }
        } catch (error) {
            next(error);
        }
    }

    async getFollowers(req, res, next) {
        try {
            const { userId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const followers = await followService.getFollowers(userId, page, limit);
            res.json({ data: followers, success: true });
        } catch (error) {
            next(error);
        }
    }



}

module.exports = new followController();
