PHREDDIT PROJECT
# Term Project

See the three UML design docs in *images/*

## Instructions to setup and run project

1) Ensure you have installed MongoDB and the MongoDB Shell (mongosh). If you have not already done so, follow this link: `https://docs.mongodb.com/manual/administration/install-community/`.

2) Download or clone the repository.

3) Open the Command Prompt or Powershell on your laptop.

4) Go into the directory where the repository is located. (i.e. use `cd file/path`)

5) When the current directory is the entire project folder, run the command: `npm install`.

6) Then move into the server folder of the repository. (i.e. use `cd file/path/server`).

7) In the server folder, run the following commands to install the necessary packages:
- `npm install`
- `npm install mongoose`
- `npm install bcrypt`
- `npm install validator`
- `npm install js-cookie`
- `npm install jsonwebtoken`
- `npm install express-session`
- `npm install jest`

8) Now go to the client folder of the repository (i.e. use `cd file/path/client`).

9) In the client folder, run the command: `npm install`.

10) Once all the package installations are complete, go back to the repository directory. (i.e. use `cd file/path`)

11) Run the command `mongod`. Wait until the code in the Command Prompt/Powershell stops.

12) Open another Command Prompt/Powershell tab. Go to the repository directory. (i.e. use `cd file/path`)

13) Run the command `mongosh`. (If the error `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017` appears, check that mongod is finished running in the previous Command Prompt/Powershell tab)

14) Open another Command Prompt/Powershell tab. Then move into the server folder of the repository. (i.e. use `cd file/path/server`).

15) Decide what name, email, and password to use for the admin user account. 

16) Then run the command: `node init.js mongodb://127.0.0.1:27017/phreddit <admin-name> <admin-email> <admin password>`
- Fill in the fields `<admin-name>, <admin-email>, and <admin password>` with the name, email, and password from step 14, respectively.

17) Next, in the same Command Prompt/Powershell tab, run the command: `node server.js mongodb://127.0.0.1:27017/phreddit`

18) Open another Command Prompt/Powershell tab. Then move into the client folder of the repository. (i.e. use `cd file/path/client`).

19) Run the command: `npm start`

20) Open a Google Chrome tab and go to `http://localhost:3000/` to see the Phreddit website. The admin user account will have been automatically initialized, along with other users, posts, comments, and communities.

21) To see the server side data, go to `http://localhost:8000/`
- The users page is `http://localhost:8000/users`
- The communities page is `http://localhost:8000/communities`
- The comments page is `http://localhost:8000/comments`
- The posts page is `http://localhost:8000/posts`
- The linkflairs page is `http://localhost:8000/linkflairs`


## To Run Jest Tests

1) Open a Command Prompt/Powershell tab.
2) Go to the client folder of the repository (i.e. use `cd file/path/client`).
3) Run the command `npm test`. This will return the one `react.test.js` on the client side.
4) Go to all of the Command Prompt/Powershell tabs you have open for running the server or the MongoDB database and run Ctrl + C to close the server and database. Ensure they are closed before proceeding. 
4) Open another Command Prompt/Powershell tab.
5) Go to the client folder of the repository (i.e. use `cd file/path/server`).
6) Run `npm install mongodb-memory-server`.
7) Run the command `npm test`. This will return the two Jest tests on the server side.
Note: If you get an error stating server in use, return to step 4 and make sure you have the server and database closed. If they are running, it will prevent the test from executing properly.
