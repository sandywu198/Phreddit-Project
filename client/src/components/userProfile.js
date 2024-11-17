import React, {useEffect, useState} from "react";
import {displayTime, postThreadDFS} from "./postThreading.js";
import EventEmitter from "events";
import {communityClickedEmitter, CreateCommunityComponent} from "./newCommunity.js";
import {CreatePostComponent, CreatePostButtonColorEmitter, CreatePostButton} from "./newPost.js";
import {WelcomePage} from "./welcomePage.js";
import {NavBarEmitter} from "./navBar.js";
import {CreatePostsInHTML} from "./postSortingFunctions.js";
import axios from 'axios';

export const UserProfile = ({user, admin}) => {
    console.log("\n user profile: ", user, "\n");
    const [content, setContent] = useState(null);
    useEffect(() => {
        async function fetchData(){
            try{
                const [postsRes, communitiesRes, commentsRes, usersRes] = await Promise.all([
                    axios.get("http://localhost:8000/posts"),
                    axios.get("http://localhost:8000/communities"),
                    axios.get("http://localhost:8000/comments"),
                    axios.get("http://localhost:8000/users"),
                ]);
                setContent(
                <>
                    <h2>Display Name: {user.displayName}</h2>
                    <h2>Email Address: {user.email}</h2>
                    <h3>Member Since: {displayTime(new Date(user.startTime))}</h3>
                    <h3>Reputation: {user.reputation} </h3>
                    <hr id="delimeter"></hr>
                    {user.displayName === "admin" && 
                    <button className="user-profile-heading" id="all-users-button"
                    onClick={() => {UserProfileSortingEmitter.emit('sort', 'users')}}>Users</button>}    
                    <UserProfileSortingButtons user={user}/>
                    <UserProfileListing posts={postsRes.data} 
                    communities={communitiesRes.data} comments={commentsRes.data}
                    users={usersRes.data} user={user} admin={admin}
                    />
                </>
                )
            }
            catch(error){
                console.error("Error fetching data: ", error);
            }
        }
        fetchData();
    }, [user, admin])
    return (<>{content}</>)
}

export function UserProfileSortingButtons({user}){
    console.log("\n UserProfileSortingButtons: ", "user: ",  user, "\n");
    var [buttons, setButtons] = useState('');
    useEffect(() => {
        console.log("\n user profile page sorting: \n");
        setButtons(
        <div className="sorting-buttons">
            <button className="user-profile-heading" id="users-created"
            onClick={() => {UserProfileSortingEmitter.emit("sort", "users")}}>Users</button>
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
            if(type === "users"){
                console.log("\n users: ", users, "\n");
                setUserListing(users.map((user) => (
                    <SingleUser key={user.displayName} user={user} admin={admin}/>
                )))
            } else if(type === "posts"){
                var userPosts = posts.filter(post => post.postedBy === user.displayName);
                console.log("\n userPosts: ", userPosts, "\n");
                setUserListing(CreatePostsInHTML(userPosts, "All Posts", communities, posts, comments))
            } else if(type === "comments"){
                var userComments = comments.filter(comment => comment.commentedBy === user.displayName);
                console.log("\n userComments: ", userComments, "\n");
                setUserListing(userComments.map((comment) => (<SingleComment comment={comment} user={user} admin={admin}/>)))
            } else if(type === "communities"){
                var userCommunities = communities.filter(community => community.createdBy === user.displayName);
                console.log("\n userCommunities: ", userCommunities, "\n");
                setUserListing(userCommunities.map((community) => (<SingleCommunity key={community.name} communities={communities} community={community} user={user} admin={admin}/>)))
            }
        };
        UserProfileSortingEmitter.on('sort', sortUserListing);
        sortUserListing("users");
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
-8, "", null, true, null, user, (user.displayName === "admin")
*/

export function SingleUser({user, admin}) {
    return(
      <section className="post-Section" onClick={() => {
        communityClickedEmitter.emit("communityClicked", -8, "", null, false, null, user, admin);
        NavBarEmitter.emit("updateNavBar");
      }}>
        <p>{user.displayName}</p>
        <p>{user.email}</p>
        <p>{user.reputation}</p>
        <button id="delete-user">Delete user</button>
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
        communityClickedEmitter.emit("communityClicked", index, "", null, false, null, user, admin);
        NavBarEmitter.emit("updateNavBar");
      }}>
        <p>{community.name}</p>
        <hr id="delimeter" />
      </section>
    )
}

// TO DO: figure out post titles
export function SingleComment({comment, user, admin}) {
    return(
      <section className="post-Section" onClick={() => {
        communityClickedEmitter.emit("communityClicked", -7, "", null, false, null, user, admin, comment);
        NavBarEmitter.emit("updateNavBar");
      }}>
        <p>{comment.content.substring(0,20)}</p>
        <hr id="delimeter" />
      </section>
    )
}
    // console.log("\n model in sorting: ", model, " communityIndex: ", communityIndex, " postsFromSearch: ", postsFromSearch, "\n")
// postsFromSearch = new Set(postsFromSearch);
// const [postListing, updatePostListing] = useState(null);
// useEffect (() => {
//     console.log("\n SortedPostListing: ", " communities: ", communities, " posts ", posts, " comments: ", comments, "\n");
//     updatePostListing(
//     (communityIndex < 0 && postsFromSearch.length === 0) ? 
//     <DisplayPosts newToOld={true} specificCommunity="All Posts" postsFromSearch={[]} communities={communities} posts={posts} comments={comments} /> :
//     ((postsFromSearch.length > 0) ?  <DisplayPosts newToOld={true} specificCommunity="All Posts" postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments} />:
//     <DisplayPosts newToOld={true} specificCommunity={communities[communityIndex].name} postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />));
// }, [communityIndex, postsFromSearch, communities, posts, comments]); //[communityIndex, postListing, postsFromSearch]
// useEffect(() => {
//     const getPostListing = (newestToOldest, active, communityIndex, postsFromSearch) => {
//     console.log("\n button sort get posts\n");
//     console.log("\n SortedPostListing getPostListing: ", " communities: ", communities, " posts ", posts, " comments: ", comments, "\n");
//     if(communities !== null){
//         console.log("\n button sort get posts 2\n");
//         console.log("\n newestToOldest: ", newestToOldest, ", active: ", active, 
//         ", communityIndex: ", communityIndex, ", postsFromSearch: ", postsFromSearch, "\n");
//         let updatedPostListing;
//         if (communityIndex >= 0) {
//         const communityName = communities[communityIndex].name;
//         if (active) {
//             updatedPostListing = <DisplayActivePosts specificCommunity={communityName} postsFromSearch={new Set()} communities={communities} posts={posts} comments={comments} />// DisplayActivePosts(communityName, new Set()); 
//         } else if (newestToOldest) {
//             console.log("\n new for community \n");
//             updatedPostListing = <DisplayPosts newToOld={true} specificCommunity={communityName} postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />;
//         } else {
//             console.log("\n old for community \n");
//             updatedPostListing = <DisplayPosts1 newToOld={false} specificCommunity={communityName} postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />;
//         }
//         } else if (postsFromSearch.length > 0) {
//         if (active) {
//             updatedPostListing = <DisplayActivePosts specificCommunity={"All Posts"} postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments} /> // DisplayActivePosts("All Posts", postsFromSearch);
//         } else if (newestToOldest) {
//             updatedPostListing = <DisplayPosts newToOld={true} specificCommunity="All Posts" postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments} />;
//         } else {
//             updatedPostListing = <DisplayPosts1 newToOld={false} specificCommunity="All Posts" postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments} />;
//         }
//         } else {
//         if (active) {
//             updatedPostListing = <DisplayActivePosts specificCommunity={"All Posts"} postsFromSearch={new Set()} communities={communities} posts={posts} comments={comments} /> // DisplayActivePosts("All Posts", new Set());
//         } else if (newestToOldest) {
//             console.log("\n new for all posts \n");
//             updatedPostListing = <DisplayPosts newToOld={true} specificCommunity="All Posts" postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />;
//         } else {
//             console.log("\n old for all posts \n");
//             updatedPostListing = <DisplayPosts1 newToOld={false} specificCommunity="All Posts" postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />;
//         }
//         }
//         updatePostListing(updatedPostListing);
//     }
//     }
//     getPostListing(true, false, communityIndex, postsFromSearch);
//     sortPostEmitter.on("sortPosts", getPostListing);
    
//     return () => {
//     sortPostEmitter.off("sortPosts", getPostListing);
//     };
// }, [communities, communityIndex, postsFromSearch, posts, comments]); // [communities, communityIndex, postsFromSearch]    
// console.log("\npostListing return: ", postListing, "\n");
// return (<div>{postListing}</div>);

