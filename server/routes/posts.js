const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const Comment = require('../models/comments');

// Get all posts
router.get('/', async (req, res) => {
    try {
      const posts = await Post.find();
      res.send(posts);
    } catch (error) {
      res.status(500).send({ message: "Error getting all posts", error });
    }
});

// Get a specific post
router.get('/:id', getPost, (req, res) => {
    res.send(res.post);
});

// Delete post by id
router.delete('/:id', getPost, async (req, res) => {
  try {
    // if it's already been deleted, skip
    if(!res.post){
      return res.send({message: "Post does not exist"});
    }
    // delete if it exists
    await res.post.deleteOne(); 
    res.send({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send({ message: error.message });
  }
});

// Delete posts by user
// router.delete('/:createdBy', async (req, res) => {
//   try {
//     const { createdBy } = req.params;
//     const result = await Post.deleteMany({ createdBy });
//     if (result.deletedCount === 0) {
//       return res.status(404).send({ message: 'No posts found to delete' });
//     }
//     res.status(200).send({ message: `${result.deletedCount} posts deleted successfully` });
//   } catch (error) {
//     console.error('Error deleting posts:', error);
//     res.status(500).send({ message: error.message });
//   }
// });

// Create a new post
router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        linkFlairID: req.body.linkFlairID,
        postedBy: req.body.postedBy,
        postedDate: Date.now(),
        views: 0,
        upvotes: req.body.upvotes,
    });
    try {
        const newPost = await post.save();
        res.status(201).send(newPost);
    } 
    catch (error) {
        res.status(400).send({ message: "Error creating post", error });
    }
});

// Get comments for post
router.get('/:id/comments', getPost, async (req, res) => {
    try {
      const comments = await Comment.find({ _id: { $in: res.post.commentIDs } });
      res.send(comments);
    } 
    catch (error) {
      res.status(500).send({ message: "Error getting comments", error });
    }
});

// remove comment from post
router.patch('/:id/comments/:commentId', getPost, async (req, res) => {
  try {
    const { commentId } = req.params;
    if(!res.post){
      res.send("Post doesn't exist, comment not removed");
      return; 
    }
    res.post.commentIDs.pull(commentId);
    await res.post.save();
    res.send(res.post);
  } catch (error) {
    console.error('Error removing comment:', error);
    res.status(500).send({ message: error.message });
  }
});

// Add comment to post
router.put('/:id/comments', async (req, res) => {
  console.log('POST request received for adding comment to post');
  try {
    const postId = req.params.id;
    console.log('Post ID:', postId);
    console.log('Request body:', req.body);
    const commentId = req.body.commentID;
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      { $push: { commentIDs: commentId} },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).send({ error: 'Post not found' });
    }
    console.log('Post updated with new comment');
    res.status(200).send(updatedPost);
  } catch (error) {
    console.error('Error in POST route:', error);
    res.status(400).send({ message: "Error adding comment to post", error: error.message });
  }
});

// increment view by 1
router.patch('/:id/view', getPost, async(req,res) =>{
    try{
        res.post.views += 1;
        const updatedPost = await res.post.save();
        res.send(updatedPost);
    }
    catch(error){
        res.status(400).send({message: "Error updating view count", error});
    }
});

// change the userVoted status
router.patch('/:id/:num/voted', getPost, async(req,res) =>{
  try{
    if(Number(req.params.num) === -2){
      res.post.userVoted = 0;
      res.post.upvotes = (res.post.upvotes + 1);
      const updatedPost = await res.post.save();
      res.send(updatedPost);
    } else if(Number(req.params.num) === 2){
      res.post.userVoted = 0;
      res.post.upvotes = (res.post.upvotes - 1);
      const updatedPost = await res.post.save();
      res.send(updatedPost);
    } else{
      res.post.userVoted = Number(req.params.num);
      res.post.upvotes = (res.post.upvotes + Number(req.params.num));
      const updatedPost = await res.post.save();
      res.send(updatedPost);
    }
  }
  catch(error){
      res.status(400).send({message: "Error updating vote status in post", error});
  }
});

// Middleware to get a post by ID
async function getPost(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);
      // if (post == null) {
      //   return res.status(404).send({ message: 'Post not found' });
      // }
      res.post = post;
      next();
    } 
    catch (error) {
      return res.status(500).send({ message: error.message });
    }
}
  
module.exports = router;