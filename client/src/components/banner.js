import React, {useEffect, useState} from "react";
import {displayTime, postThreadDFS} from "./postThreading.js";
import EventEmitter from "events";
import {communityClickedEmitter, CreateCommunityComponent} from "./newCommunity.js";
import {CreatePostComponent, CreatePostButtonColorEmitter, CreatePostButton} from "./newPost.js";
import {WelcomePageEmitter} from "./welcomePage.js";
import axios from 'axios';

// component for the top horizontal banner
export function TopBanner(userStatus, user){
  if(userStatus === "guest"){
    // user profile should be guest and non-functional 
    // create post should be gray and non-functional
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
        <button className="guest-banner-element" id="guest-profile-button">Guest</button>
        <button className="guest-banner-element" id="guest-create-post-button">Create Post</button>
      </div>);
  } else if(userStatus === "login"){
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
        <UserProfileButton user={user}/>
        <LogoutButton />
      </div>);
  }
}

export const UserProfileButtonColorEmitter = new EventEmitter();
UserProfileButtonColorEmitter.setMaxListeners(25);

export const UserProfileButton = ({user}) => {
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
      UserProfileButtonColorEmitter.on('clickedColor', changeClickColor);
      return () => {
        UserProfileButtonColorEmitter.off('clickedColor', changeClickColor);
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
      UserProfileButtonColorEmitter.on('hover', changeHoverColor);
      return () => {
        UserProfileButtonColorEmitter.off('clickedColor', changeHoverColor);
      };
  }, [hoverColor]);
  return (
      <button id="user-profile-button" 
      onMouseEnter={() => {UserProfileButtonColorEmitter.emit("hover", true)}}
      onMouseLeave={() => {UserProfileButtonColorEmitter.emit("hover", false)}}
      onClick={() => {console.log("\n user profile button clicked! \n"); communityClickedEmitter.emit('communityClicked', -8, "", null, true, null, user, (user.firstName === "admin"))}}
      style={{backgroundColor:((clickColor === hoverColor) ? hoverColor: "orangered")}}>{user.displayName} </button>
  );
};  


export const LogoutButtonColorEmitter = new EventEmitter();
LogoutButtonColorEmitter.setMaxListeners(25);

export const LogoutButton = () => {
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
      LogoutButtonColorEmitter.on('clickedColor', changeClickColor);
      return () => {
        LogoutButtonColorEmitter.off('clickedColor', changeClickColor);
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
      LogoutButtonColorEmitter.on('hover', changeHoverColor);
      return () => {
        LogoutButtonColorEmitter.off('clickedColor', changeHoverColor);
      };
  }, [hoverColor]);
  return (
      <button id="logout-button" 
      onMouseEnter={() => {LogoutButtonColorEmitter.emit("hover", true)}}
      onMouseLeave={() => {LogoutButtonColorEmitter.emit("hover", false)}}
      onClick={() => {console.log("\n clicked log out! \n"); WelcomePageEmitter.emit('logout', true);}}
      style={{backgroundColor:((clickColor === hoverColor) ? hoverColor: "orangered")}}>Log Out </button>
  );
};  

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