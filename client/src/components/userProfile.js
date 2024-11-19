import React, {useEffect, useState} from "react";
import {displayTime, postThreadDFS} from "./postThreading.js";
import EventEmitter from "events";
import {communityClickedEmitter, CreateCommunityComponent} from "./newCommunity.js";
import {CreatePostComponent, CreatePostButtonColorEmitter, CreatePostButton} from "./newPost.js";
import {WelcomePage} from "./welcomePage.js";
import {NavBarEmitter} from "./navBar.js";
import {CreatePostsInHTML, GetPostThreadsArrayFunction, GetCommentThreadsArrayFunction} from "./postSortingFunctions.js";
import axios from 'axios';

export const UserProfile = ({user, admin}) => {
    console.log("\n user profile: ", user, " admin: ", admin, "\n");
    const [content, setContent] = useState(null);
    useEffect(() => {
        axios.get("http://localhost:8000/posts").then(postsRes => {
            axios.get("http://localhost:8000/communities").then(communitiesRes => {
              axios.get("http://localhost:8000/comments").then(commentsRes => {
                axios.get("http://localhost:8000/users").then(usersRes => {
                    axios.get(`http://localhost:8000/users/admin/firstName`).then(adminRes => {
                        console.log("\n user: ", user, " admin: ", admin, "\n");
                        setContent(<>
                            {admin && user.displayName !== "admin" && <button id="return-admin"
                            onClick={() => 
                            {communityClickedEmitter.emit('communityClicked', -8, "", null, true, null, adminRes.data, true);}}>
                                Return to Admin Profile</button>}
                            <h2>Display Name: {user.displayName}</h2>
                            <h2>Email Address: {user.email}</h2>
                            <h3>Member Since: {displayTime(new Date(user.startTime))}</h3>
                            <h3>Reputation: {user.reputation} </h3>
                            <hr id="delimeter"></hr>
                            <UserProfileSortingButtons user={user} admin={admin}/>
                            <UserProfileListing posts={postsRes.data} 
                            communities={communitiesRes.data} comments={commentsRes.data}
                            users={usersRes.data} user={user} admin={admin}/>
                        </>)
                    })
                })
              })
            })
        })
    }, [user, admin])
    return (<>{content}</>)
}

export function UserProfileSortingButtons({user, admin}){
    console.log("\n UserProfileSortingButtons: ", "user: ",  user, "\n");
    var [buttons, setButtons] = useState('');
    useEffect(() => {
        console.log("\n user profile page sorting: \n");
        setButtons(
        <div className="sorting-buttons">
            {admin && user.firstName === "admin" &&
            <button className="user-profile-heading" id="all-users-button"
            onClick={() => {UserProfileSortingEmitter.emit('sort', 'users')}}>Users</button>}    
            <button className="user-profile-heading" id="posts-created"
            onClick={() => {UserProfileSortingEmitter.emit("sort", "posts")}}>Posts</button>
            <button className="user-profile-heading" id="communities-created"
            onClick={() => {UserProfileSortingEmitter.emit("sort", "communities")}}>Communities</button> 
            {/* // onClick={() => {console.log("\n POSTS SORTING\n"); UserProfileSortingEmitter.emit("sortPosts", false, false, communityIndex, postsFromSearch)}}
            //  onClick={() => {console.log("\n Communities SORTING\n") UserProfileSortingEmitter.emit("sortPosts", true, false, communityIndex, postsFromSearch)}}
            onClick={() => {console.log("\n Comments SORTING\n"); UserProfileSortingEmitter.emit("sortPosts", false, true, communityIndex, postsFromSearch)}} */}
            <button className="user-profile-heading" id="comments-created"
            onClick={() => {UserProfileSortingEmitter.emit("sort", "comments")}}>Comments</button>
        </div>
        )
    }, [user]) 
    return(
        <>{buttons}</>
    );
}

export const UserProfileSortingEmitter = new EventEmitter();

export const UserProfileListing = ({posts, communities, comments, users, user, admin}) => { // {communityIndex, postsFromSearch, communities, posts, comments}
    const [userListing, setUserListing] = useState(null);
    useEffect(() => {
        const sortUserListing = (type) => {
            // setUserListing(status);
            if(admin && type === "users"){
                console.log("\n users: ", users, "\n");
                setUserListing(users.map((user) => (
                    <SingleUser key={user.displayName} user={user} admin={admin}/>
                )))
            } else if(type === "posts"){
                var userPosts = posts.filter(post => post.postedBy === user.displayName);
                console.log("\n userPosts: ", userPosts, "\n");
                setUserListing(CreatePostsInHTML(userPosts, "All Posts", communities, posts, comments, user, true))
            } else if(type === "comments"){
                var userComments = comments.filter(comment => comment.commentedBy === user.displayName);
                console.log("\n userComments: ", userComments, "\n");
                setUserListing(userComments.map((comment) => (<SingleComment key={comment.id} comment={comment} user={user} admin={admin} communities={communities} posts={posts} comments={comments}/>)))
            } else if(type === "communities"){
                var userCommunities = communities.filter(community => community.createdBy === user.displayName);
                console.log("\n userCommunities: ", userCommunities, "\n");
                setUserListing(userCommunities.map((community) => (<SingleCommunity key={community.name} communities={communities} community={community} user={user} admin={admin}/>)))
            }
        };
        UserProfileSortingEmitter.on('sort', sortUserListing);
        (admin && user.firstName === "admin") ? sortUserListing("users") : sortUserListing("posts");
        return () => {
            UserProfileSortingEmitter.off('sort', sortUserListing);
        };
    }, [posts, communities, comments, users, user, admin]); 
    return (<>{userListing}</>)
}

/* 
Each element should be a post title
plus the first 20 characters of the comment left by the user
on that post. 
 display name, email address, and
reputation of a user with a phreddit account. Each user
element is a link that opens the User Profile Page view for
that user. The admin can act as that user by editing or
deleting that user’s communities, posts, and comments.
Some means of navigating back to the admin’s own user
profile page should be provided.
In addition, there should be a delete button next to each
user element in the listing. An dialog box should appear
to allow the admin to confirm their decision to delete a
user. 
-8, "", null, true, null, user, (user.firstName === "admin")
*/

export function SingleUser({user, admin}) {
    const [curUser, setCurUser] = useState(user);
    const deleteUser = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if(confirmDelete){
            try{
                console.log("\n deleting user\n");
                axios.get("http://localhost:8000/posts").then(postsRes => {
                    axios.get("http://localhost:8000/communities").then(communitiesRes => {
                      axios.get("http://localhost:8000/comments").then(commentsRes => {
                        var userCommunities;
                        // get all the communities created by the user
                        axios.get(`http://localhost:8000/communities/community/${curUser.displayName}`)
                        .then(response => {
                            userCommunities = response.data;
                            const communityNames = [];
                            for(let i = 0; i < userCommunities.length; i++){
                                communityNames.push(userCommunities[i].name);
                            }
                            console.log("\n communityNames: ", communityNames, "\n");
                            // delete all communities created by the user
                            axios.delete(`http://localhost:8000/communities/${curUser.displayName}`)
                            .then(response => {
                                console.log(response.data.message);
                            })
                            .catch(error => {
                                console.error('Error deleting community:', error.response ? error.response.data : error.message);
                            });
                            const posts = postsRes.data;
                            posts.forEach(post => {
                                // var community = communities.find(c => c.postIDs.includes(post.id));
                                var community;
                                for(let c in communitiesRes.data){
                                  // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
                                  if(communitiesRes.data[c].postIDs.includes(post.id)){
                                    community = communitiesRes.data[c].name;
                                    // console.log("\n community: ", community, "\n");
                                  } 
                                }
                                // console.log("\n community found: ", community, "\n");
                                if(community){
                                  post.communityName = community;
                                }
                                // console.log("\n post now: ", post, "\n");
                            });
                            const postThreads = GetPostThreadsArrayFunction(communitiesRes.data, posts, commentsRes.data, "All Posts", []);
                            // delete posts and comments by user or in deleted communities
                            console.log("\n postThreads: ", postThreads, "\n");
                            for(let j = 0; j < postThreads.length; j++){
                                console.log("\n postThreads[j][0].postThreadNode: ", postThreads[j][0].postThreadNode, "\n");
                                if((communityNames.includes(postThreads[j][0].postThreadNode.communityName) || 
                                    postThreads[j][0].postThreadNode.postedBy === curUser.displayName)){
                                    console.log("\n qualify postThreads[j][0].postThreadNode: ", postThreads[j][0].postThreadNode, "\n");
                                    axios.delete(`http://localhost:8000/posts/${postThreads[j][0].postThreadNode.id}`)
                                    .then(response => {
                                        console.log(response.data.message);
                                    })
                                    .catch(error => {
                                        console.log('Error deleting community:', error.response ? error.response.data : error.message);
                                    });
                                    console.log("\n rest postThreads[j]: ", postThreads[j], "\n");
                                    for(let k = 1; k < postThreads[j].length; k++){
                                        axios.delete(`http://localhost:8000/comments/${postThreads[j][k].postThreadNode.id}`)
                                        .then(response => {
                                            console.log(response.data.message);
                                        })
                                        .catch(error => {
                                            console.log('Error deleting community:', error.response ? error.response.data : error.message);
                                        });
                                    }
                                    // if posts were deleted from communities, update the communities
                                    const updateCommunities = communitiesRes.data.filter(com => com.postIDs.includes(postThreads[j][0].postThreadNode.id));
                                    for(let m = 0; m < updateCommunities.length; m++){
                                        axios.put(`http://localhost:8000/communities/${updateCommunities[m].id}/delete-post`, {postID: postThreads[j][0].postThreadNode.id})
                                        .then(response => {
                                            console.log('Updated community:', response.data);
                                        })
                                        .catch(error => {
                                            console.error('Error removing post from community:', error.response.data);
                                        });
                                    }
                                }
                            }
                            // delete the user
                            axios.delete(`http://localhost:8000/users/${curUser.id}`)
                            .then(response => {
                                console.log(response.data.message);
                                communityClickedEmitter.emit('communityClicked', -8, "", null, true, null, curUser, (curUser.firstName === "admin"));
                            })
                            .catch(error => {
                                console.log('Error deleting community:', error.response ? error.response.data : error.message);
                            });
                            // delete user comments
                            const commentThreadsArray = GetCommentThreadsArrayFunction(communitiesRes.data, posts, commentsRes.data, 'All Posts', []);
                            console.log("\n commentThreadsArray: ", commentThreadsArray, "\n");
                            console.log("\n curUser: ", curUser, "\n");
                            console.log("\n commentThreadsArray.filter(thread => thread[0].postThreadNode.commentedBy === curUser.displayName): ", commentThreadsArray.filter(thread => thread[0].postThreadNode.commentedBy === curUser.displayName), "\n");
                            const commentsToDelete = commentThreadsArray.filter(thread => thread[0].postThreadNode.commentedBy === curUser.displayName);
                            console.log("\n commentsToDelete: ", commentsToDelete, "\n");
                            for(let c = 0; c < commentsToDelete.length; c++){
                                console.log("\n deleting... ", commentsToDelete[c][0].postThreadNode.id, "\n");
                                axios.delete(`http://localhost:8000/comments/${commentsToDelete[c][0].postThreadNode.id}`)
                                    .then(response => {
                                    console.log('Comment removed:', response.data);
                                    })
                                    .catch(error => {
                                    console.error('Error removing comment:', error.response ? error.response.data : error.message);
                                    }); 
                                console.log("\n comment deleted \n");
                            }
                            for(let c = 0; c < commentsToDelete.length; c++){
                            const postsToUpdate = posts.filter(post1 => post1.commentIDs.includes(commentsToDelete[c][0].postThreadNode.id));
                            console.log("\n postsToUpdate: ", postsToUpdate, "\n");
                            for(let p = 0; p < postsToUpdate.length; p++){
                                axios.patch(`http://localhost:8000/posts/${postsToUpdate[p].id}/comments/${commentsToDelete[c][0].postThreadNode.id}`) 
                                .then(response => {
                                    console.log('Comment removed:', response.data);
                                })
                                .catch(error => {
                                    console.error('Error removing comment:', error.response ? error.response.data : error.message);
                                });
                            }
                            }
                            communityClickedEmitter.emit("communityClicked", -1, "", null, false, null, user, admin);
                        })
                        .catch(error => {
                            console.error('Error deleting community:', error.response ? error.response.data : error.message);
                        });
                        })                   
                    })
                })
            } catch (error){
                console.log("\n error: ", error, "\n");
            }
        } else{
            console.log("\n user delete was not confirmed \n");
        }
    }
    return(
      <section className="post-Section" onClick={() => {
        console.log("\n clicked in users list: ", user,"\n");
        communityClickedEmitter.emit("communityClicked", -8, "", null, false, null, user, true);
        NavBarEmitter.emit("updateNavBar");
      }}>
        <p>{user.displayName}</p>
        <p>{user.email}</p>
        <p>{user.reputation}</p>
        <button id="delete-user" onClick={deleteUser}>Delete user</button>
        <hr id="delimeter" />
      </section>
    )
}

export function SingleCommunity({communities, community, user, admin}) {
    var index = -1;
    for(let i = 0; i < communities.length; i++){
        if(communities[i].name === community.name){
            index = i;
        }
    }
    return(
      <section className="post-Section" onClick={() => {
        communityClickedEmitter.emit("communityClicked", -3, "", null, false, null, user, admin, null, community);
        NavBarEmitter.emit("updateNavBar");
      }}>
        <p>{community.name}</p>
        <hr id="delimeter" />
      </section>
    )
}

// communityClickedEmitter.emit("communityClicked", index, "", null, false, null, user, admin, null, true);

export function SingleComment({posts, communities, comments, comment, user, admin}) {
    const [postThreads, setPostThreads] = useState(GetPostThreadsArrayFunction(communities, posts, comments, "All Posts", []));
    console.log("\n postThreads: ", postThreads, "\n");
    console.log("\n SingleComment here", postThreads.filter(thread => thread.some(node => node.postThreadNode.id === comment.id)), "\n");
    console.log("\n 2: ", postThreads.filter(thread => thread.some(node => node.postThreadNode.id === comment.id))[0][0], "\n");
    const [postTitle, setPostTitle] = useState(postThreads.filter(thread => thread.some(node => node.postThreadNode.id === comment.id))[0][0].postThreadNode.title);
    return(
      <section className="post-Section" onClick={() => {
        communityClickedEmitter.emit("communityClicked", -7, "", null, false, null, user, admin, comment, true);
        NavBarEmitter.emit("updateNavBar");
      }}>
        <h4>{postTitle}</h4>
        <p>{comment.content.substring(0,20)}...</p>
        <hr id="delimeter" />
      </section>
    )
}


