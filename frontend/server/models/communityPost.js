const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'reported', 'removed'],
        default: 'active'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
communityPostSchema.index({ userId: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ status: 1, createdAt: -1 });

// Virtual for comment count
communityPostSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

// Virtual for like count
communityPostSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

module.exports = CommunityPost;
