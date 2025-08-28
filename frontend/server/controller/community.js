const CommunityPost = require('../models/communityPost');
const { validationResult } = require('express-validator');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, tags } = req.body;
        const images = req.files ? req.files.map(file => file.path) : [];

        const post = new CommunityPost({
            userId: req.user.id,
            title,
            content,
            images,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all posts with pagination and filtering
exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const query = { status: 'active' };
        
        if (req.query.tag) {
            query.tags = req.query.tag;
        }
        
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const posts = await CommunityPost.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email profilePicture')
            .lean();

        const total = await CommunityPost.countDocuments(query);

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single post by ID
exports.getPost = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id)
            .populate('userId', 'name email profilePicture')
            .populate('comments.userId', 'name email profilePicture');
            
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        
        const post = await CommunityPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const comment = {
            userId: req.user.id,
            content
        };
        
        post.comments.push(comment);
        await post.save();
        
        // Populate the user details for the new comment
        await post.populate('comments.userId', 'name email profilePicture');
        const newComment = post.comments[post.comments.length - 1];
        
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Like/Unlike a post
exports.toggleLike = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);
        
        if (likeIndex === -1) {
            // Like the post
            post.likes.push(userId);
        } else {
            // Unlike the post
            post.likes.splice(likeIndex, 1);
        }
        
        await post.save();
        
        res.json({ 
            likes: post.likes.length,
            isLiked: post.likes.includes(userId)
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a post (soft delete)
exports.deletePost = async (req, res) => {
    try {
        const post = await CommunityPost.findOne({
            _id: req.params.postId,
            userId: req.user.id
        });
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }
        
        post.status = 'removed';
        await post.save();
        
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
