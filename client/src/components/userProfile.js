import React, {useEffect, useState} from "react";
import {displayTime, postThreadDFS} from "./postThreading.js";
import EventEmitter from "events";
import {communityClickedEmitter, CreateCommunityComponent} from "./newCommunity.js";
import {CreatePostComponent, CreatePostButtonColorEmitter, CreatePostButton} from "./newPost.js";
import {WelcomePage} from "./welcomePage.js";
import axios from 'axios';

export const UserProfile = ({user}) => {
console.log("\n user profile: ", user, "\n");
return (
    <>
    <h2>Display Name: {user.displayName}</h2>
    <h2>Email Address: {user.email}</h2>
    <h3>Member Since: {displayTime(new Date(user.startTime))}</h3>
    <h3>Reputation: {user.reputation} </h3>
    <hr id="delimeter"></hr>
    <UserProfileListing />
    </>
)
}

export function UserProfileSortingButtons({user}){
console.log("\n UserProfileSortingButtons: ", "user: ",  user, "\n");
var [buttons, setButtons] = useState('');
useEffect(() => {
    console.log("\n user profile page sorting: \n");
    setButtons(
    <div className="sorting-buttons">
        <button className="user-profile-heading" id="posts-created"
        >Posts</button>
        <button className="user-profile-heading" id="communities-created"
       >Communities</button> 
        {/* // onClick={() => {console.log("\n POSTS SORTING\n"); UserProfileSortingEmitter.emit("sortPosts", false, false, communityIndex, postsFromSearch)}}
        //  onClick={() => {console.log("\n Communities SORTING\n") UserProfileSortingEmitter.emit("sortPosts", true, false, communityIndex, postsFromSearch)}}
        onClick={() => {console.log("\n Comments SORTING\n"); UserProfileSortingEmitter.emit("sortPosts", false, true, communityIndex, postsFromSearch)}} */}
        <button className="user-profile-heading" id="comments-created"
        >Comments</button>
    </div>
    )
}, [user]) 
return(
    <>{buttons}</>
);
}

export const UserProfileSortingEmitter = new EventEmitter();

export const UserProfileListing = () => { // {communityIndex, postsFromSearch, communities, posts, comments}
    const [userListing, setUserListing] = useState(null);
    useEffect(() => {

    }, [])
    useEffect(() => {
        const sortUserListing = (type) => {
            // setUserListing(status);
        };
        UserProfileSortingEmitter.on('sort', sortUserListing);
        return () => {
            UserProfileSortingEmitter.off('sort', sortUserListing);
        };
      }, []); 
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
}