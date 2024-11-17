import React, { useState, useEffect } from "react";
import EventEmitter from "events";
import { NavBarEmitter } from "./navBar.js";
import axios from 'axios';

export const communityClickedEmitter = new EventEmitter();
communityClickedEmitter.setMaxListeners(25);

export const CreateCommunityComponent = ({user}) => {
  console.log("\n CreateCommunityComponent user: ", user, "\n");
  const [formInputs, setFormInputs] = useState({
    name: "",
    description: '',
  });
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
  const createCommunity = async (user) => {
    if (!validateInputs()){
      return;
    }
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
        <button type="button" id="create-community-button" onClick={() => {createCommunity(user)}}>
          Engender Community
        </button>
      </div>
    </form>
  );
};