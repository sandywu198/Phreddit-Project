const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server'); // for memory database instead of live one
const Post = require('./models/posts.js');
const Comment = require('./models/comments.js'); 

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri(); 
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  console.log("\n disconnected \n");
  await mongoServer.stop();
  console.log("\n stopped \n");
}, 10000);

describe('Deleting a post and every comment linked to the post', () => {
  var postId, commentId1, commentId2;

  beforeEach(async () => {
    const comment1 = new Comment({content: 'Test Comment 1', commentedBy: 'tester2', commentIDs: [], commentedDate: Date.now(), upvotes: 0, userVoted: 0});
    await comment1.save();
    const comment2 = new Comment({content: 'Test Comment 2', commentedBy: 'tester3', commentIDs: [comment1._id], commentedDate: Date.now(), upvotes: 0, userVoted: 0});
    await comment2.save();
    const post = new Post({title: 'Test Post', content: 'Post content', postedBy: 'tester1', commentIDs: [comment2._id], postedDate: Date.now(), views: 0, upvotes: 0});
    await post.save();
    commentId1 = comment1._id;
    commentId2 = comment2._id;
    postId = post._id;
  });

  test('Trying post and subcomments deletion', async () => {
    await deletePostAndComments(postId);
    const post = await Post.findById(postId);
    const firstComment = await Comment.findById(commentId1);
    const secondComment = await Comment.findById(commentId2);
    expect(post).toBeNull();
    expect(firstComment).toBeNull();
    expect(secondComment).toBeNull();
  });
});

async function deletePostAndComments(postId) {
  const post = await Post.findById(postId);
  for (const commentID of post.commentIDs) {
    await deleteCommentAndReplies(commentID);
  }
  await Post.findByIdAndDelete(postId);
}

async function deleteCommentAndReplies(commentId) {
  const comment = await Comment.findById(commentId);
  for (const subcommentID of comment.commentIDs) {
    await deleteCommentAndReplies(subcommentID);
  }
  await Comment.findByIdAndDelete(commentId);
}