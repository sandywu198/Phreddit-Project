/* server/init.JSON
** You must write a script that will create documents in your database according
** to the datamodel you have defined for the application.  Remember that you 
** must at least initialize an admin user account whose credentials are derived
** from command-line arguments passed to this script. But, you should also add
** some communities, posts, comments, and link-flairs to fill your application
** some initial content.  You can use the initializeDB.js script as inspiration, 
** but you cannot just copy and paste it--you script has to do more to handle
** users.
*/

// initializeDB.js - Will add initial application data to MongoDB database
// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument
// (e.g., mongodb://127.0.0.1:27017/fake_so)

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CommunityModel = require('./models/communities');
const PostModel = require('./models/posts');
const CommentModel = require('./models/comments');
const LinkFlairModel = require('./models/linkflairs');
const UserModel = require('./models/users');

let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let adminArgs = process.argv.slice(3, 6);
console.log("\n adminArgs: ", adminArgs, "\n");

let mongoDB = userArgs[0];
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function createUser(userObj) {
    try {
        const hashedPassword = await bcrypt.hash(userObj.password, 10);
        let newUserDoc = new UserModel({
            firstName: ("firstName" in userObj) ? userObj.firstName : "admin",
            lastName: ("lastName" in userObj) ? userObj.lastName : "admin",
            displayName: userObj.displayName,
            email: userObj.email,
            password: hashedPassword,
            reputation: ("reputation" in userObj) ? userObj.reputation : 100,
        });
        return await newUserDoc.save();
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

function createLinkFlair(linkFlairObj) {
    let newLinkFlairDoc = new LinkFlairModel({
        content: linkFlairObj.content,
    });
    return newLinkFlairDoc.save();
}

function createComment(commentObj) {
    let newCommentDoc = new CommentModel({
        content: commentObj.content,
        commentedBy: commentObj.commentedBy,
        commentedDate: commentObj.commentedDate,
        commentIDs: commentObj.commentIDs,
        upvotes: (commentObj.upvotes) ? commentObj.upvotes: 0,
    });
    return newCommentDoc.save();
}

function createPost(postObj) {
    let newPostDoc = new PostModel({
        title: postObj.title,
        content: postObj.content,
        postedBy: postObj.postedBy,
        postedDate: postObj.postedDate,
        views: postObj.views,
        linkFlairID: postObj.linkFlairID,
        commentIDs: postObj.commentIDs,
        upvotes: (postObj.upvotes) ? postObj.upvotes: 0,
    });
    return newPostDoc.save();
}

function createCommunity(communityObj) {
    let newCommunityDoc = new CommunityModel({
        name: communityObj.name,
        description: communityObj.description,
        postIDs: communityObj.postIDs,
        startDate: communityObj.startDate,
        members: communityObj.members,
        createdBy: communityObj.createdBy,
    });
    return newCommunityDoc.save();
}

async function initializeDB() {
    // admin user account
    const user1 = {
        firstName: 'admin',
        lastName: 'admin',
        displayName:  adminArgs[0],
        email: adminArgs[1],
        password: adminArgs[2],
        reputation: 1000,
    }
    const user2 = {
        firstName: 'big',
        lastName: 'feet',
        displayName:  'bigfeet',
        email: 'bigfeet@gmail.com',
        password: 'password',
    }
    const user3 = {
        firstName: 'marco',
        lastName: 'arelius',
        displayName:  'MarcoArelius',
        email: 'MarcoArelius@gmail.com',
        password: 'password',
    }
    const user4 = {
        firstName: 'truck',
        lastName: 'nutz',
        displayName:  'trucknutz69',
        email: 'trucknutz69@gmail.com',
        password: 'password',
        reputation: 50,
    }
    const user5 = {
        firstName: 'out',
        lastName: 'truth',
        displayName:  'outtheretruth47',
        email: 'outtheretruth47@gmail.com',
        password: 'password',
    }
    const user6 = {
        firstName: 'roll',
        lastName: 'o',
        displayName:  'rollo',
        email: 'rollo@gmail.com',
        password: 'password',
    }
    const user7 = {
        firstName: 'sheep',
        lastName: 'shemp',
        displayName:  'shemp',
        email: 'shemp@gmail.com',
        password: 'password',
    }
    const user8 = {
        firstName: 'cat',
        lastName: 'lady',
        displayName:  'catlady13',
        email: 'catlady13@gmail.com',
        password: 'password',
    }
    const user9 = {
        firstName: 'as',
        lastName: 'tyanax',
        displayName:  'astyanax',
        email: 'astyanax@gmail.com',
        password: 'password',
    }
    let userRef1 = await createUser(user1);
    let userRef2 = await createUser(user2);
    let userRef3 = await createUser(user3);
    let userRef4 = await createUser(user4);
    let userRef5 = await createUser(user5);
    let userRef6 = await createUser(user6);
    let userRef7 = await createUser(user7);
    let userRef8 = await createUser(user8);
    let userRef9 = await createUser(user9);

    // link flair objects
    const linkFlair1 = { // link flair 1
        linkFlairID: 'lf1',
        content: 'The jerkstore called...', 
    };
    const linkFlair2 = { //link flair 2
        linkFlairID: 'lf2',
        content: 'Literal Saint',
    };
    const linkFlair3 = { //link flair 3
        linkFlairID: 'lf3',
        content: 'They walk among us',
    };
    const linkFlair4 = { //link flair 4
        linkFlairID: 'lf4',
        content: 'Worse than Hitler',
    };
    let linkFlairRef1 = await createLinkFlair(linkFlair1);
    let linkFlairRef2 = await createLinkFlair(linkFlair2);
    let linkFlairRef3 = await createLinkFlair(linkFlair3);
    let linkFlairRef4 = await createLinkFlair(linkFlair4);
    
    // comment objects
    const comment9 = { // comment 9
        commentID: 'comment9',
        content: 'Hi comment',
        commentIDs: [],
        commentedBy: 'bigfeet',
        commentedDate: new Date('April 10, 2024 12:43:00'),
    };
    let commentRef9 = await createComment(comment9);

    const comment8 = { // comment 8
        commentID: 'comment8',
        content: 'Random comment',
        commentIDs: [],
        commentedBy: 'bigfeet',
        commentedDate: new Date('July 10, 2024 12:43:00'),
    };
    let commentRef8 = await createComment(comment8);

    const comment7 = { // comment 7
        commentID: 'comment7',
        content: 'Generic poster slogan #42',
        commentIDs: [],
        commentedBy: 'bigfeet',
        commentedDate: new Date('September 10, 2024 09:43:00'),
    };
    let commentRef7 = await createComment(comment7);
    
    const comment6 = { // comment 6
        commentID: 'comment6',
        content: 'I want to believe.',
        commentIDs: [commentRef7],
        commentedBy: 'outtheretruth47',
        commentedDate: new Date('September 10, 2024 07:18:00'),
    };
    let commentRef6 = await createComment(comment6);
    
    const comment5 = { // comment 5
        commentID: 'comment5',
        content: 'The same thing happened to me. I guest this channel does still show real history.',
        commentIDs: [],
        commentedBy: 'bigfeet',
        commentedDate: new Date('September 09, 2024 017:03:00'),
        upvotes: 3,
    }
    let commentRef5 = await createComment(comment5);
    
    const comment4 = { // comment 4
        commentID: 'comment4',
        content: 'The truth is out there.',
        commentIDs: [commentRef6],
        commentedBy: "astyanax",
        commentedDate: new Date('September 10, 2024 6:41:00'),
    };
    let commentRef4 = await createComment(comment4);
    
    const comment3 = { // comment 3
        commentID: 'comment3',
        content: 'My brother in Christ, are you ok? Also, YTJ.',
        commentIDs: [],
        commentedBy: 'rollo',
        commentedDate: new Date('August 23, 2024 09:31:00'),
        upvotes: 1,
    };
    let commentRef3 = await createComment(comment3);
    
    const comment2 = { // comment 2
        commentID: 'comment2',
        content: 'Obvious rage bait, but if not, then you are absolutely the jerk in this situation. Please delete your Tron vehicle and leave is in peace.  YTJ.',
        commentIDs: [],
        commentedBy: 'astyanax',
        commentedDate: new Date('August 23, 2024 10:57:00'),
    };
    let commentRef2 = await createComment(comment2);
    
    const comment1 = { // comment 1
        commentID: 'comment1',
        content: 'There is no higher calling than the protection of Tesla products.  God bless you sir and God bless Elon Musk. Oh, NTJ.',
        commentIDs: [commentRef3],
        commentedBy: 'shemp',
        commentedDate: new Date('August 23, 2024 08:22:00'),
        upvotes: 7,
    };
    let commentRef1 = await createComment(comment1);
    
    // post objects
    const post1 = { // post 1
        postID: 'p1',
        title: 'AITJ: I parked my cybertruck in the handicapped spot to protect it from bitter, jealous losers.',
        content: 'Recently I went to the store in my brand new Tesla cybertruck. I know there are lots of haters out there, so I wanted to make sure my truck was protected. So I parked it so it overlapped with two of those extra-wide handicapped spots.  When I came out of the store with my beef jerky some Karen in a wheelchair was screaming at me.  So tell me prhreddit, was I the jerk?',
        linkFlairID: linkFlairRef1,
        postedBy: 'trucknutz69',
        postedDate: new Date('August 23, 2024 01:19:00'),
        commentIDs: [commentRef1, commentRef2],
        views: 14,
        upvotes: 5,
    };
    const post2 = { // post 2
        postID: 'p2',
        title: "Remember when this was a HISTORY channel?",
        content: 'Does anyone else remember when they used to show actual historical content on this channel and not just an endless stream of alien encounters, conspiracy theories, and cryptozoology? I do.\n\nBut, I am pretty sure I was abducted last night just as described in that show from last week, "Finding the Alien Within".  Just thought I\'d let you all know.',
        linkFlairID: linkFlairRef3,
        postedBy: 'MarcoArelius',
        postedDate: new Date('September 9, 2024 14:24:00'),
        commentIDs: [commentRef4, commentRef5],
        views: 1023,
        upvotes: 20,
    };
    const post3 = { // post 3
        postID: 'p3',
        title: "Remember when this was a CS channel?",
        content: 'Does anyone else remember when they didn\'t have chatGPT?',
        linkFlairID: linkFlairRef2,
        postedBy: adminArgs[0],
        postedDate: new Date('November 9, 2024 4:24:00'),
        commentIDs: [commentRef8],
        views: 12345,
    };
    const post4 = { // post 4
        postID: 'p4',
        title: "Admin post",
        content: 'Title',
        linkFlairID: linkFlairRef2,
        postedBy: adminArgs[0],
        postedDate: new Date('November 19, 2024 4:24:00'),
        commentIDs: [],
        views: 0,
    };
    const post5 = { // post 5
        postID: 'p5',
        title: "MarcoArelius history",
        content: 'see title',
        linkFlairID: linkFlairRef4,
        postedBy: 'MarcoArelius',
        postedDate: new Date('November 19, 2024 4:24:00'),
        commentIDs: [commentRef9],
        views: 0,
    };
    let postRef1 = await createPost(post1);
    let postRef2 = await createPost(post2);
    let postRef3 = await createPost(post3);
    let postRef4 = await createPost(post4);
    let postRef5 = await createPost(post5);

    // community objects
    const community1 = {// community object 1
        communityID: 'community1',
        name: 'Am I the Jerk?',
        description: 'A practical application of the principles of justice.',
        postIDs: [postRef1],
        startDate: new Date('August 10, 2014 04:18:00'),
        members: ['rollo', 'shemp', 'catlady13', 'astyanax', 'trucknutz69', adminArgs[0]],
        createdBy: adminArgs[0],
        memberCount: 4,
    };
    const community2 = { // community object 2
        communityID: 'community2',
        name: 'The History Channel',
        description: 'A fantastical reimagining of our past and present.',
        postIDs: [postRef2, postRef3],
        startDate: new Date('May 4, 2017 08:32:00'),
        members: ['MarcoArelius', 'astyanax', 'outtheretruth47', 'bigfeet', adminArgs[0]],
        createdBy: 'bigfeet',
        memberCount: 4,
    };
    const community3 = { // community object 3
        communityID: 'community3',
        name: 'Admin Channel',
        description: 'Exclusive space for admin only.',
        postIDs: [postRef4],
        startDate: new Date('May 4, 2022 08:32:00'),
        members: [adminArgs[0]],
        createdBy: adminArgs[0],
        memberCount: 1,
    };
    const community4 = { // community object 4
        communityID: 'community4',
        name: 'MarcoArelius Community',
        description: 'MarcoArelius Space',
        postIDs: [postRef5],
        startDate: new Date('June 4, 2022 08:32:00'),
        members: ['MarcoArelius', adminArgs[0]],
        createdBy: 'MarcoArelius',
        memberCount: 2,
    };
    let communityRef1 = await createCommunity(community1);
    let communityRef2 = await createCommunity(community2);
    let communityRef3 = await createCommunity(community3);
    let communityRef4 = await createCommunity(community4);
    
    if (db) {
        db.close();
    }
    console.log("done");
}

initializeDB()
    .catch((err) => {
        console.log('ERROR: ' + err);
        console.trace();
        if (db) {
            db.close();
        }
    });

console.log('processing...');