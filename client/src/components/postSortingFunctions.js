import React, {useState, useEffect, useRef} from "react";
import {displayTime, PostThreadNode, postThreadDFS} from "./postThreading.js";
import {communityClickedEmitter} from "./newCommunity.js";
import {NavBarEmitter} from "./navBar.js";
import axios from 'axios';

export const DisplayPosts = ({newToOld, specificCommunity, postsFromSearch, communities, posts, comments}) => {
  const postsArrayFinal = useRef([]);
  console.log("\n in display posts \n");
  if(posts.length > 0 && communities.length > 0){
    // console.log("\ncommunities in display: ", communities, "\n");
    // console.log("\nposts in display: ", posts, "\n");
    let sortedPosts = (postsFromSearch.length > 0) ? [...postsFromSearch]: [...posts];
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
  return (
    <section id = "posts-listing-section">
      {CreatePostsInHTML(postsArrayFinal.current, specificCommunity, communities, posts, comments)}
    </section>
  );
}

// make another function for sorting from old to newest so the page is re-rendered immediately
export const DisplayPosts1 = ({newToOld, specificCommunity, postsFromSearch, communities, posts, comments}) => {
  const postsArrayFinal = useRef([]);
  console.log("\n in display 1 posts \n");
  if(posts.length > 0 && communities.length > 0){
    // console.log("\ncommunities in display: ", communities, "\n");
    // console.log("\nposts in display: ", posts, "\n");
    let sortedPosts = (postsFromSearch.length > 0) ? [...postsFromSearch]: [...posts];
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
  return (
    <section id = "posts-listing-section">
      {CreatePostsInHTML(postsArrayFinal.current, specificCommunity, communities, posts, comments)}
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
export function DisplayActivePosts({specificCommunity, postsFromSearch, communities, posts, comments}){
  // const [sortedPosts, setSortedPosts] = useState([]);
  // const [communities, setCommunities] = useState([]);
  // useEffect(() => {
  //   var printPostThreadsArray = GetPostThreadsArray("All Posts", postsFromSearch);
  //   console.log("\n experiment printPostThreadsArray: ", printPostThreadsArray, "\n");
  // })
  // useEffect(() => {
  //   // let printPostThreadsArray;
  //   // console.log("postsFROMSEARCH SIZING", postsFromSearch.length);
  //   // if (postsFromSearch.length > 0) {
  //   //   console.log("HOPE SO");
  //   //   printPostThreadsArray = useGetPostThreadsArray("All Posts", postsFromSearch);
  //   //   console.log("GETTTT POSTSS1", printPostThreadsArray);
  //   // } else if (specificCommunity !== "All Posts") {
  //   //   console.log("COMMUNITY", specificCommunity);
  //   //   printPostThreadsArray = useGetPostThreadsArray(specificCommunity, []);
  //   //   console.log("GETTTT POSTSS2", printPostThreadsArray);
  //   // } else {
  //   //   console.log("ALLLLLL POSTS");
  //   //   printPostThreadsArray = useGetPostThreadsArray("All Posts", []);
  //   //   console.log("GETTTT POSTSS3", printPostThreadsArray);
  //   // }
   
  // },[specificCommunity, postsFromSearch, communities, posts, comments]);
  // var sortedPosts = [];
  var sortedPosts = [];
  const communityArg = (postsFromSearch.length > 0) ? "All Posts" : ((specificCommunity !== "All Posts") ? specificCommunity: "All Posts");
  const searchPostsArg = (postsFromSearch.length > 0) ?  postsFromSearch : ((specificCommunity !== "All Posts") ? []: []);
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
  return (
    <div>
      {/* {console.log("\n sortedPosts in return: ", sortedPosts, " specificCommunity: ", specificCommunity, "\n")} */}
      {CreatePostsInHTML(sortedPosts, specificCommunity, communities, posts, comments)}
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

export function CreatePostsInHTML(postsArray, specificCommunity, communities, posts, comments) {
  console.log("\npostsArray in creating posts: ", postsArray, " \n");
  console.log("\n going into post threads array from create posts\n");
  var postThreadsArray = GetPostThreadsArrayFunction(communities, posts, comments, specificCommunity, [], communities, posts, comments); // <GetPostThreadsArray whichCommunityName={specificCommunity} postsFromSearch={[]}/>;
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
  return (
    <div>
      {console.log("\n postsArray in creating return: ", postsArray, "\n")}
      {postsArray.map((post, index) => (
        <SinglePost 
          key={post.url}  // Using url as the key since it's unique according to the UML
          post={{
            ...post,
            commentCount: CommentsRepliesCountMap.get(post.id) ? CommentsRepliesCountMap.get(post.id) : post.commentIDs.length
          }}
          postIndex={index}
          specificCommunity={specificCommunity}
        />
      ))}
    </div>
  );
}

export function CreatePostsInHTML2(postsArray, specificCommunity) {
  // const CommentsRepliesCountMap = Object.fromEntries(postThreadsArray.map((post, postIndex) => [postIndex, countPerPosts[postIndex]]));
  // const createdPosts = [];
  // console.log("\npostsArray in creating: ", postsArray, "\n");
  // console.log("\npostsArray.length in creating: ", postsArray.length, "\n"); 
  // for(let postsArrayIndex = 0; postsArrayIndex < postsArray.length; postsArrayIndex++){
  //   console.log("\n postThreadsArray[postsArrayIndex] here: ", postThreadsArray[postsArrayIndex], "\n");
  //   createdPosts.push(SinglePost(postsArray[postsArrayIndex], postsArrayIndex, specificCommunity, CommentsRepliesCountMap));
  // }
  // console.log("\ncreatedPosts: ", createdPosts, "\n");
  return (
    <div>
      {console.log("\n postsArray in creating return: ", postsArray, "\n")}
      {postsArray.map((post, index) => (
        <SinglePost 
          key={post.url}  // Using url as the key since it's unique according to the UML
          post={post}
          postIndex={index}
          specificCommunity={specificCommunity}
        />
      ))}
    </div>
  );
}

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

export function GetPostThreadsArrayFunction2(whichCommunityName, postsFromSearch) {
  axios.get("http://localhost:8000/posts").then(postsRes => {
    axios.get("http://localhost:8000/communities").then(communitiesRes => {
      axios.get("http://localhost:8000/comments").then(commentsRes => {
        var communities = communitiesRes.data;
        var comments = commentsRes.data;
        var posts = postsRes.data;
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
        return printPostThreadsArray;
      })
    })
  })
}

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

export function SinglePost({post, postIndex, specificCommunity}) {
  const [linkFlair, setLinkFlair] = useState(null);
  // const [communities, setCommunities] = useState([]);
  useEffect(() => {
    console.log("\n SinglePost post: ", post, "\n");
    if (post.linkFlairID) {
      axios.get(`http://localhost:8000/linkflairs/${post.linkFlairID}`)
        .then(response => setLinkFlair(response.data))
        .catch(error => console.error("Error fetching link flair:", error));
    }
    const fetchData = async () => {
      try{
        const [communitiesRes] = await Promise.all([
          axios.get("http://localhost:8000/communities"), 
        ]);
        // setCommunities(communitiesRes.data);
        // console.log("\n", communities, "\n");
        // console.log("\n communities in single post: ", communities, "\n");
        // var community;
        for(let c in communitiesRes.data){
          if(communitiesRes.data[c].postIDs.includes(post.id)){
            post.communityName = communitiesRes.data[c].name;
            // console.log("\n set post community in single post: ", post, "\n");
          } 
        }
      }
      catch(error){
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [post.linkFlairID, post]);

  return(
    <section className="post-Section" onClick={() => {
      communityClickedEmitter.emit("communityClicked", -6, "", post, false);
      NavBarEmitter.emit("updateNavBar");
    }}>
      {/* {console.log("\n post in singlepost: ", post, "\n")} */}
      <p>{specificCommunity !== "All Posts" 
          ? `${post.postedBy} | ${displayTime(post.postedDate)}` 
          : `${post.communityName || ""} | ${post.postedBy} 
          | ${displayTime(post.postedDate)}`}
      </p>
      <h3>{post.title}</h3>
      {/* {console.log("\nlinkFlair in single post ", linkFlair, " \n")} */}
      {linkFlair && <p className="link-flair">{linkFlair.content}</p>}
      <p>{post.content.substring(0,80)}...</p>
      <p>{`${post.views} View${post.views === 1 ? "" : "s"} | 
       ${post.commentCount} Comment${post.commentCount === 1 ? "" : "s"}`}
      </p>
      <hr id="delimeter" />
    </section>
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