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


};

module.exports = new FollowService();
