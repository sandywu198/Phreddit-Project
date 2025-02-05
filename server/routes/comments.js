const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');

// get all comments
router.get('/', async (req, res) => {
    try {
      const comments = await Comment.find();
      res.send(comments);
    } 
    catch (error) {
      res.status(500).send({message: 'Error retrieving comments', error });
    }
});

// get a specific comment
router.get('/:id', getComment, (req, res) => {
    res.send(res.comment);
});

// update existing comment
router.patch('/:id', getComment, async (req, res) => {
  const { content } = req.body;
  try {
    res.comment.content = content;
    const updatedComment = await res.comment.save(); 
    res.send(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete existing comment
router.delete('/:id', getComment, async (req, res) => {
  try {
    // if it's already been deleted, skip
    if(!res.comment){
      return res.send({message: "Comment does not exist"});
    }
    // delete if it exists
    console.log("\n delete req: ", req.params);
    await res.comment.deleteOne(); 
    res.send({ message: 'Comment has been deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// router.delete('/:id', getComment, async (req, res) => {
//   try {
//     console.log("\n delete req: ", req.params);
//     const result = await Comment.findByIdAndDelete(req.params.id); 
//     console.log("\n deleting: ", result);
//     res.send({ message: 'Comment has been deleted' });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// change the userVoted status
router.patch('/:id/:num/voted', getComment, async(req,res) =>{
  try{
    if(Number(req.params.num) === -2){
      res.comment.userVoted = 0;
      res.comment.upvotes = (res.comment.upvotes + 1);
      const updatedComment = await res.comment.save();
      res.send(updatedComment);
    } else if(Number(req.params.num) === 2){
      res.comment.userVoted = 0;
      res.comment.upvotes = (res.comment.upvotes - 1);
      const updatedComment = await res.comment.save();
      res.send(updatedComment);
    } else{
      res.comment.userVoted = Number(req.params.num);
      res.comment.upvotes = (res.comment.upvotes + Number(req.params.num));
      const updatedComment = await res.comment.save();
      res.send(updatedComment);
    }
  }
  catch(error){
      res.status(400).send({message: "Error updating vote status in comment", error});
  }
});

// create new comment
router.post('/', async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    commentedBy: req.body.commentedBy,
    commentedDate: Date.now(),
    upvotes: 0,
    userVoted:0,
  });
  console.log("\n comment: ", comment, "\n");
  try {
    const newComment = await comment.save();
    console.log("\n comment saved ok: ", comment, "\n");
    res.send(newComment);
  } 
  catch (error) {
    res.status(400).send({message: "Error creating new comment", error});
  }
});

// add reply to comment
router.put('/:id/replies', async (req, res) => {
  try {
    const commentId = req.params.id;
    console.log('REPLY comment ID:', commentId);
    console.log('Request body:', req.body);
    const reply = req.body.commentID;
    const updatedComment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      { $push: { commentIDs: reply} },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).send({ error: 'Comment not found' });
    }
    console.log('Comment updated with new comment');
    res.status(200).send(updatedComment);
  } 
  catch (error) {
    res.status(400).send({message: "Error creating new comment", error});
  }
});

// get replies for a specific comment
router.get('/:id/replies', getComment, async (req, res) => {
    try {
      const replies = await Comment.find({ _id: { $in: res.comment.commentIDs } });
      res.send(replies);
    } 
    catch (error) {
      res.status(500).send({message: "Error getting reply for this comment", error});
    }
});

// // get comment count
// router.get('/:id/replies/count', getComment, (req, res) => {
//   const count = res.post.commentIDs ? res.post.commentIDs.length : 0;
//   res.send({count: replyCount});
// });

// Middleware to get a comment by id
async function getComment(req, res, next) {
    try {
      const comment = await Comment.findById(req.params.id);
      // if (comment == null) {
      //   return res.status(404).send({ message: 'Comment not found'});
      // }
      res.comment = comment;
      next();
    } 
    catch (error) {
      return res.status(500).send({ message: error.message });
    }
}
  
module.exports = router;