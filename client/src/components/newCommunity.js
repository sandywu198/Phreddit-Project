import React, { useState, useEffect } from "react";
import EventEmitter from "events";
import { NavBarEmitter } from "./navBar.js";
import axios from 'axios';
import { GetPostThreadsArrayFunction } from "./postSortingFunctions.js";

export const communityClickedEmitter = new EventEmitter();
communityClickedEmitter.setMaxListeners(25);

export const CreateCommunityComponent = ({user, community}) => {
  console.log("\n CreateCommunityComponent user: ", user, "\n");
  const [formInputs, setFormInputs] = useState({
    name: (community) ? community.name : "",
    description: (community) ? community.description :'',
  });
  // const [curCommunity, setCommunity] = useState(community);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };
  const validateInputs = () => {
    const { name, description } = formInputs;
    if (name.trim().length === 0 || name.length > 100) {
      window.alert("The community name must be between 1 and 100 characters.");
      return false;
    }
    if (description.length === 0 || description.length > 500) {
      window.alert("The community description must be between 1 and 500 characters.");
      return false;
    }
    return true;
  };
  const deleteCommunity = async (user, community) => {
    if (!validateInputs()){
      return;
    }
    if(community){
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
              if(postThreads[j][0].postThreadNode.communityName === community.name){
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
              }
          }
          // delete the community itself
            axios.delete(`http://localhost:8000/communities/${community.id}/community-id`)
            .then(response => {
              console.log("\n community: ", community, " deleted \n");
              communityClickedEmitter.emit("communityClicked", -1, "", null, false, null, user);
              NavBarEmitter.emit('updateNavBar');
            })
            .catch(error => {
              console.log("\n error deleting the community ", community, "\n");
            })
          })
        })
      })
    }
  }
  const createCommunity = async (user, community) => {
    if (!validateInputs()){
      return;
    }
    if(community){
      const communityObj = {name: formInputs.name.trim(), description: formInputs.description};
      axios.put(`http://localhost:8000/communities/${community.id}/edit-community`, communityObj)
      .then(response => {
          console.log('Community updated:', response.data);
          axios.get("http://localhost:8000/communities").then(communitiesRes => {
            var index = -1;
            for(let i = 0; i < communitiesRes.data.length; i++){
                if(communitiesRes.data[i].name === communityObj.name){
                    index = i;
                }
            }
            communityClickedEmitter.emit("communityClicked", index, "");
            NavBarEmitter.emit('updateNavBar');
          })
      })
      .catch(error => {
          console.error('Error updating community:', error.response.data);
      });
    } else{
      try {
        const existingCommunities = await axios.get("http://localhost:8000/communities");
        const communityExists = existingCommunities.data.some(
          community => community.name.toLowerCase() === formInputs.name.trim().toLowerCase()
        );
        if (communityExists) {
          window.alert("A community with this name already exists. Please choose a different name.");
          return;
        }
        const communityObj = {
          name: formInputs.name.trim(),
          description: formInputs.description,
          postIDs: [],
          startDate: new Date(),
          members: [user.displayName],
          memberCount: 1, 
          createdBy: user.displayName,
        };
        console.log("\n communityObj: ", communityObj, "\n");
        const response = await axios.post('http://localhost:8000/communities', communityObj);
        console.log("New community created:", response.data);
        // use existingCommunities.data.length as the community index since the index such be 
        // 0 or a positive integer indicating the index in the communities list
        communityClickedEmitter.emit("communityClicked", existingCommunities.data.length, "");
        NavBarEmitter.emit('updateNavBar');
      } catch (error) {
        console.error("Error creating community:", error);
        window.alert("An error occurred while creating the community. Please try again.");
      }
    }
  };
  useEffect(() => {
    const handleCommunityClicked = (id) => {
      console.log(`Community ${id} clicked`);
    };
    communityClickedEmitter.on("communityClicked", handleCommunityClicked);
    return () => {
      communityClickedEmitter.off("communityClicked", handleCommunityClicked);
    };
  }, []);
  return (
    <form id="new-community-form">
      <div className="form-div">
        <label htmlFor="new-community-name-box">Community Name: </label>
        <input 
          type="text" 
          name="name"
          placeholder="Name" 
          id="new-community-name-box" 
          value={formInputs.name} 
          onChange={handleInputChange}
        />
      </div>
      <div className="form-div">
        <label htmlFor="new-community-description-box">Community Description: </label>
        <textarea 
          name="description"
          placeholder="Write community description here..." 
          id="new-community-description-box" 
          value={formInputs.description} 
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="form-div">
        <button type="button" id="create-community-button" onClick={() => {createCommunity(user, community)}}>
          Engender Community
        </button>
      </div>
      {community && 
      <div className="form-div">
      <button type="button" id="create-community-button" onClick={() => {deleteCommunity(user, community)}}>
        Delete Community
      </button>
      </div>}
    </form>
  );
};