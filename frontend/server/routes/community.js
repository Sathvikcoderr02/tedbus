const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const communityController = require('../controller/community');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST api/community/posts
// @desc    Create a new post
// @access  Private
router.post(
  '/posts',
  [
    auth,
    upload.array('images', 5), // Allow up to 5 images per post
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
    ],
  ],
  communityController.createPost
);

// @route   GET api/community/posts
// @desc    Get all posts with pagination
// @access  Public
router.get('/posts', communityController.getPosts);

// @route   GET api/community/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/posts/:id', communityController.getPost);

// @route   POST api/community/posts/:postId/comments
// @desc    Add comment to a post
// @access  Private
router.post(
  '/posts/:postId/comments',
  [auth, [check('content', 'Comment content is required').not().isEmpty()]],
  communityController.addComment
);

// @route   POST api/community/posts/:postId/like
// @desc    Like/Unlike a post
// @access  Private
router.post('/posts/:postId/like', auth, communityController.toggleLike);

// @route   DELETE api/community/posts/:postId
// @desc    Delete a post
// @access  Private
router.delete('/posts/:postId', auth, communityController.deletePost);

module.exports = router;
