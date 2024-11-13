// import Model from '../models/model.js';
import React, {useEffect, useState} from "react";
import {displayTime, postThreadDFS} from "./postThreading.js";
import EventEmitter from "events";
import {communityClickedEmitter, CreateCommunityComponent} from "./newCommunity.js";
import {AddNewCommentComponent} from "./newComment.js";
import {CreatePostComponent, CreatePostButtonColorEmitter, CreatePostButton} from "./newPost.js";
import {CreateHomeButtonColorEmitter, CreateCommunityButtonColorEmitter, NavBarEmitter, CommunityNameButtonColorEmitter} from "./navBar.js";
import {DisplayPosts, DisplayPosts1, GetPostThreadsArrayFunction, DisplayActivePosts, GetSortedThreadRoot} from "./postSortingFunctions.js";
import {WelcomePage} from "./welcomePage.js";
import {NavBar} from "./navBar.js";
import axios from 'axios';

// create global context for sharing one Mode object as a state
// export const ModelStateContext = createContext();

// create component for mounting and updating metadata
export function MetaData(){
  useEffect(() => {
    document.title = "Phreddit - Dive into anything";
    var linkIcon = document.querySelector("link[rel='icon']");
    if(!linkIcon){
      var iconLink = document.createElement("link");
      iconLink.rel = "icon";
      iconLink.href = "/image/Official Phreddit Logo.png";
      iconLink.type = "image/x-icon";
      document.head.appendChild(iconLink); 
    } else{
      linkIcon.href = "/image/Official Phreddit Logo.png";
    }
  }, []);
}

export function HomePage(){
  return(
    <>
      {TopBanner()}
      <hr id = "delimeter"></hr>
      <div className="text-under-header">
        <NavBar /> {/*  fetchData={fetchData} */}
        <PostHeader />
      </div>
    </>
  )
}

export const sortPostEmitter = new EventEmitter();
sortPostEmitter.setMaxListeners(25);

export const SortedPostListing = ({communityIndex, postsFromSearch, communities, posts, comments}) => {
  // console.log("\n model in sorting: ", model, " communityIndex: ", communityIndex, " postsFromSearch: ", postsFromSearch, "\n")
  // postsFromSearch = new Set(postsFromSearch);
  const [postListing, updatePostListing] = useState(null);
  useEffect (() => {
    console.log("\n SortedPostListing: ", " communities: ", communities, " posts ", posts, " comments: ", comments, "\n");
    updatePostListing(
      (communityIndex < 0 && postsFromSearch.length === 0) ? 
      <DisplayPosts newToOld={true} specificCommunity="All Posts" postsFromSearch={[]} communities={communities} posts={posts} comments={comments} /> :
      ((postsFromSearch.length > 0) ?  <DisplayPosts newToOld={true} specificCommunity="All Posts" postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments} />:
      <DisplayPosts newToOld={true} specificCommunity={communities[communityIndex].name} postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />));
  }, [communityIndex, postsFromSearch, communities, posts, comments]); //[communityIndex, postListing, postsFromSearch]
  useEffect(() => {
    const getPostListing = (newestToOldest, active, communityIndex, postsFromSearch) => {
      console.log("\n button sort get posts\n");
      console.log("\n SortedPostListing getPostListing: ", " communities: ", communities, " posts ", posts, " comments: ", comments, "\n");
      if(communities !== null){
        console.log("\n button sort get posts 2\n");
        console.log("\n newestToOldest: ", newestToOldest, ", active: ", active, 
          ", communityIndex: ", communityIndex, ", postsFromSearch: ", postsFromSearch, "\n");
        let updatedPostListing;
        if (communityIndex >= 0) {
          const communityName = communities[communityIndex].name;
          if (active) {
            updatedPostListing = <DisplayActivePosts specificCommunity={communityName} postsFromSearch={new Set()} communities={communities} posts={posts} comments={comments} />// DisplayActivePosts(communityName, new Set()); 
          } else if (newestToOldest) {
            console.log("\n new for community \n");
            updatedPostListing = <DisplayPosts newToOld={true} specificCommunity={communityName} postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />;
          } else {
            console.log("\n old for community \n");
            updatedPostListing = <DisplayPosts1 newToOld={false} specificCommunity={communityName} postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />;
          }
        } else if (postsFromSearch.length > 0) {
          if (active) {
            updatedPostListing = <DisplayActivePosts specificCommunity={"All Posts"} postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments} /> // DisplayActivePosts("All Posts", postsFromSearch);
          } else if (newestToOldest) {
            updatedPostListing = <DisplayPosts newToOld={true} specificCommunity="All Posts" postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments} />;
          } else {
            updatedPostListing = <DisplayPosts1 newToOld={false} specificCommunity="All Posts" postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments} />;
          }
        } else {
          if (active) {
            updatedPostListing = <DisplayActivePosts specificCommunity={"All Posts"} postsFromSearch={new Set()} communities={communities} posts={posts} comments={comments} /> // DisplayActivePosts("All Posts", new Set());
          } else if (newestToOldest) {
            console.log("\n new for all posts \n");
            updatedPostListing = <DisplayPosts newToOld={true} specificCommunity="All Posts" postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />;
          } else {
            console.log("\n old for all posts \n");
            updatedPostListing = <DisplayPosts1 newToOld={false} specificCommunity="All Posts" postsFromSearch={[]} communities={communities} posts={posts} comments={comments} />;
          }
        }
        updatePostListing(updatedPostListing);
      }
    }
    getPostListing(true, false, communityIndex, postsFromSearch);
    sortPostEmitter.on("sortPosts", getPostListing);
    
    return () => {
      sortPostEmitter.off("sortPosts", getPostListing);
    };
  }, [communities, communityIndex, postsFromSearch, posts, comments]); // [communities, communityIndex, postsFromSearch]    
  console.log("\npostListing return: ", postListing, "\n");
  return (<div>{postListing}</div>);
}

export function HandleSearchLogic({searchString, communityIndex, printPostThreadsArray, communities, posts, comments}){
  console.log("\n HandleSearchLogic\n");
  console.log("\n printPostThreadsArray: ", printPostThreadsArray, "\n");
  const [result, setResult] = useState(null);
  // var printPostThreadsArray = GetPostThreadsArray("All Posts", []);// <GetPostThreadsArray whichCommunityName="All Posts"  postsFromSearch={[]}/>;
  useEffect(()=>{
    console.log("\n HandleSearchLogic usestate\n");
  // console.log("\nsearchString1: ", searchString1, "\n");
  // var searchString = searchString1.searchString
  // var communityIndex = searchString1.communityIndex;
  console.log("\nsearchString: ", searchString, " ", communityIndex, "\n");
  // var postsFromSearch;
  var searchWords = searchString.trim().match(/\b[\w'-]+\b/g).map(w => w.toLowerCase());
  var postsFromSearch = new Set();
  console.log("\nprintPostThreadsArray from search: ", printPostThreadsArray, "\n");
  for (let wordIndex = 0; wordIndex < searchWords.length; wordIndex++) {
    for (let postIndex = 0; postIndex < printPostThreadsArray.length; postIndex++) {
      for (let postNodeIndex = 0; postNodeIndex < printPostThreadsArray[postIndex].length; postNodeIndex++) {
        var currentNode = printPostThreadsArray[postIndex][postNodeIndex];
        if (currentNode.threadLevel === 0) {
          if (currentNode.postThreadNode.title.toLowerCase().includes(searchWords[wordIndex])
            || currentNode.postThreadNode.content.toLowerCase().includes(searchWords[wordIndex])) {
            postsFromSearch.add(currentNode.postThreadNode);
            break; 
          }
        } else {
          if (currentNode.postThreadNode.content.toLowerCase().includes(searchWords[wordIndex])) {
            postsFromSearch.add(printPostThreadsArray[postIndex][0].postThreadNode);
            break;
          }
        }
      }
    }
  }
  postsFromSearch = Array.from(postsFromSearch);
  // const postsFromSearch = HandleSearchLogic(searchString);
  console.log("\npostsFromSearch in communityclicked: ", postsFromSearch, "\n");
  if (postsFromSearch.length === 0) {
    setResult( <div>
      <h3 className="post-heading" id="community-name">No results found for: {searchString}</h3>
      <p id="post-number">0 Posts</p>
      <hr id="delimeter"></hr>
      <section id="posts-listing-section">
        <img src='image/0 search results.jpg' alt='No results found' />
      </section>
    </div>);
  } else {
  var postNum = postsFromSearch.length + " Post" + (postsFromSearch.length === 1 ? "" : "s");
  setResult(<div>
    <div id="community-name-sorting-buttons-line">
      <h3 className="post-heading" id="community-name">Results for: {searchString}</h3>
      {/* {PageNameSortingButtons(-1, postsFromSearch)} */}
      <PageNameSortingButtons communityIndex={-1} postsFromSearch={postsFromSearch}/>
    </div>
    <p id="post-number">{postNum}</p>
    <hr id="delimeter" />
    <section id="posts-listing-section">
      {/* <SortedPostListing model={model} communityIndex={communityIndex} postsFromSearch={postsFromSearch} /> */}
      <SortedPostListing communityIndex={communityIndex} postsFromSearch={postsFromSearch} communities={communities} posts={posts} comments={comments}/>
    </section>
  </div>)
  }
  }, [searchString, communityIndex, printPostThreadsArray, communities, posts, comments])
  return(<>{result}</>)
};

export const MakeCommentsListing = ({sortedNodeArray, post}) => {
  console.log("\n sortedNodeArray in MakeCommentsListing: ", sortedNodeArray, "\n");
  let lastThreadLevel = 1;
  const result = [];
  const stack = [{substack: result}];
  console.log("\n sortedNodeArray in listComments: ", sortedNodeArray, "\n");
  sortedNodeArray.forEach((node, nodeIndex) =>{
    console.log("\n node: ", node, "\n");
    const curThreadLevel = node.threadLevel;
    const curComment = <li key={nodeIndex}>{
    <div>
      <p>{node.postThreadNode.commentedBy + " | " + displayTime(node.postThreadNode.commentedDate)}</p>
      <p>{node.postThreadNode.content}</p>
      <button id={`reply-button-${nodeIndex}`}
      onClick={() => {communityClickedEmitter.emit('communityClicked', -7, "", post, false, node.postThreadNode)}}>Reply</button>
    </div>}</li>;
    if(curThreadLevel > lastThreadLevel){
      const newList = [curComment];
      if(stack.length > 0){
        const prevList = stack[stack.length - 1].substack;
        prevList.push(<ul key={`nested-${nodeIndex}`}>{newList}</ul>);
      } 
      stack.push({substack: newList});
    } else if(curThreadLevel < lastThreadLevel){
      let levelDiff = lastThreadLevel - curThreadLevel;
      while(levelDiff > 0 && stack.length > 1){
        stack.pop();
        levelDiff--;
      }
      stack[stack.length - 1].substack.push(curComment);
    } else if(nodeIndex > 0 && 
      sortedNodeArray[nodeIndex - 1].threadLevel !== curThreadLevel){
      const newList = [curComment];
      stack[stack.length - 1].substack.push(<ul key={`sibling-${nodeIndex}`}>{newList}</ul>);
    } else{
      stack[stack.length - 1].substack.push(curComment);
    }
    lastThreadLevel = curThreadLevel;
  });
  return (<ul id="comment-listing">{result}</ul>);
};

// switches main page view
export function GetCommunitiesAndLoad(){
  // const {model} = useContext(ModelStateContext);
  const [posts, setPosts] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [linkFlairs, setLinkFlairs] = useState(null);
  const [comments, setComments] = useState(null);
  const [pageHeader, updatePageHeader] = useState(WelcomePage());
  // var postThreadsArray; // = GetPostThreadsArray("All Posts", []);//<GetPostThreadsArray whichCommunityName="All Posts"  postsFromSearch={[]}/>;
  // console.log("\n creating postThreadsArray in loading view: ", postThreadsArray, "\n");
  useEffect (() => {
    axios.get("http://localhost:8000/posts").then(postsRes => {
      setPosts(postsRes.data);
      axios.get("http://localhost:8000/communities").then(communitiesRes => {
        setCommunities(communitiesRes.data);
        axios.get("http://localhost:8000/comments").then(commentsRes => {
          setComments(commentsRes.data);
          console.log("\n in usestate: ", communitiesRes.data, " ", commentsRes.data, " ", postsRes.data);
          // updatePageHeader(
          //   <section id="hide-for-creating-community">
          //     <div className="community-information" style={{display:"block"}}>
          //         <div id="community-name-sorting-buttons-line">
          //           <h3 className="post-heading" id="community-name">All Posts</h3>
          //           <PageNameSortingButtons communityIndex={-1} postsFromSearch={[]}/>
          //         </div>
          //         <h4 className="community-heading" id="community-post-count">{postsRes.data.length + " Post" 
          //         + ((postsRes.data.length === 1) ? "" : "s")}</h4>
          //         <hr id = "delimeter"/>
          //         {/* <SortedPostListing model={model} communityIndex={-1} postsFromSearch={[]}/> */}
          //         <SortedPostListing communityIndex={-1} postsFromSearch={[]} communities={communitiesRes.data} posts={postsRes.data} comments={commentsRes.data}/>
          //     </div>
          //   </section>
          // );
        })
      })
    })
    // axios.get("http://localhost:8000/posts").then(res => {
    //   setPosts(res.data);
    //   console.log("\nres.data", res.data, " posts: ", posts, "\n");
    //   // console.log("\n posts.length: ", posts.length, "\n")
    // })
  }, []); // [posts]
  useEffect(() => {
    const loadCommunity = (communityIndex, searchString, post, replyToPost, commentRepliedTo) => {
      // if communityIndex === -1, it's the All Posts View
      if(communityIndex === -1){
        CreatePostButtonColorEmitter.emit('clickedColor', false)
        CreateCommunityButtonColorEmitter.emit('clickedColor', false)
        CreateHomeButtonColorEmitter.emit('clickedColor', false)
        CommunityNameButtonColorEmitter.emit('clickedColor', false, communityIndex)
        axios.get("http://localhost:8000/posts").then(postsRes => {
          setPosts(postsRes.data);
          axios.get("http://localhost:8000/communities").then(communitiesRes => {
            setCommunities(communitiesRes.data);
            axios.get("http://localhost:8000/comments").then(commentsRes => {
              setComments(commentsRes.data);
              updatePageHeader(
                <section id="hide-for-creating-community">
                  <div className="community-information" style={{display:"block"}}>
                      <div id="community-name-sorting-buttons-line">
                        <h3 className="post-heading" id="community-name">All Posts</h3>
                        <PageNameSortingButtons communityIndex={-1} postsFromSearch={[]}/>
                      </div>
                      <h4 className="community-heading" id="community-post-count">{postsRes.data.length + " Post" 
                      + ((postsRes.data.length === 1) ? "" : "s")}</h4>
                      <hr id = "delimeter"/>
                      {/* <SortedPostListing model={model} communityIndex={-1} postsFromSearch={[]}/> */}
                      <SortedPostListing communityIndex={-1} postsFromSearch={[]} communities={communitiesRes.data} posts={postsRes.data} comments={commentsRes.data}/>
                  </div>
                </section>
              );
              NavBarEmitter.emit('updateNavBar')
            })
          })
        })
      } 
      // if communityIndex === -2, it's the Create New Post View
      else if (communityIndex === -2){
          CreatePostButtonColorEmitter.emit('clickedColor', true)
          CreateCommunityButtonColorEmitter.emit('clickedColor', false)
          CreateHomeButtonColorEmitter.emit('clickedColor', true)
          CommunityNameButtonColorEmitter.emit('clickedColor', false, communityIndex)
          updatePageHeader(
          <section id="hide-for-creating-community"> 
            {/* <CreatePostComponent model={model} /> */}
            <CreatePostComponent />
          </section>
        )
        NavBarEmitter.emit('updateNavBar')
      } 
      // if communityIndex === -3, it's the create new community view
      else if(communityIndex === -3){
          CreatePostButtonColorEmitter.emit('clickedColor', false)
          CreateCommunityButtonColorEmitter.emit('clickedColor', true)
          CreateHomeButtonColorEmitter.emit('clickedColor', true)
          CommunityNameButtonColorEmitter.emit('clickedColor', false, communityIndex)
          updatePageHeader(
        <section id="hide-for-creating-community"> 
          {/* <CreateCommunityComponent model={model}/> */}
          <CreateCommunityComponent />
        </section>
        )
        NavBarEmitter.emit('updateNavBar')
      } 
      // Inside the communityClickedEmitter handler
      else if(communityIndex === -4){
          CreatePostButtonColorEmitter.emit('clickedColor', false)
          CreateCommunityButtonColorEmitter.emit('clickedColor', false)
          CreateHomeButtonColorEmitter.emit('clickedColor', true)
          CommunityNameButtonColorEmitter.emit('clickedColor', false, communityIndex)
          axios.get("http://localhost:8000/posts").then(postsRes => {
            setPosts(postsRes.data);
            axios.get("http://localhost:8000/communities").then(communitiesRes => {
              setCommunities(communitiesRes.data);
              axios.get("http://localhost:8000/comments").then(commentsRes => {
                setComments(commentsRes.data);
                var postThreadsArray = GetPostThreadsArrayFunction(communitiesRes.data, postsRes.data, commentsRes.data, "All Posts", []);
                console.log("\n in main control search postThreadsArray: ", postThreadsArray, "\n");
                updatePageHeader(
                  <HandleSearchLogic searchString={searchString} communityIndex={communityIndex} printPostThreadsArray={postThreadsArray} communities={communitiesRes.data} posts={postsRes.data} comments={commentsRes.data}/>)
                // if (postsFromSearch.length === 0) {
                //   updatePageHeader(
                //     <div>
                //       <h3 className="post-heading" id="community-name">No results found for: {searchString}</h3>
                //       <p id="post-number">0 Posts</p>
                //       <hr id="delimeter"></hr>
                //       <section id="posts-listing-section">
                //         <img src='image/0 search results.jpg' alt='No results found' />
                //       </section>
                //     </div>
                //   );
                // } else {
                //   var postNum = postsFromSearch.length + " Post" + (postsFromSearch.length === 1 ? "" : "s");
                //   updatePageHeader(
                //     <div>
                //       <div id="community-name-sorting-buttons-line">
                //         <h3 className="post-heading" id="community-name">Results for: {searchString}</h3>
                //         {PageNameSortingButtons(-1, postsFromSearch)}
                //       </div>
                //       <p id="post-number">{postNum}</p>
                //       <hr id="delimeter" />
                //       <section id="posts-listing-section">
                //         <SortedPostListing model={model} communityIndex={communityIndex} postsFromSearch={postsFromSearch} />
                //       </section>
                //     </div>
                //   );
                // }
                NavBarEmitter.emit('updateNavBar');
              })
            })
          })
        }
      // if communityIndex === -6, it's post view
      else if(communityIndex === -6){
        CreatePostButtonColorEmitter.emit('clickedColor', false)
        CreateCommunityButtonColorEmitter.emit('clickedColor', false)
        CreateHomeButtonColorEmitter.emit('clickedColor', true)
        CommunityNameButtonColorEmitter.emit('clickedColor', false, communityIndex)
        axios.get("http://localhost:8000/posts").then(postsRes => {
          setPosts(postsRes.data);
          if(postsRes.data !== null){
            // increment the post views by one
          for(let postIndex = 0; postIndex < postsRes.data.length; postIndex++){
            if(postsRes.data[postIndex].id === post.id){
              axios.patch(`http://localhost:8000/posts/${post.id}/view`)
              .then(response => {
                console.log('View count incremented:', response.data);
                // res.data[postIndex].views += 1;
              })
              .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
              });
            }
          }
          // figure out which community this post is from
          var communityName = '';
          var communityDate = '';
          axios.get("http://localhost:8000/communities").then(communitiesRes => {
            setCommunities(communitiesRes.data);
            if(communitiesRes.data !== null){
              console.log("\n this is post in loading: ", post, "\n");
              for(let comIndex = 0; comIndex < communitiesRes.data.length; comIndex++){
                if(communitiesRes.data[comIndex].postIDs.includes(post.id)){
                  communityName = communitiesRes.data[comIndex].name;
                  communityDate = communitiesRes.data[comIndex].startDate;
                  break;
                }
              }
              axios.get("http://localhost:8000/comments").then(res => {
                setComments(res.data);
                // console.log("\n phreddit comments: ", res.data, "\n");
              var postThreadsArray = GetPostThreadsArrayFunction(communitiesRes.data, postsRes.data, res.data, communityName, []);
              console.log("\n postThreadsArray after in phreddit: ", postThreadsArray, "\n");
              axios.get("http://localhost:8000/linkFlairs").then(res => {
                // console.log("\n phreddit linkflairs: ", res.data, " \n");
                setLinkFlairs(res.data);
                if(res.data !== null){
                  var linkflairContent = '';
                  // get the linkflair content
                  for(let index = 0; index < res.data.length; index++){
                    if(res.data[index].id === post.linkFlairID){
                      linkflairContent = res.data[index].content;
                      break;
                    }
                  }
                  // console.log("\n got linkflairContent: ", linkflairContent, "\n");
                  // would get post threads array here but hook error so moved up
                  var commentRepliesCount = post.commentIDs.length;
                  console.log("\n post view postThreadsArray: ", postThreadsArray, "\n");
                  for(let postIndex = 0; postIndex < postThreadsArray.length; postIndex++){
                    console.log("\n postThreadsArray[postIndex][0]: ", postThreadsArray[postIndex][0], " post.id: ", post.id, "\n");
                    if(postThreadsArray[postIndex][0].postThreadNode.id === post.id){
                      commentRepliesCount = postThreadsArray[postIndex].length - 1;
                      console.log("\ncommentRepliesCount: ", commentRepliesCount, "\n");
                    }
                  } 
                  axios.get("http://localhost:8000/comments").then(res => {
                    setComments(res.data);
                    if(res.data !== null){
                      // console.log("\n this res.data should be comments: ", res.data, "\n");
                      // make a mapping of commentIDs to commentedDates
                      var commentIDstoDates = new Map();
                      for(let commentsIndex = 0; commentsIndex < res.data.length; commentsIndex++){
                        commentIDstoDates.set(res.data[commentsIndex].id, res.data[commentsIndex]);
                      }
                      // get the thread as a flattened array in order of post and comments 
                      // var postResultArray = makePostThreads(post, post.commentIDs, commentIDstoDates);
                      var commentIDstoDatesMap = new Map();
                      for(let commentsIndex = 0; commentsIndex < res.data.length; commentsIndex++){
                        commentIDstoDatesMap.set(res.data[commentsIndex].id, new Date(res.data[commentsIndex].commentedDate));
                      }
                      // console.log("\n commentIDstoDates: ", commentIDstoDates, " commentIDstoDatesMap: ", commentIDstoDatesMap, "\n");
                      // console.log("\n here post: ", post, "\n");
                      // get the most updated version of post
                      for(let q = 0; q < postsRes.data.length; q++){
                        // console.log("\n postsRes.data[q]: ", postsRes.data[q], " post.id ", post.id, "\n");
                        if(postsRes.data[q].id === post.id){
                          post = postsRes.data[q];
                        }
                      }
                      // console.log("\n now post: ", post, "\n");
                      var postResultArray = GetSortedThreadRoot(post, post.commentIDs, commentIDstoDates, commentIDstoDatesMap);
                      // console.log("\npostResultArray: ", postResultArray, "\n");
                      // if there are comments, display them
                      // if there aren't comments, getSortedThreadRoot will return null for postResultArray
                      if(postResultArray !== null){
                        var rootNode = postResultArray[0];
                        var arrayOfNodes = [];
                        postThreadDFS(rootNode, 0, arrayOfNodes);
                        // console.log("\narrayOfNodes: ", arrayOfNodes, "\n");
                        // now order the comments from newest to oldest
                        // need only the comments, so take out the post
                        var sortedNodeArray = arrayOfNodes.slice(1);
                        // console.log("\n sortedNodeArray: ", sortedNodeArray, "\n");
                      } 
                      updatePageHeader(
                      <section id="post-page-view">
                        <h3 className="post-heading" id="post-timestamp">{communityName + " | " + displayTime(communityDate)}</h3>
                        <p className="post-heading" id="post-user">{post.postedBy}</p>
                        <h3 className="post-heading" id="post-title">{post.title}</h3>
                        {post.linkFlairID && (
                          <p className="post-heading" id="post-link-flair" >{linkflairContent}</p>
                        )}
                        <p className="post-heading" id="post-content">{post.content}</p>
                        <p className="post-heading" id="post-view-comment">{(post.views + 1) + " View" + 
                          (((post.views + 1) !== 1) ? "s" : "") + " | " + commentRepliesCount + 
                          " Comment" + ((commentRepliesCount !== 1) ? "s" : "")}</p>
                        <button className="post-heading" id="add-comment"
                        onClick={() => {communityClickedEmitter.emit('communityClicked', -7, "", post, true, null)}}>Add Comment</button>
                        <hr id = "delimeter"/>
                        {/* display all the comments & replies */}
                        <section id="posts-listing-section">
                        {(postResultArray !== null) && <MakeCommentsListing sortedNodeArray={sortedNodeArray} post={post}/> }
                        </section>
                      </section>
                      )
                      NavBarEmitter.emit('updateNavBar')
                      }
                  });
                  }
              });
              }
          )}
          });
        }
        });
      }
      // if communityIndex === -7, it's add new comment view
      else if(communityIndex === -7){
          CreatePostButtonColorEmitter.emit('clickedColor', false)
          CreateCommunityButtonColorEmitter.emit('clickedColor', false)
          CreateHomeButtonColorEmitter.emit('clickedColor', true)
          CommunityNameButtonColorEmitter.emit('clickedColor', false, communityIndex)
          updatePageHeader(
          <AddNewCommentComponent post={post} replyToPost={replyToPost} commentRepliedTo={commentRepliedTo}/>
        )
      }
      // otherwise, it's for loading a specific community page view
      else{
        // console.trace("\n opening community\n");
          CreatePostButtonColorEmitter.emit('clickedColor', false)
          CreateCommunityButtonColorEmitter.emit('clickedColor', false)
          CreateHomeButtonColorEmitter.emit('clickedColor', true)
          // console.log("\n clicking CommunityNameButtonColorEmitter now! \n");
          CommunityNameButtonColorEmitter.emit('clickedColor', true, communityIndex)
          // console.log("\n done CommunityNameButtonColorEmitter now! \n");
          axios.get("http://localhost:8000/posts").then(postsRes => {
            setPosts(postsRes.data);
            axios.get("http://localhost:8000/communities").then(communitiesRes => {
              setCommunities(communitiesRes.data);
              axios.get("http://localhost:8000/comments").then(commentsRes => {
                setComments(commentsRes.data);
                updatePageHeader(
                  <div className="community-information" style={{display:"block"}}>
                    <div id="community-name-sorting-buttons-line">
                      <h3 className="post-heading" id="community-name">{communitiesRes.data[communityIndex].name}</h3>
                      {/* {PageNameSortingButtons(communityIndex, [])} */}
                      <PageNameSortingButtons communityIndex={communityIndex} postsFromSearch={[]}/>
                    </div>
                    <h4 className="community-heading" id="community-description">{communitiesRes.data[communityIndex].description}</h4>
                    <h4 className="community-heading" id="community-age">{"Created " + displayTime(communitiesRes.data[communityIndex].startDate)}</h4>
                    <h4 className="community-heading" id="community-post-count">{communitiesRes.data[communityIndex].postIDs.length + ((communitiesRes.data[communityIndex].postIDs.length === 1) ? " Post | " 
                : " Posts | ") + communitiesRes.data[communityIndex].members.length + ((communitiesRes.data[communityIndex].members.length === 1) ? " Member" 
                : " Members")}</h4>
                    <hr id = "delimeter"/>
                    {/* {console.log("\n check communityIndex:", communityIndex, "\n")} */}
                    <SortedPostListing communityIndex={communityIndex} postsFromSearch={[]} communities={communitiesRes.data} posts={postsRes.data} comments={commentsRes.data}/>
                    {sortPostEmitter.emit("sortPosts", true, false, communityIndex, [])}
                  </div>
                )
                NavBarEmitter.emit('updateNavBar')
              })
            })
          })
      }
    };
    communityClickedEmitter.on("communityClicked", loadCommunity);
    return () => {communityClickedEmitter.off("communityClicked", loadCommunity);};
  }, [comments, communities, linkFlairs, posts]); // removed model from dependency array and replaced with model data values [comments, communities, linkFlairs, posts]
  return (
    <> {pageHeader} </>
  );
}

// export function PostView({ post }) {
//   const [posts, setPosts] = useState([]);
//   const [communities, setCommunities] = useState([]);
//   const [linkFlairs, setLinkFlairs] = useState([]);
//   const [comments, setComments] = useState([]);
//   // const [postThreadsArray, setPostThreadsArray] = useState([]);
//   const [postResultArray, setPostResultArray] = useState(null);
//   const [sortedNodeArray, setSortedNodeArray] = useState(null);
//   var postThreadsArray = GetPostThreadsArray("All Posts", []);
//   useEffect(() => {
//     axios.get("http://localhost:8000/posts").then((res) => {
//       setPosts(res.data);
//       if(res.data !== null){
//         // increment the post views by one
//         for(let postIndex = 0; postIndex < res.data.length; postIndex++){
//           if(res.data[postIndex].id === post.id){
//             axios.patch(`http://localhost:8000/posts/${post.id}/view`)
//             .then(response => {
//               console.log('View count incremented:', response.data);
//               // res.data[postIndex].views += 1;
//             })
//             .catch(error => {
//               console.error('Error:', error.response ? error.response.data : error.message);
//             });
//           }
//         }
//       }
//     });
//     Promise.all([
//       axios.get("http://localhost:8000/communities"),
//       axios.get("http://localhost:8000/linkFlairs")
//     ]).then(([communitiesRes, linkFlairsRes]) => {
//       var communityName, communityDate;
//       setCommunities(communitiesRes.data);
//       setLinkFlairs(linkFlairsRes.data);
//       if(communitiesRes.data !== null){
//         console.log("\n this is post in loading: ", post, "\n");
//         for(let comIndex = 0; comIndex < communitiesRes.data.length; comIndex++){
//           if(communitiesRes.data[comIndex].postIDs.includes(post.id)){
//             communityName = communitiesRes.data[comIndex].name;
//             communityDate = communitiesRes.data[comIndex].startDate;
//             break;
//           }
//         }
//       }
//       if(linkFlairsRes.data !== null){
//         var linkflairContent = '';
//         // get the linkflair content            
//         for(let index = 0; index < linkFlairsRes.data.length; index++){
//           if(linkFlairsRes.data[index].id === post.linkFlairID){
//             linkflairContent = linkFlairsRes.data[index].content;
//             break;
//           }
//         }
//       }
//     })
//     .catch((error) => {
//       console.error('Error fetching communities or link flairs:', error);
//     });
//     // Fetch comments and construct the thread
//     axios.get("http://localhost:8000/comments").then((res) => {
//       const commentsData = res.data;
//       setComments(commentsData);
//       // Process the threads array based on comments and post data
//       const commentIDstoDatesMap = new Map();
//       commentsData.forEach((comment) => {
//         commentIDstoDatesMap.set(comment.id, comment.commentedDate);
//       });
//       const postResultArray = GetSortedThreadRoot(post, post.commentIDs, commentIDstoDatesMap);
//       setPostResultArray(postResultArray);
//     });

//   }, [post.id]); // Only refetch if post.id changes

//   // This logic depends on your thread structure and `GetSortedThreadRoot` function
//   useEffect(() => {
//     if (postResultArray) {
//       const arrayOfNodes = [];
//       postThreadDFS(postResultArray[0], 0, arrayOfNodes);
//       setPostThreadsArray(arrayOfNodes);

//       // Now, order the comments from newest to oldest
//       const sortedNodes = arrayOfNodes.slice(1); // Exclude the post from the comments
//       setSortedNodeArray(sortedNodes);
//     }
//   }, [postResultArray]);

// }

// // for opening post view 
// export function PostView(){
//   var postThreadsArray = GetPostThreadsArray("All Posts", []);
//   axios.get("http://localhost:8000/posts").then(res => {
//     setPosts(res.data);
//     if(res.data !== null){
//       // increment the post views by one
//     for(let postIndex = 0; postIndex < res.data.length; postIndex++){
//       if(res.data[postIndex].id === post.id){
//         axios.patch(`http://localhost:8000/posts/${post.id}/view`)
//         .then(response => {
//           console.log('View count incremented:', response.data);
//           // res.data[postIndex].views += 1;
//         })
//         .catch(error => {
//           console.error('Error:', error.response ? error.response.data : error.message);
//         });
//       }
//     }
//     // figure out which community this post is from
//     var communityName = '';
//     var communityDate = '';
//     axios.get("http://localhost:8000/communities").then(res => {
//       setCommunities(res.data);
//       if(res.data !== null){
//         console.log("\n this is post in loading: ", post, "\n");
//         for(let comIndex = 0; comIndex < res.data.length; comIndex++){
//           if(res.data[comIndex].postIDs.includes(post.id)){
//             communityName = res.data[comIndex].name;
//             communityDate = res.data[comIndex].startDate;
//             break;
//           }
//         }
//         axios.get("http://localhost:8000/linkFlairs").then(res => {
//           setLinkFlairs(res.data);
//           if(res.data !== null){
//             var linkflairContent = '';
//             // get the linkflair content
//             for(let index = 0; index < res.data.length; index++){
//               if(res.data[index].id === post.linkFlairID){
//                 linkflairContent = res.data[index].content;
//                 break;
//               }
//             }
//             // would get post threads array here but hook error so moved up
//             var commentRepliesCount = 0;
//             console.log("\n post view postThreadsArray: ", postThreadsArray, "\n");
//             for(let postIndex = 0; postIndex < postThreadsArray.length; postIndex++){
//               if(postThreadsArray[postIndex][0].postThreadNode.id === post.id){
//                 console.log("\ncommentRepliesCount: ", commentRepliesCount, "\n");
//                 commentRepliesCount = postThreadsArray[postIndex].length - 1;
//               }
//             } 
//             axios.get("http://localhost:8000/comments").then(res => {
//               setComments(res.data);
//               if(res.data !== null){
//                 console.log("\n this res.data should be comments: ", res.data, "\n");
//                 // make a mapping of commentIDs to commentedDates
//                 var commentIDstoDates = new Map();
//                 for(let commentsIndex = 0; commentsIndex < res.data.length; commentsIndex++){
//                   commentIDstoDates.set(res.data[commentsIndex].id, res.data[commentsIndex]);
//                 }
//                 // get the thread as a flattened array in order of post and comments 
//                 // var postResultArray = makePostThreads(post, post.commentIDs, commentIDstoDates);
//                 var commentIDstoDatesMap = new Map();
//                 for(let commentsIndex = 0; commentsIndex < res.data.length; commentsIndex++){
//                   commentIDstoDatesMap.set(res.data[commentsIndex].id, res.data[commentsIndex].commentedDate);
//                 }
//                 console.log("\n commentIDstoDates: ", commentIDstoDates, " commentIDstoDatesMap: ", commentIDstoDatesMap, "\n");
//                 var postResultArray = GetSortedThreadRoot(post, post.commentIDs, commentIDstoDates, commentIDstoDatesMap);
//                 console.log("\npostResultArray: ", postResultArray, "\n");
//                 // if there are comments, display them
//                 // if there aren't comments, getSortedThreadRoot will return null for postResultArray
//                 if(postResultArray !== null){
//                   var rootNode = postResultArray[0];
//                   var arrayOfNodes = [];
//                   postThreadDFS(rootNode, 0, arrayOfNodes);
//                   console.log("\narrayOfNodes: ", arrayOfNodes, "\n");
//                   // now order the comments from newest to oldest
//                   // need only the comments, so take out the post
//                   var sortedNodeArray = arrayOfNodes.slice(1);
//                   console.log("\n sortedNodeArray: ", sortedNodeArray, "\n");
//                   return sortedNodeArray;
//                 }
//                 }
//             });
//             }
//         });
//         }
//     });
//   }
//   });
// }

// component for the top horizontal banner
export function TopBanner(){
  return (
  <div className="banner">
    <section className="logo-title">
      <img src = "image\Official Phreddit Logo.png" alt="Phreddit Logo" id="Phreddit_logo"
      onClick={() => {communityClickedEmitter.emit("communityClicked", -1, "", null, false)}}
      style={{cursor:"pointer"}}></img>
      <h3 className="Company_Name" id="phreddit-website-name"
      onClick={() => {communityClickedEmitter.emit("communityClicked", -1, "", null, false)}}
      style={{cursor:"pointer"}}> Phreddit</h3>
    </section>
    <section className="search-container">
      <img src="image\Search Logo.png" className="input-icon" alt="Search"></img>  
      <SearchBoxComponent />
    </section>
    <CreatePostButton />
  </div>);
}

export function PostHeader(){
  return(
    <div className="main-homepage" id="page-view">
      <section className="post-header">
        {GetCommunitiesAndLoad()}
      </section>
    </div>);
}

export function PageNameSortingButtons({communityIndex, postsFromSearch}){
  console.log("\n PageNameSortingButtons: ", "communityIndex: ", 
    communityIndex, " ", "postsFromSearch: ",postsFromSearch, "\n");
  var [buttons, setButtons] = useState('');
  useEffect(() => {
    console.log("\n page sorting: \n");
    setButtons(
      <div className="sorting-buttons">
        <button className="post-heading" id="newest-posts"
        onClick={() => {console.log("\n NEW BUTTON SORTING\n"); sortPostEmitter.emit("sortPosts", true, false, communityIndex, postsFromSearch)}}>Newest</button>
        <button className="post-heading" id="oldest-posts"
        onClick={() => {console.log("\n OLD BUTTON SORTING\n"); sortPostEmitter.emit("sortPosts", false, false, communityIndex, postsFromSearch)}}>Oldest</button>
        <button className="post-heading" id="active-posts"
        onClick={() => {console.log("\n ACTIVE BUTTON SORTING\n"); sortPostEmitter.emit("sortPosts", false, true, communityIndex, postsFromSearch)}}>Active</button>
      </div>
    )
  }, [communityIndex, postsFromSearch]) 
  return(
    <>{buttons}</>
  );
}


export function SearchBoxComponent(){
  const [searchInput, changeInput] = useState("");
  const typingSearch = (event) =>{
    console.log("\nsearchInput before: ", searchInput, "\n");
    const newSearch = event.target.value;
    changeInput(newSearch);
    console.log("\nsearchInput after: ", searchInput, "\n");
  }
  const enteredSearch = (event) => {
    if(event.key === "Enter"){
      event.preventDefault();
      const newSearch = event.target.value;
      console.log("\nsearch entered!\n");
      changeInput("");
      communityClickedEmitter.emit("communityClicked", -4, newSearch, null, false);
    } 
  }
  return (
    <form id="search-form">
        <input type="text" value={searchInput} onChange={typingSearch} className="search-bar" placeholder="Search Phreddit..." 
        onKeyDown={enteredSearch} id="search-phreddit-box" />
    </form>
  )
}

  