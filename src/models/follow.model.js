const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new Schema(
    {
        follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },   // Người theo dõi
        following: { type: Schema.Types.ObjectId, ref: 'User', required: true }   // Người được theo dõi
    },
    { timestamps: true }
);

FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Follow', FollowSchema);