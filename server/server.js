// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const session = require('express-session');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, 
  }));

app.use(session({
  secret: 'CSE_316_Phreddit_key', 
  resave: false,             
  saveUninitialized: true,  
  cookie: {
    httpOnly: true,         
    secure: false,
    maxAge: 604800000,       // 7 days
    // sameSite: 'None',       
  },
}));

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/phreddit');
  // .then(() => console.log('Connected to MongoDB'))
  // .catch(err => console.error('MongoDB connection error:', err));

const communityRoutes = require('./routes/communities');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const linkflairRoutes = require('./routes/linkflairs');
const usersRouter = require('./routes/users'); 

app.use('/users', usersRouter);
app.use('/communities', communityRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/linkflairs', linkflairRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Phreddit API! Use /communities to get the list of communities.');
});

const port = 8000;
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Server closed. Database instance disconnected.');
    process.exit(0);
});

module.exports = server;

// app.get("/communities", async (req, res) => {
//     try{
//         console.log("starting community send\n");
//         const communityData = await CommunityModel.find();
//         res.send(communityData);
//         console.log(`hi, sent ${communityData}`);
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });

// app.get("/posts", async (req, res) => {
//     try{
//         const postData = await PostModel.find();
//         res.send(postData);
//         console.log(`hi, sent ${postData}`);
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });

// // add the comment id to the associated post
// app.post("/addpostcomment", async (req, res) => {
//     try{
//         await PostModel.updateOne({postID: req.body.postID}, {$push:{commentIDs: req.body.commentID}});
//         /* req.body has the form below 
//         {    postID = post.postID;
//             commentID = newComment.commentID; 
//         } 
//         */
//         console.log("\n updated the post with a new comment! \n");
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });

// // add the comment id to the associated comment
// app.post("/addsubcomment", async (req, res) => {
//     try{
//         await CommentModel.updateOne({commentID: req.body.commentID}, {$push:{commentIDs: req.body.newCommentID}});
//         /* req.body has the form below 
//         {   commentID = commentRepliedTo.commentID;
//             newCommentID = newComment.commentID;
//         } 
//         */
//         console.log("\n updated the comment with a new subcomment! \n");
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });

// // add the new community to the data
// app.post("/addcommunity", async (req, res) => {
//     try{
//         let newCommunityDoc = new CommunityModel(req.body);
//         let saved = await newCommunityDoc.save();
//         console.log("\n new community saved\n");
//         return saved;
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });

// // add the new link flair to the data
// app.post("/addlinkflair", async (req, res) => {
//     try{
//         let newLinkFlairDoc = new LinkFlairModel(req.body);
//         return newLinkFlairDoc.save();
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });

// // add the new post to the data
// app.post("/addpost", async (req, res) => {
//     try{
//         let newPostDoc = new PostModel(req.body);
//         return newPostDoc.save();
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });

// // add the community with the id of the new post in the community
// app.post("/updatecommunityposts", async (req, res) => {
//     try{
//         await CommunityModel.updateOne({commentID: req.body.commentID}, {$push:{commentIDs: req.body.newCommentID}});
//         console.log("\n updated the community with a new post! \n");
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });


// app.get("/linkFlairs", async (req, res) => {
//     try{
//         const linkFlairData = await LinkFlairModel.find();
//         res.send(linkFlairData);
//         console.log(`hi, sent ${linkFlairData}`);
//     } catch (error) {
//         console.log(`hi, error ${error}`);
//     }
// });

// app.get("/", async (req, res) => {
//     try{    
//         const allData = [];
//         const communityData = await communityRoutes.find();
//         allData.push(communityData);
//         const postData = await postRoutes.find();
//         allData.push(postData);
//         const commentData = await commentRoutes.find();
//         allData.push(commentData);
//         const linkFlairData = await linkFlairData.find();
//         allData.push(linkFlairData);
//         res.send(`Hi! Data: ${allData}`);
//     } catch (error){
//         console.log(`hi, error ${error}`);
//     }
// });