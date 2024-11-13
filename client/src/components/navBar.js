import React, { useEffect, useState, useRef } from "react";
import EventEmitter from "events";
import { communityClickedEmitter } from "./newCommunity.js";
import axios from 'axios';

export const CreateHomeButtonColorEmitter = new EventEmitter();
CreateHomeButtonColorEmitter.setMaxListeners(25);
export const CreateCommunityButtonColorEmitter = new EventEmitter();
CreateCommunityButtonColorEmitter.setMaxListeners(25);
export const NavBarEmitter = new EventEmitter();
NavBarEmitter.setMaxListeners(25);
export const CommunityNameButtonColorEmitter = new EventEmitter();
CommunityNameButtonColorEmitter.setMaxListeners(25);

// Home Button
export const CreateHomeButton = () => {
  const [clickColor, setClickColor] = useState('orangered');
  const [hoverColor, setHoverColor] = useState('lightgray');

  useEffect(() => {
    const changeClickColor = (changeColor) => {
      setClickColor(changeColor ? 'lightgray' : 'orangered');
    };
    CreateHomeButtonColorEmitter.on('clickedColor', changeClickColor);
    return () => CreateHomeButtonColorEmitter.off('clickedColor', changeClickColor);
  }, []);

  useEffect(() => {
    const changeHoverColor = (changeColor) => {
      setHoverColor(changeColor ? 'lightgray' : 'orangered');
    };
    CreateHomeButtonColorEmitter.on('hover', changeHoverColor);
    return () => CreateHomeButtonColorEmitter.off('hover', changeHoverColor);
  }, []);

  return (
    <button
      className="home-link"
      id="home-webpage-link"
      onMouseEnter={() => CreateHomeButtonColorEmitter.emit("hover", false)}
      onMouseLeave={() => CreateHomeButtonColorEmitter.emit("hover", true)}
      style={{ backgroundColor: clickColor === 'orangered' || (clickColor === 'lightgray' && hoverColor === 'orangered') ? 'orangered' : 'lightgray' }}
      onClick={() => communityClickedEmitter.emit("communityClicked", -1, "", null, false)}
    >
      Home
    </button>
  );
};

// Community Button
export const CreateCommunityButton = () => {
  const [clickColor, setClickColor] = useState('lightgray');
  const [hoverColor, setHoverColor] = useState('lightgray');
  useEffect(() => {
    const changeClickColor = (changeColor) => {
      setClickColor(changeColor ? 'orangered' : 'lightgray');
    };
    CreateCommunityButtonColorEmitter.on('clickedColor', changeClickColor);
    return () => CreateCommunityButtonColorEmitter.off('clickedColor', changeClickColor);
  }, []);
  useEffect(() => {
    const changeHoverColor = (changeColor) => {
      setHoverColor(changeColor ? 'orangered' : 'lightgray');
    };
    CreateCommunityButtonColorEmitter.on('hover', changeHoverColor);
    return () => CreateCommunityButtonColorEmitter.off('hover', changeHoverColor);
  }, []);
  return (
    <button
      id="community-button"
      onMouseEnter={() => CreateCommunityButtonColorEmitter.emit("hover", true)}
      onMouseLeave={() => CreateCommunityButtonColorEmitter.emit("hover", false)}
      style={{ backgroundColor: clickColor === hoverColor ? hoverColor : "orangered" }}
      onClick={() => communityClickedEmitter.emit("communityClicked", -3, "", null, false)}
    >
      Create Community
    </button>
  );
};

// Navbar Component
export function NavBar() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [curNavBar, updateNavBar] = useState(
    <div className="navbar">
      <CreateHomeButton />
      <hr id="delimeter" />
      <div className="community">
        <h3 id="community-head">Communities</h3>
        <CreateCommunityButton />
        <GetCommunities refreshCount={refreshCount}/>
      </div>
    </div>
  );
  useEffect(() => {
    const changeNavBar = () => {
      console.log("\n changeNavBar invoked \n");
      setRefreshCount(refreshCount + 1)
      updateNavBar(
        <div className="navbar">
          <CreateHomeButton />
          <hr id="delimeter" />
          <div className="community">
            <h3 id="community-head">Communities</h3>
            <CreateCommunityButton />
            <GetCommunities refreshCount={refreshCount}/>
          </div>
        </div>
      );
    };
    NavBarEmitter.on('updateNavBar', changeNavBar);
    return () => NavBarEmitter.off('updateNavBar', changeNavBar);
  }, [refreshCount]);
  return (<section>{curNavBar}</section>);
}

// Community Name Button
export const CommunityNameButton = ({communityIndex, communityName}) =>{
  const [clickColor, updateClickColor] = useState('lightgray');
  const [hoverColor, updateHoverColor] = useState('lightgray');
  const itemID = useRef(communityIndex);
  console.log("\n making itemID: ", itemID, " communityIndex: ", communityIndex, "\n");
  useEffect(() => {
    const changeClickColor = (changeColor, communityIndex) => {
      console.log("\n changeColor from community name click: ", changeColor, "\n");
      console.log("\n communityIndex from community name hover: ", communityIndex, " itemID: ", itemID.current.id, "\n");
      if(changeColor && (String(communityIndex) === itemID.current.id)){
        updateClickColor("orangered");
        console.log("\n community name clickColor should be orangered: ", clickColor, "\n");
      } else{
        updateClickColor("lightgray");
      }
    };
    CommunityNameButtonColorEmitter.on('clickedColor', changeClickColor);
    return () => {
      CommunityNameButtonColorEmitter.off('clickedColor', changeClickColor);
    };
  }, [clickColor]);
  useEffect(() => {
    const changeHoverColor = (changeColor, communityIndex) => {
      if(changeColor && (communityIndex === itemID.current.id)){
        updateHoverColor("orangered");
      } else{
        updateHoverColor("lightgray");
      }
    };
    CommunityNameButtonColorEmitter.on('hover', changeHoverColor);
    return () => {
      CommunityNameButtonColorEmitter.off('hover', changeHoverColor);
    };
  }, [hoverColor]);
  return (
    <button id={communityIndex} ref={itemID}
    onMouseEnter={() => {CommunityNameButtonColorEmitter.emit("hover", true, itemID.current.id)}}
    onMouseLeave={() => {CommunityNameButtonColorEmitter.emit("hover", false, itemID.current.id)}}
    style={{backgroundColor:((clickColor === hoverColor) ? hoverColor: "orangered"), border:"none"}}
    onClick={() => {communityClickedEmitter.emit("communityClicked", communityIndex, "", null, false, null)}}>
      {communityName}</button>
  )
};

// Get Communities
export function GetCommunities({refreshCount}) {
  const [communityList, setCommunityList] = useState([]);
  const [communities, setCommunities] = useState([]);
  const getCommunities = async () => {
    try{
      const [communitiesRes] = await Promise.all([
        axios.get("http://localhost:8000/communities"),
      ]);
      setCommunities(communitiesRes.data);
    }
    catch(error){
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    console.log("\n refreshCount: ", refreshCount, "\n");
    getCommunities();
  }, [refreshCount]);
  useEffect(() => {
    console.log("\n GetCommunities communities b4: ", communities, "\n");
    if(communities !== null){
      console.log("\n GetCommunities communities after: ", communities, "\n");
      const uniqueCommunityNames = Array.from(new Set(communities.map((community) => community.name)));
      setCommunityList(uniqueCommunityNames);
    }
  }, [communities, refreshCount]);
  console.log("\n communityList: ", communityList, "\n");
  return (
    <ul id="community-list">
      {communityList.map((communityName, communityIndex) => (
        <li key={communityIndex} id={communityIndex}>
          <CommunityNameButton communityIndex={communityIndex} communityName={communityName} />
        </li>
      ))}
    </ul>
  );
}