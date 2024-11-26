[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/MVUO33FO)
# Term Project

Add design docs in *images/*

## Instructions to setup and run project
Clearly explain the steps required to install and configure necessary packages, for both the server and the client, and the sequence of steps required to get your application running.

1) Download or clone the repository.

2) Open the Command Prompt or Powershell on your laptop.

3) Go into the directory where the repository is located. (i.e. use `cd file/path`)

4) When the current directory is the entire project folder, run the command: `npm install`.

5) Then move into the server folder of the repository. (i.e. use `cd file/path/server`).

6) In the server folder, run the following commands to install the necessary packages:
- `npm install`
- `npm install bcrypt`
- `npm install validator`
- `npm install js-cookie`
- `npm install jsonwebtoken`
- `npm install express-session`
- `npm install jest`

7) Now go to the client folder of the repository (i.e. use `cd file/path/client`).

8) In the client folder, run the command: `npm install`.

9) Once all the package installations are complete, go back to the repository directory. (i.e. use `cd file/path`)

10) Run the command `mongod`. Wait until the code in the Command Prompt/Powershell stops.

11) Open another Command Prompt/Powershell tab. Go to the repository directory. (i.e. use `cd file/path`)

12) Run the command `mongosh`. (If the error `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017` appears, check that mongod is finished running in the previous Command Prompt/Powershell tab)

13) Open another Command Prompt/Powershell tab. Then move into the server folder of the repository. (i.e. use `cd file/path/server`).

14) Decide what name, email, and password to use for the admin user account. 

15) Then run the command: `node init.js mongodb://127.0.0.1:27017/phreddit <admin-name> <admin-email> <admin password>`
- Fill in the fields `<admin-name>, <admin-email>, and <admin password>` with the name, email, and password from step 14, respectively.

16) Next, in the same Command Prompt/Powershell tab, run the command: `node server.js mongodb://127.0.0.1:27017/phreddit`

17) Open another Command Prompt/Powershell tab. Then move into the client folder of the repository. (i.e. use `cd file/path/client`).

18) Run the command: `npm start`

19) Open a Google Chrome tab and go to `http://localhost:3000/` to see the Phreddit website. The admin user account will have been automatically initialized, along with other users, posts, comments, and communities.

20) To see the server side data, go to `http://localhost:8000/`
- The users page is `http://localhost:8000/users`
- The communities page is `http://localhost:8000/communities`
- The comments page is `http://localhost:8000/comments`
- The posts page is `http://localhost:8000/posts`
- The linkflairs page is `http://localhost:8000/linkflairs`



In the sections below, list and describe each contribution briefly.

## Team Member 1 (Sandy Wu) Contribution
- Added join/leave community functionality
- Implemented sorting separated by communities joined and communities not joined on main page
- Implemented post sorting by membership in community for search results page
- Fixed upvote and downvote for posts, and the login return session
- Applied CSS styling to the Welcome page

## Team Member 2 (Ashley Wu) Contribution
- Created Welcome page with register/login/guest options
- Added session cookie for maintaining login
- Implemented user profile page with deletion options
- Added upvotes for posts and use reputation changes
- Ordered navbar from joined and then not joined communities

