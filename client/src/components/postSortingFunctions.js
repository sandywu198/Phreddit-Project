import React, {useState, useEffect, useRef, useCallback} from "react";
import {displayTime, PostThreadNode, postThreadDFS} from "./postThreading.js";
import {communityClickedEmitter} from "./newCommunity.js";
import {NavBarEmitter} from "./navBar.js";
import axios from 'axios';
import EventEmitter from "events";

export const DisplayPosts = ({newToOld, specificCommunity, postsFromSearch, communities, posts, comments, user, usePostsFromSearch}) => {
  const postsArrayFinal = useRef([]);
  console.log("\n in display posts \n");
  if(posts.length > 0 && communities.length > 0){
    // console.log("\ncommunities in display: ", communities, "\n");
    // console.log("\nposts in display: ", posts, "\n");
    let sortedPosts = (usePostsFromSearch) ? [...postsFromSearch]: [...posts];
    sortedPosts.sort((a,b) => newToOld ? new Date(b.postedDate) - new Date(a.postedDate) : new Date(a.postedDate) - new Date(b.postedDate));
    console.log("\n new sortedPosts: ", sortedPosts, "\n");
    sortedPosts.forEach(post => {
      // var community = communities.find(c => c.postIDs.includes(post.id));
      var community;
      for(let c in communities){
        // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
        if(communities[c].postIDs.includes(post.id)){
          community = communities[c].name;
          // console.log("\n community: ", community, "\n");
        } 
      }
      // console.log("\n community found: ", community, "\n");
      if(community){
        post.communityName = community;
      }
      // console.log("\n post now: ", post, "\n");
    });
    // console.log("\nsortedPosts: ", sortedPosts, "\n");
    if(specificCommunity !== "All Posts"){
      sortedPosts = sortedPosts.filter(post => post.communityName === specificCommunity);
    }
    postsArrayFinal.current = sortedPosts;
    console.log("\n postsArrayFinal.current: ", postsArrayFinal.current, "\n");
  }
  // useEffect(() => {
    
  // }, [posts, communities, comments, newToOld, specificCommunity, postsFromSearch]);
  console.log("\n DisplayPosts user: ", user, "\n");
  return (
    <section id = "posts-listing-section">
      {CreatePostsInHTML(postsArrayFinal.current, specificCommunity, communities, posts, comments, user, false)}
    </section>
  );
}

// make another function for sorting from old to newest so the page is re-rendered immediately
export const DisplayPosts1 = ({newToOld, specificCommunity, postsFromSearch, communities, posts, comments, user, usePostsFromSearch}) => {
  const postsArrayFinal = useRef([]);
  console.log("\n in display 1 posts \n");
  if(posts.length > 0 && communities.length > 0){
    // console.log("\ncommunities in display: ", communities, "\n");
    // console.log("\nposts in display: ", posts, "\n");
    let sortedPosts = (usePostsFromSearch) ? [...postsFromSearch]: [...posts];
    sortedPosts.sort((a,b) => newToOld ? new Date(b.postedDate) - new Date(a.postedDate) : new Date(a.postedDate) - new Date(b.postedDate));
    sortedPosts.forEach(post => {
      // var community = communities.find(c => c.postIDs.includes(post.id));
      var community;
      for(let c in communities){
        // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
        if(communities[c].postIDs.includes(post.id)){
          community = communities[c].name;
          // console.log("\n community: ", community, "\n");
        } 
      }
      // console.log("\n community found: ", community, "\n");
      if(community){
        post.communityName = community;
      }
      // console.log("\n post now: ", post, "\n");
    });
    // console.log("\nsortedPosts: ", sortedPosts, "\n");
    if(specificCommunity !== "All Posts"){
      sortedPosts = sortedPosts.filter(post => post.communityName === specificCommunity);
    }
    postsArrayFinal.current = sortedPosts;
    console.log("\n postsArrayFinal.current: ", postsArrayFinal.current, "\n");
  }
  // useEffect(() => {
    
  // }, [posts, communities, comments, newToOld, specificCommunity, postsFromSearch]);
  console.log("\n DisplayPosts1 user: ", user, "\n");
  return (
    <section id = "posts-listing-section">
      {CreatePostsInHTML(postsArrayFinal.current, specificCommunity, communities, posts, comments, user, false)}
    </section>
  );
}

// export const DisplayPosts = ({newToOld, specificCommunity, postsFromSearch}) => {
//   const [posts, setPosts] = useState(null);
//   const [communities, setCommunities] = useState(null);
//   // var postsArrayFinal = [];
//   const postsArrayFinal = useRef([]);
//   console.log("\n specificCommunity top: ", specificCommunity, "\n");
//   console.trace();
//   useEffect (() => {
//     axios.get("http://localhost:8000/communities").then(res => {
//       setCommunities(res.data);
//       console.log("\n get communities res data: ", res.data, "\n");
//       axios.get("http://localhost:8000/posts").then(res => {
//         setPosts(res.data);
//       });
//     });
//   }, [])
//   useEffect(() => {
//     if(posts !== null && communities !== null){
//       postsArrayFinal.current = [];
//       if(postsFromSearch.length !== 0){
//         var postsFromSearchCopy = [...postsFromSearch];
//         if(newToOld){
//           postsFromSearchCopy.sort(function(post1, post2){
//             return post1.postedDate > post2.postedDate ? -1: post1.postedDate < post2.postedDate ? 1 : 0;
//           })
//         } else{
//           postsFromSearchCopy.sort(function(post1, post2){
//             return post1.postedDate < post2.postedDate ? -1: post1.postedDate > post2.postedDate ? 1 : 0;
//           })
//         }
//         postsArrayFinal.current = postsFromSearchCopy;
//       } else{ 
//           // first make a copy of the posts and sort the posts
//           var postsArray = [...posts];
//           // sort in ascending or descending
//           if(newToOld){
//             postsArray.sort(function(post1, post2){
//               return post1.postedDate > post2.postedDate ? -1: post1.postedDate < post2.postedDate ? 1 : 0;
//             })
//           } else{
//             postsArray.sort(function(post1, post2){
//               return post1.postedDate < post2.postedDate ? -1: post1.postedDate > post2.postedDate ? 1 : 0;
//             })
//           }
//           // iterate over the post IDs in the communities to find which community
//             // the post is from and update postsArray with community too
//             for(let postsArrayIndex = 0; postsArrayIndex < postsArray.length; postsArrayIndex++){
//               var secondLoopBoolean = true;
//               for(let communityIndex = 0; secondLoopBoolean && communityIndex < communities.length; communityIndex++){
//                 for(let postIDIndex = 0; postIDIndex < communities[communityIndex].postIDs.length; postIDIndex++){
//                   if(communities[communityIndex].postIDs[postIDIndex] === postsArray[postsArrayIndex].postID){
//                     postsArray[postsArrayIndex].communityName = communities[communityIndex].name;
//                     secondLoopBoolean = false;
//                     break;
//                   }
//                 }
//               }
//             }
//           postsArrayFinal.current = postsArray;
//           if(specificCommunity !== "All Posts"){
//             console.log("specificCommunity: ", specificCommunity);
//             let communityorderedPosts = [];
//             // if these are community posts, get rid of the ones not in community
//             var communityIndex;
//             for(let communityIndex1 = 0; communityIndex1 < communities.length; communityIndex1++){
//               if(communities[communityIndex1].name === specificCommunity){
//                 communityIndex = communityIndex1;
//               }
//             }
//             console.log("communityIndex: ", communityIndex);
//             for(let postsArrayIndex = 0; postsArrayIndex < postsArray.length; postsArrayIndex++){
//               for(let postsIDsIndex = 0; postsIDsIndex < communities[communityIndex].postIDs.length; postsIDsIndex++){
//                 if(postsArray[postsArrayIndex].postID === communities[communityIndex].postIDs[postsIDsIndex]){
//                   console.log("\n", postsArray[postsArrayIndex].postID, " ", communities[communityIndex].postIDs, "\n");
//                   communityorderedPosts.push(postsArray[postsArrayIndex]);
//                   break;
//                 }
//               }
//             }
//             postsArrayFinal.current = communityorderedPosts;
//           }
//       }
//       console.log("\n postsArrayFinal.current: ", postsArrayFinal.current, "\n");
//     }
//   }, [posts, communities]);
//   console.log("\n specificCommunity bottom: ", specificCommunity, "\n");
//   return (
//     <section id="posts-listing-section">
//       {CreatePostsInHTML(postsArrayFinal.current, specificCommunity)}
//     </section>);
// }

// testing, version underneath was previous version
export function DisplayActivePosts({specificCommunity, postsFromSearch, communities, posts, comments, user, usePostsFromSearch}){
  var sortedPosts = [];
  const communityArg = (usePostsFromSearch) ? "All Posts" : ((specificCommunity !== "All Posts") ? specificCommunity: "All Posts");
  const searchPostsArg = (usePostsFromSearch) ?  postsFromSearch : ((specificCommunity !== "All Posts") ? []: []);
  var printPostThreadsArray = GetPostThreadsArrayFunction(communities, posts, comments, communityArg, searchPostsArg);// useGetPostThreadsArray(communityArg, searchPostsArg);
  console.log("\n printPostThreadsArray in active b4: ", printPostThreadsArray, "\n");
  if(printPostThreadsArray && printPostThreadsArray.length > 0){
    console.log("\n printPostThreadsArray in active: ", printPostThreadsArray, "\n");
    const postToNewestComment = [];
    for (let postIndex = 0; postIndex < printPostThreadsArray.length; postIndex++) {
      let newestTime;
      for (let postNodeIndex = 0; postNodeIndex < printPostThreadsArray[postIndex].length; postNodeIndex++) {
        const curObject = printPostThreadsArray[postIndex][postNodeIndex];
        if (curObject.threadLevel === 0) {
          newestTime = new Date(curObject.postThreadNode.postedDate);
        } else if (new Date(curObject.postThreadNode.commentedDate) && 
                   (!newestTime || new Date(curObject.postThreadNode.commentedDate) > newestTime)) {
          newestTime = new Date(curObject.postThreadNode.commentedDate);
        }
      }
      if (typeof newestTime !== 'undefined') {
        postToNewestComment.push({
          postField: printPostThreadsArray[postIndex][0].postThreadNode,
          newest: newestTime
        });
      }
    }
    console.log("\npostToNewestComment: ", postToNewestComment, "\n");
    postToNewestComment.sort((p1, p2) => new Date(p2.newest) - new Date(p1.newest));
    sortedPosts = postToNewestComment.map(p => p.postField);
    // setSortedPosts(sortedPosts1);
    console.log("PRINT SET", printPostThreadsArray);
    console.log("DISPLAY ACTIVE sortedPosts: ", sortedPosts);
    console.log("DISPLAY ACTIVE POSTS", specificCommunity);
  }
  console.log("\n DisplayActivePosts user: ", user, "\n");
  return (
    <div>
      {/* {console.log("\n sortedPosts in return: ", sortedPosts, " specificCommunity: ", specificCommunity, "\n")} */}
      {CreatePostsInHTML(sortedPosts, specificCommunity, communities, posts, comments, user, false)}
    </div>
  )
};

// export function DisplayActivePosts({specificCommunity, postsFromSearch}){
//   const [sortedPosts, setSortedPosts] = useState([]);
//   // const [communities, setCommunities] = useState([]);
//   // useEffect(() => {
//   //   var printPostThreadsArray = GetPostThreadsArray("All Posts", postsFromSearch);
//   //   console.log("\n experiment printPostThreadsArray: ", printPostThreadsArray, "\n");
//   // })
//   useEffect(() => {
//     const fetchData = async () => {
//       try{
//         const postsToUse = postsFromSearch.length > 0 ? postsFromSearch:
//         (await axios.get(`http://localhost:8000/posts${specificCommunity !== "All Posts" ? `?community=${specificCommunity}` : ''}`)).data;  
//         var postsWithComments = await Promise.all(postsToUse.map(async post => {
//           // console.log("\n active post: ", post, "\n");
//           const commentsRes = await axios.get(`http://localhost:8000/comments?postID=${post.id}`);
//           // console.log("\n commentsRes: ", commentsRes, "\n");
//           const newestCommentDate = commentsRes.data.reduce((max, comment) => comment.commentedDate > max ? comment.commentedDate : max, post.postedDate);
//           return {...post, newestActivity: newestCommentDate};
//         }));
//         const [communitiesRes] = await Promise.all([
//           axios.get("http://localhost:8000/communities")
//         ]);
//         // setCommunities(communitiesRes.data);
//         // console.log("\n postsWithComments b4: ", postsWithComments, "\n");
//         postsWithComments.sort((a,b) => new Date(b.newestActivity) - new Date(a.newestActivity));
//         // console.log("\n postsWithComments after: ", postsWithComments, "\n");
//         if(specificCommunity !== "All Posts"){
//           var community;
//           for(let c in communitiesRes.data){
//             // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
//             if(communitiesRes.data[c].name === specificCommunity){
//               community = communitiesRes.data[c];
//               break;
//               // console.log("\n community: ", community, "\n");
//             } 
//           }
//           console.log("\n community found: ", community, "\n");
//           if(community){
//             postsWithComments = postsWithComments.filter(post => community.postIDs.includes(post.id));
//           }
//           console.log("\npostsWithComments: ", postsWithComments, "\n");
//         }
//         setSortedPosts(postsWithComments);
//       }
//       catch(error){
//         console.error("Error fetching active posts:", error);
//       }
//     };
//     fetchData();
//   },[specificCommunity, postsFromSearch]);
//   return (
//     <div>
//       {/* {console.log("\n sortedPosts in return: ", sortedPosts, " specificCommunity: ", specificCommunity, "\n")} */}
//       {CreatePostsInHTML(sortedPosts, specificCommunity)}
//     </div>
//   )
// };

// export function DisplayActivePosts(specificCommunity, postsFromSearch){
//   let printPostThreadsArray;
//   console.log("postsFROMSEARCH SIZING", postsFromSearch.length);
//   // let printPostThreadsArray = GetPostThreadsArray(specificCommunity, postsFromSearch);
//   if (postsFromSearch.length > 0) {
//     console.log("HOPE SO");
//     printPostThreadsArray = GetPostThreadsArray("All Posts", postsFromSearch);// <GetPostThreadsArray whichCommunityName="All Posts"  postsFromSearch={postsFromSearch}/>;
//     console.log("GETTTT POSTSS1", printPostThreadsArray);
//   } else if (specificCommunity !== "All Posts") {
//     console.log("COMMUNITY", specificCommunity);
//     printPostThreadsArray = GetPostThreadsArray(specificCommunity, []); // <GetPostThreadsArray whichCommunityName={specificCommunity} postsFromSearch={[]}/>;
//     console.log("GETTTT POSTSS2", printPostThreadsArray);
//   } else {
//     console.log("ALLLLLL POSTS");
//     printPostThreadsArray = GetPostThreadsArray("All Posts", []); // <GetPostThreadsArray whichCommunityName="All Posts" postsFromSearch={[]}/>;
//     console.log("GETTTT POSTSS3", printPostThreadsArray);
//   }
//   const postToNewestComment = [];
//   for (let postIndex = 0; postIndex < printPostThreadsArray.length; postIndex++) {
//     let newestTime;
//     for (let postNodeIndex = 0; postNodeIndex < printPostThreadsArray[postIndex].length; postNodeIndex++) {
//       const curObject = printPostThreadsArray[postIndex][postNodeIndex];
//       if (curObject.threadLevel === 0) {
//         newestTime = curObject.postThreadNode.postedDate;
//       } else if (curObject.postThreadNode.commentedDate && 
//                  (!newestTime || curObject.postThreadNode.commentedDate > newestTime)) {
//         newestTime = curObject.postThreadNode.commentedDate;
//       }
//     }
//     if (typeof newestTime !== 'undefined') {
//       postToNewestComment.push({
//         postField: printPostThreadsArray[postIndex][0].postThreadNode,
//         newest: newestTime
//       });
//     }
//   }
//   postToNewestComment.sort((p1, p2) => p2.newest - p1.newest);
//   const sortedPosts = postToNewestComment.map(p => p.postField);
//   console.log("PRINT SET", printPostThreadsArray);
//   console.log("DISPLAY ACTIVE", sortedPosts);
//   console.log("DISPLAY ACTIVE POSTS", specificCommunity);
//     return (<div>
//       {CreatePostsInHTML(sortedPosts, specificCommunity)}
//     </div>)
// }

export function CreatePostsInHTML(postsArray, specificCommunity, communities, posts, comments, user, useSinglePost2) {
  console.log("\npostsArray in creating posts: ", postsArray, " \n");
  console.log("\n going into post threads array from create posts\n");
  var postThreadsArray = GetPostThreadsArrayFunction(communities, posts, comments, specificCommunity, []); // <GetPostThreadsArray whichCommunityName={specificCommunity} postsFromSearch={[]}/>;
  console.log("\npostThreadsArray in creating: ", postThreadsArray, "\n");
  const CommentsRepliesCountMap = new Map();
  for(let postIndex = 0; postIndex < postThreadsArray.length; postIndex++){
    CommentsRepliesCountMap.set(postThreadsArray[postIndex][0].postThreadNode.id, postThreadsArray[postIndex].length - 1);
  }
  console.log("\nCommentsRepliesCountMap: ", CommentsRepliesCountMap, "\n");
  // const CommentsRepliesCountMap = Object.fromEntries(postThreadsArray.map((post, postIndex) => [postIndex, countPerPosts[postIndex]]));
  // const createdPosts = [];
  // console.log("\npostsArray in creating: ", postsArray, "\n");
  // console.log("\npostsArray.length in creating: ", postsArray.length, "\n"); 
  // for(let postsArrayIndex = 0; postsArrayIndex < postsArray.length; postsArrayIndex++){
  //   console.log("\n postThreadsArray[postsArrayIndex] here: ", postThreadsArray[postsArrayIndex], "\n");
  //   createdPosts.push(SinglePost(postsArray[postsArrayIndex], postsArrayIndex, specificCommunity, CommentsRepliesCountMap));
  // }
  // console.log("\ncreatedPosts: ", createdPosts, "\n");
  console.log("\n CreatePostsInHTML user: ", user, "\n");
  return (
    <div>
      {console.log("\n postsArray in creating return: ", postsArray, "\n")}
      {postsArray.map((post, index) => (
        (useSinglePost2) ? 
        <SinglePost2 
        key={post.url}  // Using url as the key since it's unique according to the UML
        post={{
          ...post,
          commentCount: CommentsRepliesCountMap.get(post.id) ? CommentsRepliesCountMap.get(post.id) : post.commentIDs.length
        }}
        postIndex={index}
        specificCommunity={specificCommunity}
        user={user}
        /> :
        <SinglePost 
          key={post.url}  // Using url as the key since it's unique according to the UML
          post={{
            ...post,
            commentCount: CommentsRepliesCountMap.get(post.id) ? CommentsRepliesCountMap.get(post.id) : post.commentIDs.length
          }}
          postIndex={index}
          specificCommunity={specificCommunity}
          user={user}
        />
      ))}
    </div>
  );
}

// export function CreatePostsInHTML2(postsArray, specificCommunity) {
//   return (
//     <div>
//       {console.log("\n postsArray in creating return: ", postsArray, "\n")}
//       {postsArray.map((post, index) => (
//         <SinglePost 
//           key={post.url}  // Using url as the key since it's unique according to the UML
//           post={post}
//           postIndex={index}
//           specificCommunity={specificCommunity}
//         />
//       ))}
//     </div>
//   );
// }

// export function CreatePostsInHTML(postsArray, specificCommunity){
//   const [commentsCountMap, setCommentsCountMap] = useState(new Map());
//   useEffect(() => {
//     const fetchCommentsCounts = async() => {
//       const counts = new Map();
//       for(const post of postsArray){
//         try{
//           const response = await axios.get("http://localhost:8000/comments/counts?postID=${post.postID}");
//           counts.set(post.postID, response.data.count);
//         }
//         catch(error){
//           console.error("Error fetching comment count for post ${post.postID}:", error);
//           counts.set(post.postID, 0);
//         }
//       }
//       setCommentsCountMap(counts);
//     };
//     fetchCommentsCounts();
//   }, [postsArray]);
//   return(
//     <div>
//       {postsArray.map((post,index) => (
//         <SinglePost 
//           key = {post.postID}
//           post = {post}
//           postIndex = {index}
//           specificCommunity = {specificCommunity}
//           commentCount ={commentsCountMap.get(post.postID) || 0}
//         />
//       ))}
//     </div>
//   );
// };
// after posts are sorted, actually write in the content to HTML
// export function CreatePostsInHTML(postsArray, specificCommunity){
//   console.log("CREATE Post community", specificCommunity);
//   var postThreadsArray = GetPostThreadsArray(specificCommunity, []); // <GetPostThreadsArray whichCommunityName={specificCommunity} postsFromSearch={[]}/>;
//   console.log("\npostThreadsArray in creating: ", postThreadsArray, "\n");
//   const CommentsRepliesCountMap = new Map();
//   for(let postIndex = 0; postIndex < postThreadsArray.length; postIndex++){
//     CommentsRepliesCountMap.set(postThreadsArray[postIndex][0].postThreadNode.postID, postThreadsArray[postIndex].length - 1);
//   }
//   console.log("\nCommentsRepliesCountMap: ", CommentsRepliesCountMap, "\n");
//   // const CommentsRepliesCountMap = Object.fromEntries(postThreadsArray.map((post, postIndex) => [postIndex, countPerPosts[postIndex]]));
//   const createdPosts = [];
//   console.log("\postsArray in creating: ", postsArray, "\n");
//   console.log("\postsArray.length in creating: ", postsArray.length, "\n"); 
//   for(let postsArrayIndex = 0; postsArrayIndex < postsArray.length; postsArrayIndex++){
//     console.log("\n postThreadsArray[postsArrayIndex] here: ", postThreadsArray[postsArrayIndex], "\n");
//     createdPosts.push(SinglePost(postsArray[postsArrayIndex], postsArrayIndex, specificCommunity, CommentsRepliesCountMap));
//   }
//   console.log("\ncreatedPosts: ", createdPosts, "\n");
//   return (
//     <div>
//       {createdPosts}
//     </div>
//   );
// };

// WORKS HHH
  export function GetPostThreadsArray(whichCommunityName, postsFromSearch){
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [communities, setCommunities] = useState([]);
    const printPostThreadsArray = useRef([]);
    console.log("in ");
    useEffect(() => {
      const fetchData = async () => {
        try{
          const [communitiesRes, postsRes, commentsRes] = await Promise.all([
            axios.get("http://localhost:8000/communities"),
            axios.get("http://localhost:8000/posts"),
            axios.get("http://localhost:8000/comments")
          ]);
          setCommunities(communitiesRes.data);
          setPosts(postsRes.data);
          setComments(commentsRes.data);
        }
        catch(error){
          console.error("Error fetching data", error);
        }
      };
      fetchData();
    }, []);
    useEffect(() => {
      if(communities && posts && comments){
        console.log("\n communities: ", communities, "\n");
        console.log("\n posts: ", posts, "\n");
        console.log("\n comments: ", comments, "\n");
        const commentMap = new Map(comments.map(comment => [comment.id, comment]));
        console.log("\n commentMap: ", commentMap, "\n");
        let filteredPosts = posts;
        // if(whichCommunityName !== "All Posts"){
        //   const community = communities.find(c => c.name === whichCommunityName);
        //   if(community){
        //     filteredPosts = posts.filter(post => community.postIDs.includes(post.url));
        //   }
        // }
        if(whichCommunityName !== "All Posts"){
          var community;
          for(let c in communities){
            // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
            if(communities[c].name === whichCommunityName){
              community = communities[c];
              // console.log("\n community: ", community, "\n");
            } 
          }
          // console.log("\n community found: ", community, "\n");
          if(community){
            filteredPosts = posts.filter(post => community.postIDs.includes(post.id));
          }
        }
        console.log("\n filteredPosts: ", filteredPosts, "\n");
        if(postsFromSearch.length > 0){
          filteredPosts = postsFromSearch;
        }
        const threadRoots = filteredPosts.map(post => MakePostThreads(post, post.commentIDs, commentMap));
        printPostThreadsArray.current = threadRoots.map(root => {
          const arrayOfNodes = [];
          postThreadDFS(root, 0, arrayOfNodes);
          return arrayOfNodes;
        });
        console.log("\n printPostThreadsArray.current: ", printPostThreadsArray.current, "\n");
      }
    }, [communities, posts, comments, whichCommunityName, postsFromSearch]);
    return printPostThreadsArray.current;
  }

  // function version without hooks 
  // comments not updated when passed, use nested axios
export function GetPostThreadsArrayFunction(communities, posts, comments, 
  whichCommunityName, postsFromSearch) {
  var printPostThreadsArray = [];
  if (communities && posts && comments) {
    console.log("\n communities: ", communities, "\n");
    console.log("\n posts: ", posts, "\n");
    console.log("\n comments: ", comments, "\n");
    const commentMap = new Map(comments.map(comment => [comment.id, comment]));
    console.log("\n commentMap: ", commentMap, "\n");
    let filteredPosts = posts;
    if (whichCommunityName !== "All Posts") {
      var community;
      for(let c in communities){
        // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
        if(communities[c].name === whichCommunityName){
          community = communities[c];
          // console.log("\n community: ", community, "\n");
        } 
      }
      // console.log("\n community found: ", community, "\n");
      if(community){
        filteredPosts = posts.filter(post => community.postIDs.includes(post.id));
      }
    }
    console.log("\n filteredPosts: ", filteredPosts, "\n");
    if (postsFromSearch.length > 0) {
      filteredPosts = postsFromSearch;
    }
    const threadRoots = filteredPosts.map(post => MakePostThreads(post, post.commentIDs, commentMap));
    console.log("\n threadRoots: ", threadRoots, "\n");
    printPostThreadsArray = threadRoots.map(root => {
      const arrayOfNodes = [];
      postThreadDFS(root, 0, arrayOfNodes);
      return arrayOfNodes;
    });
    console.log("\n printPostThreadsArray: ", printPostThreadsArray, "\n");
  }
  console.log("\n returning printPostThreadsArray: ", printPostThreadsArray, "\n");
  return printPostThreadsArray;
}

export function GetCommentThreadsArrayFunction(communities, posts, comments, 
  whichCommunityName, postsFromSearch) {
  var printCommentThreadsArray = [];
  if (communities && posts && comments) {
    console.log("\n communities: ", communities, "\n");
    console.log("\n posts: ", posts, "\n");
    console.log("\n comments: ", comments, "\n");
    const commentMap = new Map(comments.map(comment => [comment.id, comment]));
    console.log("\n commentMap: ", commentMap, "\n");
    let filteredComments = comments;
    const threadRoots = filteredComments.map(comment => MakePostThreads(comment, comment.commentIDs, commentMap));
    console.log("\n threadRoots: ", threadRoots, "\n");
    printCommentThreadsArray = threadRoots.map(root => {
      const arrayOfNodes = [];
      postThreadDFS(root, 0, arrayOfNodes);
      return arrayOfNodes;
    });
    console.log("\n printCommentThreadsArray: ", printCommentThreadsArray, "\n");
  }
  console.log("\n returning printCommentThreadsArray: ", printCommentThreadsArray, "\n");
  return printCommentThreadsArray;
}

// export function GetPostThreadsArrayFunction2(whichCommunityName, postsFromSearch) {
//   async function fetchData(){
//     try{
//       const [postsRes, communitiesRes, commentsRes] = await Promise.all([
//         axios.get("http://localhost:8000/posts"),
//         axios.get("http://localhost:8000/communities"),
//         axios.get("http://localhost:8000/comments"),
//       ]);
//       var printPostThreadsArray = [];
//         if (communitiesRes.data && postsRes.data && commentsRes.data) {
//           console.log("\n communities: ", communitiesRes.data, "\n");
//           console.log("\n posts: ", postsRes.data, "\n");
//           console.log("\n comments: ", commentsRes.data, "\n");
//           const commentMap = new Map((commentsRes.data).map(comment => [comment.id, comment]));
//           console.log("\n commentMap: ", commentMap, "\n");
//           let filteredPosts = postsRes.data;
//           if (whichCommunityName !== "All Posts") {
//             var community;
//             for(let c in communitiesRes.data){
//               // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
//               if((communitiesRes.data)[c].name === whichCommunityName){
//                 community = (communitiesRes.data)[c];
//                 // console.log("\n community: ", community, "\n");
//               } 
//             }
//             // console.log("\n community found: ", community, "\n");
//             if(community){
//               filteredPosts = (postsRes.data).filter(post => community.postIDs.includes(post.id));
//             }
//           }
//           console.log("\n filteredPosts: ", filteredPosts, "\n");
//           if (postsFromSearch.length > 0) {
//             filteredPosts = postsFromSearch;
//           }
//           const threadRoots = filteredPosts.map(post => MakePostThreads(post, post.commentIDs, commentMap));
//           console.log("\n threadRoots: ", threadRoots, "\n");
//           printPostThreadsArray = threadRoots.map(root => {
//             const arrayOfNodes = [];
//             postThreadDFS(root, 0, arrayOfNodes);
//             return arrayOfNodes;
//           });
//           console.log("\n printPostThreadsArray: ", printPostThreadsArray, "\n");
//         }
//         return printPostThreadsArray;
//     }
//     catch(error){
//       console.error("Error fetching data", error);
//     }
//   }
//   fetchData();
// }

  // custom hook version
  export function useGetPostThreadsArray(whichCommunityName, postsFromSearch){
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [communities, setCommunities] = useState([]);
    const printPostThreadsArray = useRef([]);
    console.log("in ");
    useEffect(() => {
      const fetchData = async () => {
        try{
          const [communitiesRes, postsRes, commentsRes] = await Promise.all([
            axios.get("http://localhost:8000/communities"),
            axios.get("http://localhost:8000/posts"),
            axios.get("http://localhost:8000/comments")
          ]);
          setCommunities(communitiesRes.data);
          setPosts(postsRes.data);
          setComments(commentsRes.data);
        }
        catch(error){
          console.error("Error fetching data", error);
        }
      };
      fetchData();
    }, []);
    useEffect(() => {
      if(communities && posts && comments){
        console.log("\n communities: ", communities, "\n");
        console.log("\n posts: ", posts, "\n");
        console.log("\n comments: ", comments, "\n");
        const commentMap = new Map(comments.map(comment => [comment.id, comment]));
        console.log("\n commentMap: ", commentMap, "\n");
        let filteredPosts = posts;
        // if(whichCommunityName !== "All Posts"){
        //   const community = communities.find(c => c.name === whichCommunityName);
        //   if(community){
        //     filteredPosts = posts.filter(post => community.postIDs.includes(post.url));
        //   }
        // }
        if(whichCommunityName !== "All Posts"){
          var community;
          for(let c in communities){
            // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
            if(communities[c].name === whichCommunityName){
              community = communities[c];
              // console.log("\n community: ", community, "\n");
            } 
          }
          // console.log("\n community found: ", community, "\n");
          if(community){
            filteredPosts = posts.filter(post => community.postIDs.includes(post.id));
          }
        }
        console.log("\n filteredPosts: ", filteredPosts, "\n");
        if(postsFromSearch.length > 0){
          filteredPosts = postsFromSearch;
        }
        const threadRoots = filteredPosts.map(post => MakePostThreads(post, post.commentIDs, commentMap));
        printPostThreadsArray.current = threadRoots.map(root => {
          const arrayOfNodes = [];
          postThreadDFS(root, 0, arrayOfNodes);
          return arrayOfNodes;
        });
        console.log("\n printPostThreadsArray.current: ", printPostThreadsArray.current, "\n");
      }
    }, [communities, posts, comments, whichCommunityName, postsFromSearch]);
    return printPostThreadsArray;
  }

  // gets the thread of posts with the level of each post/comment
  // export function GetPostThreadsArray(whichCommunityName, postsFromSearch){
  //   console.log("\nin GetPostThreadsArray\n");
  //   const [comments, setComments] = useState(null);
  //   const [posts, setPosts] = useState(null);
  //   const [communities, setCommunities] = useState(null);
  //   const printPostThreadsArray = useRef([]);
  //   console.log("\n whichCommunityName: ", whichCommunityName, " \n");
  //   console.trace("\nunder whichCommunityName: \n");
  //   useEffect(() => {
  //     console.log("\n hi gonna do communities axios request\n");
  //     axios.get("http://localhost:8000/communities").then(res => {
  //       console.log("\n got axios communities data\n");
  //       setCommunities(res.data);
  //       console.log("\n get communities res data : ", communities, "\n");
  //     });
  //     axios.get("http://localhost:8000/posts").then(res => {
  //       setPosts(res.data);
  //       console.log("\n posts res.data: ", res.data, "\n");
  //     });
  //     axios.get("http://localhost:8000/comments").then(res => {
  //       console.log("\n comment res.data: ", res.data, "\n");
  //       setComments(res.data);
  //     });
  //   }, [])
  //   useEffect(() => {
  //     console.log("\ncommunities, posts, comments: ", communities, " ", posts, " ", comments, "\n");
  //     if(communities !== null && posts !== null && comments !== null){
  //       console.log("\n comments after data getting: _", comments, "_\n");
  //       var commentIDstoDates = new Map();
  //       console.log("\n comments: ", comments, " ", typeof(comments), "\n");
  //       comments.forEach(comment => {
  //         commentIDstoDates.set(comment.commentID, comment);
  //       });
  //       var postThreadRoots = [];
  //       var filteredPosts = [];
  //       if (whichCommunityName === "All Posts") {
  //         // Convert postsFromSearch into an array if it contains results
  //         console.log("FILITEREDPOSTS SIZE1", postsFromSearch.length);
  //         filteredPosts = postsFromSearch.length > 0 ? Array.from(postsFromSearch) : posts;
  //       } else {
  //         const community = communities.find(c => c.name === whichCommunityName);
  //         if (community) {
  //           console.log("FILITEREDPOSTS SIZE2", postsFromSearch.length);
  //           filteredPosts = postsFromSearch.length > 0
  //             ? Array.from(postsFromSearch).filter(post => community.postIDs.includes(post.postID))
  //             : posts.filter(post => community.postIDs.includes(post.postID));
  //         }
  //       }
  //       console.log("\ncommentIDstoDates: ", commentIDstoDates, "\n");
  //       filteredPosts.forEach(post => {
  //         var threadArray = MakePostThreads(post, post.commentIDs, commentIDstoDates);
  //         postThreadRoots.push(threadArray[0]);
  //       });
  //       printPostThreadsArray.current = [];
  //       postThreadRoots.forEach(root => {
  //         var arrayOfNodes = [];
  //         postThreadDFS(root, 0, arrayOfNodes);
  //         printPostThreadsArray.current.push(arrayOfNodes);
  //       });
  //       console.log("\n middle printPostThreadsArray.current: ", printPostThreadsArray.current, "\n");
  //     }
  //   }, [comments, posts, communities]) 
  //   console.log("\n b4 return printPostThreadsArray.current: ", printPostThreadsArray.current, "\n");
  //   return printPostThreadsArray.current;
  // }
  export function MakePostThreads(rootVal, subtree, commentMap){
    if(!subtree || subtree.length === 0){
      return new PostThreadNode(rootVal);
    }
    const startingRoot = new PostThreadNode(rootVal);
    const stack = [[startingRoot, subtree]];
    while(stack.length > 0){
      const [currentNode, childUrls] = stack.pop();
      for(const childUrl of childUrls){
        const childComment = commentMap.get(childUrl);
        if(childComment){
          const childNode = new PostThreadNode(childComment);
          currentNode.addSubNode(childNode);
          if(childComment.commentIDs.length > 0){
            stack.push([childNode, childComment.commentIDs]);
          }
        }
      }
    }
    return startingRoot;
  }
//   export function MakePostThreads(rootVal, subtree, commentIDstoDates){
//     if(!subtree || subtree.length === 0){
//       const startingRoot = new PostThreadNode(rootVal);
//       return [startingRoot, []];
//     }
//     console.log("\nthis is subtree after passing: ", subtree, "\n");
//     var test = new PostThreadNode(rootVal);
//     console.log("\ntest: ", test, "\n");
//     const startingRoot = new PostThreadNode(rootVal);
//     console.log("\nroot: ", startingRoot, " subtree: ", subtree, "\n");
//     var firstEntry = {};
//     firstEntry.node = startingRoot;
//     firstEntry.children = subtree;
//     console.log("\nfirstEntry: ", firstEntry, "\n");
//     var stackofNodes = [startingRoot, subtree];
//     console.log("\nroot: ", startingRoot, " subtree: ", subtree, "\n");
//     const listofNodes = [];
//     while(stackofNodes.length > 0){
//       var subNodes = stackofNodes.pop();
//       var postNode = stackofNodes.pop();
//       listofNodes.push(postNode);
//       console.log("\nsubNodes: ", subNodes);
//       console.log("\nlength: ", subNodes.length, "\n");
//       if(subNodes && subNodes.length > 0){
//         for(const subVal of subNodes){
//           const subNode = new PostThreadNode(commentIDstoDates.get(subVal));
//           postNode.addSubNode(subNode);
//           stackofNodes.push(subNode); 
//           stackofNodes.push(commentIDstoDates.get(subVal).commentIDs);
//         }
//       }
//     }
//     console.log("\n before return: ", startingRoot, " ", listofNodes, "\n");
//     return [startingRoot, listofNodes];
// };
/*
console.log("\npostsArray in creating posts: ", postsArray, " \n");
  console.log("\n going into post threads array from create posts\n");
  var postThreadsArray = GetPostThreadsArray(specificCommunity, []); // <GetPostThreadsArray whichCommunityName={specificCommunity} postsFromSearch={[]}/>;
  console.log("\npostThreadsArray in creating: ", postThreadsArray, "\n");
  const CommentsRepliesCountMap = new Map();
  for(let postIndex = 0; postIndex < postThreadsArray.length; postIndex++){
    CommentsRepliesCountMap.set(postThreadsArray[postIndex][0].postThreadNode.id, postThreadsArray[postIndex].length - 1);
  }
  console.log("\nCommentsRepliesCountMap: ", CommentsRepliesCountMap, "\n");
   */

// export function SinglePost2({post, postIndex, specificCommunity}) {
//   const [linkFlair, setLinkFlair] = useState(null);
//   const [communities, setCommunities] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const fetchData = async () => {
//     try{
//       const [communitiesRes, commentsRes, postsRes] = await Promise.all([
//         axios.get("http://localhost:8000/communities"), 
//         axios.get("http://localhost:8000/comments"), 
//         axios.get("http://localhost:8000/posts"), 
//       ]);
//       setCommunities(communitiesRes.data);
//       setComments(commentsRes.data);
//       setPosts(postsRes.data);
//       console.log("\n", communities, comments, posts, "\n");
//       // console.log("\n communities in single post: ", communities, "\n");
//       // var community;
//       for(let c in communitiesRes.data){
//         if(communitiesRes.data[c].postIDs.includes(post.id)){
//           post.communityName = communitiesRes.data[c].name;
//           // console.log("\n set post community in single post: ", post, "\n");
//         } 
//       }
//     }
//     catch(error){
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     if (post.linkFlairID) {
//       axios.get(`http://localhost:8000/linkflairs/${post.linkFlairID}`)
//         .then(response => setLinkFlair(response.data))
//         .catch(error => console.error("Error fetching link flair:", error));
//     }
//     fetchData();
//   }, [post.linkFlairID, post]);
//   useEffect(() => {

//   })
//   return(
//     <section className="post-Section" onClick={() => {
//       communityClickedEmitter.emit("communityClicked", -6, "", post, false);
//       NavBarEmitter.emit("updateNavBar");
//     }}>
//       {/* {console.log("\n post in singlepost: ", post, "\n")} */}
//       <p>{specificCommunity !== "All Posts" 
//           ? `${post.postedBy} | ${displayTime(post.postedDate)}` 
//           : `${post.communityName || ""} | ${post.postedBy} 
//           | ${displayTime(post.postedDate)}`}
//       </p>
//       <h3>{post.title}</h3>
//       {linkFlair && <p className="link-flair">{linkFlair.content}</p>}
//       <p>{post.content.substring(0,80)}...</p>
//       <p>{`${post.views} View${post.views === 1 ? "" : "s"} | 
//         ${post.commentCount} Comment${post.commentCount === 1 ? "" : "s"}`}
//       </p>
//       <hr id="delimeter" />
//     </section>
//   )
// }

export const voteClickedEmitter = new EventEmitter();

// voteStatus should be an integer -1 (downvote), 0 (no vote), or 1 (upvote)
export function VotePostOrComment(){
  useEffect(() => {
    const handleVote = (user, post, comment, voteStatus) => {
      console.log("\n here in handleVote \n");
      console.log("\n user: ", user, " post: ", post, " comment: ", comment, " voteStatus: ", voteStatus, "\n");
      if(user.reputation < 50){
        window.alert("Your reputation is too low to vote!");
        return;
      }
      if(comment){
        if(comment.commentedBy === user.displayName){
          window.alert("You cannot vote on your own comment!");
          return;
        }
        if(comment.userVoted === 0){
          axios.patch(`http://localhost:8000/comments/${comment.id}/${voteStatus}/voted`)
            .then(response => {
              console.log('\n Comment vote changed incremented:', response.data);
              axios.get(`http://localhost:8000/users`)
              .then(usersRes => {
                const commenter = usersRes.data.find(u1 => u1.displayName === comment.commentedBy);
                console.log("\n usersRes: ", usersRes.data, " commenter: ", commenter, "\n");
                axios.patch(`http://localhost:8000/users/${commenter.id}/${voteStatus}/reputation`)
                .then(response => {
                  console.log('\nUser reputation changed:', response.data);
                  communityClickedEmitter.emit("communityClicked", -9, "", post, false);
                })
                .catch(error => {
                  console.error('Error:', error.response ? error.response.data : error.message);
                });
              })
              .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
              });
            })
            .catch(error => {
              console.error('Error:', error.response ? error.response.data : error.message);
            });
        } else if(comment.userVoted === -1){
          // already downvoted, clicking downvote again voids the vote
          if(voteStatus === -1){
            axios.patch(`http://localhost:8000/comments/${comment.id}/${-2}/voted`)
            .then(response => {
              console.log('Comment vote changed incremented:', response.data);
              axios.get(`http://localhost:8000/users`)
              .then(usersRes => {
                const commenter = usersRes.data.find(u1 => u1.displayName === comment.commentedBy);
                console.log("\n usersRes.data: ", usersRes.data, " commenter: ", commenter, " comment: ", comment, "\n");
                axios.patch(`http://localhost:8000/users/${commenter.id}/${10}/reputation`)
                .then(response => {
                  console.log('\nUser reputation changed:', response.data);
                  communityClickedEmitter.emit("communityClicked", -9, "", post, false);
                })
                .catch(error => {
                  console.error('Error:', error.response ? error.response.data : error.message);
                });
              })
              .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
              });
            })
            .catch(error => {
              console.error('Error:', error.response ? error.response.data : error.message);
            });
          }
          if(voteStatus === 1){
            window.alert("You cannot transition from downvote to upvote! Undo the downvote and click upvote instead.");
          }
        } else if(comment.userVoted === 1){
          // already upvoted, clicking upvote again voids the vote
          if(voteStatus === 1){
            axios.patch(`http://localhost:8000/comments/${comment.id}/${2}/voted`)
            .then(response => {
              console.log('Comment vote changed incremented:', response.data);
              axios.get(`http://localhost:8000/users`)
              .then(usersRes => {
                const commenter = usersRes.data.find(u1 => u1.displayName === comment.commentedBy);
                console.log("\n usersRes.data: ", usersRes.data, " commenter: ", commenter, " comment: ", comment, "\n");
                axios.patch(`http://localhost:8000/users/${commenter.id}/${-5}/reputation`)
                .then(response => {
                  console.log('\nUser reputation changed:', response.data);
                  communityClickedEmitter.emit("communityClicked", -9, "", post, false);
                })
                .catch(error => {
                  console.error('Error:', error.response ? error.response.data : error.message);
                });
              })
              .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
              });
            })
            .catch(error => {
              console.error('Error:', error.response ? error.response.data : error.message);
            });
          }
          if(voteStatus === -1){
            window.alert("You cannot transition from upvote to downvote! Undo the upvote and click downvote instead.");
          }
        }
      } else if(post){
        if(post.postedBy === user.displayName){
          window.alert("You cannot vote on your own post!");
          return;
        } 
        if(post.userVoted === 0){
          axios.patch(`http://localhost:8000/posts/${post.id}/${voteStatus}/voted`)
            .then(response => {
              console.log('Post vote changed incremented:', response.data);
              axios.get(`http://localhost:8000/users`)
              .then(usersRes => {
                console.log("\nUsers Response Data:", usersRes.data);
                console.log("\nLooking for poster:", post.postedBy);
                const poster = usersRes.data.find(u1 => u1.displayName === post.postedBy);
                console.log("\n usersRes.data: ", usersRes.data, " poster: ", poster, " post: ", post, "\n");
                axios.patch(`http://localhost:8000/users/${poster.id}/${voteStatus}/reputation`)
                .then(response => {
                  console.log('\nUser reputation changed:', response.data);
                  communityClickedEmitter.emit("communityClicked", -9, "", post, false);
                })
                .catch(error => {
                  console.error('Error:', error.response ? error.response.data : error.message);
                });
              })
            })
            .catch(error => {
              console.error('Error:', error.response ? error.response.data : error.message);
            });
        } else if(post.userVoted === -1){
          // already downvoted, clicking downvote again voids the vote
          if(voteStatus === -1){
            axios.patch(`http://localhost:8000/posts/${post.id}/${-2}/voted`)
            .then(response => {
              console.log('Post vote changed incremented:', response.data);
              axios.get(`http://localhost:8000/users`)
              .then(usersRes => {
                console.log("\nUsers Response Data:", usersRes.data);
                console.log("\nLooking for poster:", post.postedBy);
                const poster = usersRes.data.find(u1 => u1.displayName === post.postedBy);
                console.log("\n usersRes.data: ", usersRes.data, " poster: ", poster, " post: ", post, "\n");
                axios.patch(`http://localhost:8000/users/${poster.id}/${10}/reputation`)
                .then(response => {
                  console.log('\nUser reputation changed:', response.data);
                  communityClickedEmitter.emit("communityClicked", -9, "", post, false);
                })
                .catch(error => {
                  console.error('Error:', error.response ? error.response.data : error.message);
                });
              })
              .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
              });
            })
            .catch(error => {
              console.error('Error:', error.response ? error.response.data : error.message);
            });
          }
          if(voteStatus === 1){
            window.alert("You cannot transition from downvote to upvote! Undo the downvote and click upvote instead.");
          }
        } else if(post.userVoted === 1){
          // already upvoted, clicking upvote again voids the vote
          if(voteStatus === 1){
            axios.patch(`http://localhost:8000/posts/${post.id}/${2}/voted`)
            .then(response => {
              console.log('Post vote changed incremented:', response.data);
              axios.get(`http://localhost:8000/users`)
              .then(usersRes => {
                console.log("\nUsers Response Data:", usersRes.data);
                console.log("\nLooking for poster:", post.postedBy);
                const poster = usersRes.data.find(u1 => u1.displayName === post.postedBy);
                console.log("\n usersRes.data: ", usersRes.data, " poster: ", poster, " post: ", post, "\n");
                axios.patch(`http://localhost:8000/users/${poster.id}/${-5}/reputation`)
                .then(response => {
                  console.log('\nUser reputation changed:', response.data);
                  communityClickedEmitter.emit("communityClicked", -9, "", post, false);
                })
                .catch(error => {
                  console.error('Error:', error.response ? error.response.data : error.message);
                });
              })
              .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
              });
            })
            .catch(error => {
              console.error('Error:', error.response ? error.response.data : error.message);
            });
          }
          if(voteStatus === -1){
            window.alert("You cannot transition from upvote to downvote! Undo the upvote and click downvote instead.");
          }
        }
      } else{
        console.error("\n voting neither post or comment \n ");
      }
    };
    voteClickedEmitter.on("voteClicked", handleVote);
    return () => {
      voteClickedEmitter.off("voteClicked", handleVote);
    };
  }, []);
}

export function SinglePost({post, postIndex, specificCommunity, user}) {
  const [linkFlair, setLinkFlair] = useState(null);
  const [content, setContent] = useState(null);
  console.log("\n", linkFlair, "\n");
  const fetchData = useCallback(async (linkflairContent) => {
    try{
      const [communitiesRes] = await Promise.all([
        axios.get("http://localhost:8000/communities"), 
      ]);
      // console.log("\n communities in single post: ", communities, "\n");
      // var community;
      for(let c in communitiesRes.data){
        if(communitiesRes.data[c].postIDs.includes(post.id)){
          post.communityName = communitiesRes.data[c].name;
          console.log("\n set post community in single post: ", post, "\n");
          setContent(
            <section className="post-Section" onClick={() => {
              communityClickedEmitter.emit("communityClicked", -9, "", post, false, null, user);
              NavBarEmitter.emit("updateNavBar");
            }}>
              {console.log("\n here post in singlepost: ", post, "\n")}
              <p>{specificCommunity !== "All Posts" 
                  ? `${post.postedBy} | ${displayTime(post.postedDate)}` 
                  : `${post.communityName || ""} | ${post.postedBy} 
                  | ${displayTime(post.postedDate)}`}
              </p>
              <h3>{post.title}</h3>
              {linkflairContent && <p className="link-flair">{linkflairContent.content}</p>}
              <p>{post.content.substring(0,80)}{(post.content.length > 80)? "..." : ""}</p>
              <p>{`${post.views} View${post.views === 1 ? "" : "s"} | 
               ${post.commentCount} Comment${post.commentCount === 1 ? "" : "s"} | 
               ${post.upvotes} Upvote${post.upvotes === 1 ? "" : "s"}`}
              </p>
              <hr id="delimeter" />
            </section>
          );
        }
      }
    }
    catch(error){
      console.error("Error fetching data:", error);
    }
  }, [post, specificCommunity, user]);
  useEffect(() => {
    if (post.linkFlairID) {
      axios.get(`http://localhost:8000/linkflairs/${post.linkFlairID}`)
        .then(response => {setLinkFlair(response.data); fetchData(response.data);})
        .catch(error => console.error("Error fetching link flair:", error));
    } else{
      fetchData(null);
    }
  }, [post, fetchData]);
  return(
    <>{content}</>
  )
}

export function SinglePost2({post, postIndex, specificCommunity, user}) {
  const [linkFlair, setLinkFlair] = useState(null);
  const [content, setContent] = useState(null);
  console.log("\n", linkFlair, "\n");
  const fetchData = useCallback(async (linkflairContent) => {
    try{
      const [communitiesRes] = await Promise.all([
        axios.get("http://localhost:8000/communities"), 
      ]);
      // console.log("\n communities in single post: ", communities, "\n");
      // var community;
      for(let c in communitiesRes.data){
        if(communitiesRes.data[c].postIDs.includes(post.id)){
          post.communityName = communitiesRes.data[c].name;
          console.log("\n set post community in single post: ", post, "\n");
          setContent(
            <section className="post-Section" onClick={() => {
              communityClickedEmitter.emit("communityClicked", -2, "", post, false, null, user);
              NavBarEmitter.emit("updateNavBar");
            }}>
              {console.log("\n here post in singlepost: ", post, "\n")}
              <p>{specificCommunity !== "All Posts" 
                  ? `${post.postedBy} | ${displayTime(post.postedDate)}` 
                  : `${post.communityName || ""} | ${post.postedBy} 
                  | ${displayTime(post.postedDate)}`}
              </p>
              <h3>{post.title}</h3>
              {linkflairContent && <p className="link-flair">{linkflairContent.content}</p>}
              <p>{post.content.substring(0,80)}{(post.content.length > 80)? "..." : ""}</p>
              <p>{`${post.views} View${post.views === 1 ? "" : "s"} | 
               ${post.commentCount} Comment${post.commentCount === 1 ? "" : "s"} | 
               ${post.upvotes} Upvote${post.upvotes === 1 ? "" : "s"}`}
              </p>
              <hr id="delimeter" />
            </section>
          );
        }
      }
    }
    catch(error){
      console.error("Error fetching data:", error);
    }
  }, [post, specificCommunity, user]);
  useEffect(() => {
    if (post.linkFlairID) {
      axios.get(`http://localhost:8000/linkflairs/${post.linkFlairID}`)
        .then(response => {setLinkFlair(response.data); fetchData(response.data);})
        .catch(error => console.error("Error fetching link flair:", error));
    } else{
      fetchData(null);
    }
  }, [post, fetchData]);
  return(
    <>{content}</>
  )
}

/* 
sortedPosts.forEach(post => {
// var community = communities.find(c => c.postIDs.includes(post.id));
var community;
for(let c in communities){
  // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
  if(communities[c].postIDs.includes(post.id)){
    community = communities[c].name;
    // console.log("\n community: ", community, "\n");
  } 
}
// console.log("\n community found: ", community, "\n");
if(community){
  post.communityName = community;
}
// console.log("\n post now: ", post, "\n");
});
*/
// second try
// export function SinglePost({post, postIndex, specificCommunity}) {
//   const [linkFlair, setLinkFlair] = useState(null);
//   const [commentCount, setCommentCount] = useState(0);

//   useEffect(() => {
//     // Fetch LinkFlair
//     if (post.linkFlairID) {
//       axios.get(`http://localhost:8000/linkflairs/${post.linkFlairID}`)
//         .then(response => setLinkFlair(response.data))
//         .catch(error => console.error("Error fetching link flair:", error));
//     }
//     axios.get(`http://localhost:8000/posts/${post._id}/comments/count`)
//       .then(response => setCommentCount(response.data.count))
//       .catch(error => console.error("Error fetching comment count:", error));
//   }, [post.linkFlairID, post._id]);

//   return(
//     <section className="post-Section" onClick={() => {
//       communityClickedEmitter.emit("communityClicked", -6, "", post, false);
//       NavBarEmitter.emit("updateNavBar");
//     }}>
//       <p>{specificCommunity !== "All Posts" 
//           ? `${post.postedBy} | ${displayTime(post.postedDate)}` 
//           : `${post.communityName || ""} | ${post.postedBy} 
//           | ${displayTime(post.postedDate)}`}
//       </p>
//       <h3>{post.title}</h3>
//       {linkFlair && <p className="link-flair">{linkFlair.content}</p>}
//       <p>{post.content.substring(0,80)}...</p>
//       <p>{`${post.views} View${post.views === 1 ? "" : "s"} | 
//        ${commentCount} Comment${commentCount === 1 ? "" : "s"}`}
//       </p>
//       <hr id="delimeter" />
//     </section>
//   )
// }
// CORRECT
// export function SinglePost({post, postIndex, specificCommunity}){
//   const [linkFlair, setLinkFlair] = useState(null);
//   const [commentCount, setCommentCount] = useState(0);
//   useEffect(() => {
//     if(post.linkFlairID){
//       axios.get("http://localhost:8000/linkflairs/${post.linkFlairID}")
//       .then(response => setLinkFlair(response.data))
//       .catch(error => console.error("Error fetching linkflair:", error));
//     }
//     axios.get("http://localhost:8000/posts/${post._id}/comments/count")
//     .then(response => setCommentCount(response.data.count))
//     .catch(error => console.error("Error fetching comment count:", error));
//   }, [post.linkFlairID, post._id]);
//   return(
//     <section className = "post-Section" onClick={() => {
//       communityClickedEmitter.emit("communityClicked", -6, "", post, false);
//       NavBarEmitter.emit("updateNavBar");
//     }}>
//       <p>{specificCommunity !== "All Posts" 
//           ? `${post.postedBy} | ${displayTime(post.postedDate)}` 
//           : `${post.communityName || ""} | ${post.postedBy} 
//           | ${displayTime(post.postedDate)}`}
//       </p>
//       <h3>{post.title}</h3>
//       {/* {post.linkFlairID && <p className = "link-flair">
//         <GetFlairContent linkFlairID = {post.linkFlairID}/>
//         </p>} */}
//       {linkFlair && <p className="link-flair">{linkFlair.content}</p>}
//       <p>{post.content.substring(0,80)}...</p>
//       <p>{`${post.views} View${post.views === 1 ? "" : "s"} | 
//        ${commentCount} Comment${commentCount === 1 ? "" : "s"}`}
//       </p>
//       {/* <a href = {post.url}>Full Post</a> */}
//       <hr id = "delimeter"></hr>
//     </section>
//   )
// }

// export function SinglePost(post, postIndex, specificCommunity, CommentsRepliesCountMap){
//   console.log("\npost here: ", post, "\n");
//   // console.log("\n model here: ", model, "\n");
//   console.log("\nCommentsRepliesCountMap: ", CommentsRepliesCountMap, "\n");
//   return (
//     <section key={post.postID} onClick={() => {communityClickedEmitter.emit('communityClicked', -6, "", post, false); 
//     NavBarEmitter.emit('updateNavBar');}} className="post-Section"> 
//       <p>
//       {(specificCommunity !== "All Posts")? post.postedBy + " | " + displayTime(post.postedDate) :
//       ("communityName" in post ? post.communityName : "") + 
//           " | " + post.postedBy + " | " + displayTime(post.postedDate)}
//       </p>
//       <h3>{post.title}</h3>
//       {(post.linkFlairID !== null) && <p className="link-flair"> <GetFlairContent linkFlairID={post.linkFlairID}/></p>}
//       <p>{post.content.substring(0, 80)}</p>
//       <p>{post.views + " View" + ((post.views === 1) ? " | " 
//       : "s | ") + CommentsRepliesCountMap.get(post.postID) + 
//       " Comment" + ((CommentsRepliesCountMap.get(post.postID) === 1) ? "" : "s")}</p>
//       <hr id = "delimeter"/>
//     </section>
//   );
// }
export const GetFlairContent = ({linkFlairID}) => {
  const [flairContent, setFlairContent] = useState('');
  useEffect(() => {
    const fetchFlairContent = async () => {
      try{
        const response = await axios.get("http://localhost:8000/linkflairs/{linkFlairID}");
        setFlairContent(response.data.content);
      }
      catch(error){
        console.error(`Error fetching linkflair ${linkFlairID}:`, error);
        setFlairContent('');
      }
    };
    fetchFlairContent();
  },[linkFlairID]);
  return flairContent;
}

// DOESN'T WORK, USE THE VERSION UNDER THIS ONE: 
// export function GetSortedThreadRoot(rootVal, subtree, commentIDstoDates){
//   console.log("\n commentIDstoDates: ", commentIDstoDates, "\n");
//   if(!subtree || subtree.length === 0){
//     return null;
//   }
//   const startingRoot = new PostThreadNode(rootVal);
//   const stack = [[startingRoot, subtree]];
//   const listofNodes = [];
//   while(stack.length > 0){
//     const [currentNode, children] = stack.pop();
//     listofNodes.push(currentNode);
//     if(children && children.length > 0){
//       children.sort((a,b) => commentIDstoDates.get(b).commentedDate - commentIDstoDates.get(a).commentedDate);
//       for(const childId of children){
//         const childData = commentIDstoDates.get(childId);
//         const childNode = new PostThreadNode(childData);
//         currentNode.addSubNode(childNode);
//         stack.push([childNode, childData.commentIDs]);
//       }
//     }
//   }
//   return [startingRoot, listofNodes];
// }

export function GetSortedThreadRoot(rootVal, subtree, commentIDstoDates, commentIDstoDatesMap){
    if(!subtree || subtree.length === 0){
      return null;
    }
    console.log("\nthis is subtree after passing: ", subtree, "\n");
    const startingRoot = new PostThreadNode(rootVal);
    console.log("\nroot: ", startingRoot, " subtree: ", subtree, "\n");
    var firstEntry = {};
    firstEntry.node = startingRoot;
    // sorted in terms of newest
    subtree.sort((c1, c2) => commentIDstoDatesMap.get(c2) - commentIDstoDatesMap.get(c1));
    firstEntry.children = subtree;
    console.log("\nfirstEntry: ", firstEntry, "\n");
    var stackofNodes = [startingRoot, subtree];
    console.log("\nroot: ", startingRoot, " subtree: ", subtree, "\n");
    const listofNodes = [];
    while(stackofNodes.length > 0){
      var subNodes = stackofNodes.pop();
      subNodes.sort((c1, c2) => commentIDstoDatesMap.get(c2) - commentIDstoDatesMap.get(c1));
      var postNode = stackofNodes.pop();
      listofNodes.push(postNode);
      console.log("\nsubNodes: ", subNodes);
      console.log("\nlength: ", subNodes.length, "\n");
      if(subNodes && subNodes.length > 0){
        for(const subVal of subNodes){
          const subNode = new PostThreadNode(commentIDstoDates.get(subVal));
          postNode.addSubNode(subNode);
          stackofNodes.push(subNode); 
          stackofNodes.push(commentIDstoDates.get(subVal).commentIDs);
        }
      }
    }
    console.log("\n before return: ", startingRoot, " ", listofNodes, "\n");
    return [startingRoot, listofNodes];
};