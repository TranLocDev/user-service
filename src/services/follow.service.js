const followModel = require("../models/follow.model");


class FollowService {
    // ----------------FOLLOW USER----------------

    async checkFollow(followerId, followingId) {
        return await followModel.exists({ follower: followerId, following: followingId });
    }

    async followUser(followerId, followingId) {
        if (followerId === followingId) throw new Error("Cannot follow yourself");
        return await followModel.create({ follower: followerId, following: followingId });
    }

    async unfollowUser(followerId, followingId) {
        return await followModel.findOneAndDelete({ follower: followerId, following: followingId });
    }

    async getFollowers(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        let result = await followModel.find({ following: userId })
            .skip(skip).limit(limit)
            .populate('follower', '_id fullname avatar isActive')
            .select("follower")
            .lean();
        return result.map(item => item.follower);
    };


};

module.exports = new FollowService();
