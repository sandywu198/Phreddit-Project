import React, { useState, useEffect, useCallback } from "react"; 
import axios from 'axios'; 
import EventEmitter from 'events'; 
import { communityClickedEmitter } from "./newCommunity.js"; 
import { GetPostThreadsArrayFunction } from "./postSortingFunctions.js";
import {NavBarEmitter} from "./navBar.js";

export const CreatePostButtonColorEmitter = new EventEmitter();
CreatePostButtonColorEmitter.setMaxListeners(25);

export const CreatePostButton = () =>{
    const [clickColor, updateClickColor] = useState('lightgray');
    const [hoverColor, updateHoverColor] = useState('lightgray');
    useEffect(() => {
        const changeClickColor = (changeColor) => {
        console.log("\n changeColor from click: ", changeColor, "\n");
        if(changeColor){
            updateClickColor("orangered");
        } else{
            updateClickColor("lightgray");
        }
        };
        CreatePostButtonColorEmitter.on('clickedColor', changeClickColor);
        return () => {
        CreatePostButtonColorEmitter.off('clickedColor', changeClickColor);
        };
    }, []);
    useEffect(() => {
        const changeHoverColor = (changeColor) => {
        console.log("\n changeColor from hover: ", changeColor, "\n");
        if(changeColor){
            updateHoverColor("orangered");
        } else{
            updateHoverColor("lightgray");
        }
        };
        CreatePostButtonColorEmitter.on('hover', changeHoverColor);
        return () => {
        CreatePostButtonColorEmitter.off('clickedColor', changeHoverColor);
        };
    }, [hoverColor]);
    return (
        <button id="create-post" 
        onMouseEnter={() => {CreatePostButtonColorEmitter.emit("hover", true)}}
        onMouseLeave={() => {CreatePostButtonColorEmitter.emit("hover", false)}}
        onClick={() => {communityClickedEmitter.emit("communityClicked", -2, "", null, false);}}
        style={{backgroundColor:((clickColor === hoverColor) ? hoverColor: "orangered")}}>Create Post </button>
    );
};  

export const CommunityListDropdown = ({ post, user, onInputChange }) => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(post.communityName);
  useEffect(() => {
      axios.get("http://localhost:8000/communities")
          .then(res => {
            const userCommunities = res.data.filter(community => community.createdBy === user.displayName);
            console.log("\n userCommunities: ", userCommunities, "\n");
            const otherCommunities = res.data.filter(community => community.createdBy !== user.displayName);
            console.log("\n otherCommunities: ", otherCommunities, "\n");
            setCommunities([...userCommunities, ...otherCommunities]);
            })
          .catch(error => console.error("Error fetching communities:", error));
  }, []);
  const handleChange = (event) => {
      const communityId = event.target.value;
      console.log('Selected community ID:', communityId);
      setSelectedCommunity(communityId);
      onInputChange(communityId);
  };
  return (
      <div className="list-dropdown">
          <label htmlFor="community-dropdown">Choose Community</label>
          {console.log("\n selectedCommunity: ", selectedCommunity, "\n")}
          <select id="community-dropdown" value={selectedCommunity} onChange={handleChange} required> 
              <option value="">Select a community</option>
              {communities.map((community) => (
                  <option key={community.name} value={community.name}>{community.name}</option>
              ))}
          </select>
      </div>
  );
};

export const PostTitleComponent = ({ post, onInputChange }) => {
    const [title, setTitle] = useState(post.title);
    const handleChange = (event) => {
        setTitle(event.target.value);
        onInputChange(event.target.value);
    };
    return (
        <div className="form-div">
            <label htmlFor="new-post-title">Post Title:</label>
            <input 
                type="text" 
                id="new-post-title" 
                value={title} 
                onChange={handleChange} 
                maxLength={100} 
                required 
            />
        </div>
    );
};

export const PostContentComponent = ({post, onInputChange }) => {
    const [content, setContent] = useState(post.content);
    const handleChange = (event) => {
        setContent(event.target.value);
        onInputChange(event.target.value);
    };
    return (
        <div className="form-div">
            <label htmlFor="new-post-content">Post Content:</label>
            <textarea 
                id="new-post-content" 
                value={content} 
                onChange={handleChange} 
                required
            ></textarea>
        </div>
    );
};

export const NewLinkFlair = ({ post, onInputChange }) => {
    const [newLinkFlair, updateLinkFlair] = useState("");
    const changeLinkFlair = (event) => {
        const newLinkflair = event.target.value;
        updateLinkFlair(newLinkflair);
        onInputChange(newLinkflair);
    };
    return (
        <div className="form-div">
            <label htmlFor="new-link-flair-input">New Link Flair:</label>
            <input 
                type="text" 
                id="new-link-flair-input" 
                placeholder="Enter new link flair" 
                value={newLinkFlair} 
                onChange={changeLinkFlair} 
            />
        </div>
    );
};

export const LinkFlairDropdown = ({ post, onInputChange }) => {
    const [linkFlairs, setLinkFlairs] = useState([]);
    const [selectedFlair, setSelectedFlair] = useState("");
    useEffect(() => {
        axios.get("http://localhost:8000/linkflairs")
            .then(res => {
                setLinkFlairs(res.data);
                console.log("\n post: ", post, "\n");
                console.log("\n LinkFlairDropdown: ", res.data, "\n");
                const lfObj = res.data.find(lf => lf.id === post.linkFlairID);
                console.log("\n LinkFlairDropdown: ", lfObj, "\n");
                setSelectedFlair((lfObj) ? lfObj.content: "");
            })
            .catch(error => console.error("Error fetching link flairs:", error));
    }, []);
    const handleChange = (event) => {
        setSelectedFlair(event.target.value);
        onInputChange(event.target.value);
    };
    return (
        <div className="list-dropdown">
            <label htmlFor="link-flair-dropdown">Choose Link Flair</label>
            <select id="link-flair-dropdown" value={selectedFlair} onChange={handleChange}>
                <option value="">Select a flair</option>
                {linkFlairs.map((flair) => (
                    <option key={flair._id} value={flair._id}>{flair.content}</option>
                ))}
            </select>
        </div>
    );
};

export const CreatePostComponent = ({user, post}) => {
    console.log("\n CreatePostComponent post: ", post,"\n");
    const [curPost, setCurPost] = useState(post);
    console.log("\n CreatePostComponent curPost: ", curPost,"\n");
    const [formData, setFormData] = useState({
        community: (curPost) ? curPost.communityName: '',
        title: (curPost) ? curPost.title: '',
        content: (curPost) ? curPost.content: '',
        linkFlairID: (curPost) ? curPost.linkFlairID: '',
        newLinkFlair: '',
        postedBy: user.displayName,
    });
    console.log("New Post Community ID:", formData.community);
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    const deletePost = async (post) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if(confirmDelete){
            axios.get("http://localhost:8000/posts").then(postsRes => {
                axios.get("http://localhost:8000/communities").then(communitiesRes => {
                    axios.get("http://localhost:8000/comments").then(commentsRes => {
                    const posts = postsRes.data;
                    posts.forEach(post => {
                    // var community = communities.find(c => c.postIDs.includes(post.id));
                    var community1;
                    for(let c in communitiesRes.data){
                        // console.log("\n c.postIDs.includes(post.id): ", communities[c].postIDs.includes(post.id), "\n");
                        if(communitiesRes.data[c].postIDs.includes(post.id)){
                        community1 = communitiesRes.data[c].name;
                        // console.log("\n community: ", community, "\n");
                        } 
                    }
                    // console.log("\n community found: ", community, "\n");
                    if(community1){
                        post.communityName = community1;
                    }
                    // console.log("\n post now: ", post, "\n");
                    });
                    const postThreads = GetPostThreadsArrayFunction(communitiesRes.data, posts, commentsRes.data, "All Posts", []);
                    // delete posts and comments from the community to delete
                    console.log("\n postThreads: ", postThreads, "\n");
                    for(let j = 0; j < postThreads.length; j++){
                        console.log("\n postThreads[j][0].postThreadNode: ", postThreads[j][0].postThreadNode, "\n");
                        if(postThreads[j][0].postThreadNode.id === post.id){
                            console.log("\n qualify postThreads[j][0].postThreadNode: ", postThreads[j][0].postThreadNode, "\n");
                            axios.delete(`http://localhost:8000/posts/${postThreads[j][0].postThreadNode.id}`)
                            .then(response => {
                                console.log(response.data.message);
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
                                communityClickedEmitter.emit("communityClicked", -1, "", null, false, null, user);
                                NavBarEmitter.emit('updateNavBar');
                            })
                            .catch(error => {
                                console.log('Error deleting community:', error.response ? error.response.data : error.message);
                            });
                            console.log("\n rest postThreads[j]: ", postThreads[j], "\n");
                        }
                    }
                    })
                })
            })
        } else{
            console.log("\n user canceled delete post \n");
        }
    }
    const handleSubmit = async () => {
    //   event.preventDefault();
      if(formData.newLinkFlair && formData.linkFlairID){
        window.alert("At most one link flair can be chosen!");
        return;
        }
      try {
          let linkFlairID = formData.linkFlairID;
          if (formData.newLinkFlair) {
            const existingFlairs = await axios.get("http://localhost:8000/linkflairs");
            const isDuplicate = existingFlairs.data.some(flair => 
                flair.content.toLowerCase() === formData.newLinkFlair.toLowerCase()
            );
            if (isDuplicate) {
                window.alert("The new link flair already exists. Please choose a different one.");
                return;
            }
              const newFlairResponse = await axios.post('http://localhost:8000/linkflairs', {
                  content: formData.newLinkFlair
              });
              linkFlairID = newFlairResponse.data._id; 
          }
          const newPost = {
              title: formData.title,
              content: formData.content,
              linkFlairID: linkFlairID || null,
              postedBy: formData.postedBy,
              postedDate: new Date(),
              views: 0,
              commentIDs: [],
          };
          console.log('New post created:', newPost);
          console.log("New Post Community ID:", formData.community);
          const response = await axios.post('http://localhost:8000/posts', newPost);
          console.log('New post created:', response.data);
          console.log("POSTID @ NEWPOSTS", response.data._id);
          const communityResponse = await axios.put(`http://localhost:8000/communities/${formData.community}`, {
            postID: response.data._id
        });
        console.log('Community updated:', communityResponse.data);
        communityClickedEmitter.emit("communityClicked", -1, "");
      } catch (error) {
          console.error('Error creating post:', error.response ? error.response.data : error.message);
      }
  };
   return (
       <form id="new-post-page-stuff">
           <CommunityListDropdown post={post} user={user} onInputChange={(value) => handleInputChange('community', value)} />
           <PostTitleComponent post={post} onInputChange={(value) => handleInputChange('title', value)} />
           <PostContentComponent post={post} onInputChange={(value) => handleInputChange('content', value)} />
           <LinkFlairDropdown post={post}  onInputChange={(value) => handleInputChange('linkFlairID', value)} />
           <NewLinkFlair post={post} onInputChange={(input) => handleInputChange('newLinkFlair', input)} />
           <button type="button" onClick={() => handleSubmit()}>Create Post</button>
           {post && <button type="button" onClick={() => {deletePost(post)}}>Delete</button>}
       </form>
   );
};

export default CreatePostComponent;