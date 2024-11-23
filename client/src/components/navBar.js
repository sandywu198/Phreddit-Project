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
export const CreateCommunityButton = ({user}) => {
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
      onClick={() => communityClickedEmitter.emit("communityClicked", -3, "", null, false, null, user)}
    >
      Create Community
    </button>
  );
};

// Navbar Component
export function NavBar({userStatus, user}) {
  const [refreshCount, setRefreshCount] = useState(0);
  const [curUser, setCurUser] = useState(user);
  const [curUserStatus, setCurUserStatus] = useState(userStatus);
  const [curNavBar, updateNavBar] = useState(
    <div className="navbar">
      <CreateHomeButton />
      <hr id="delimeter" />
      <div className="community">
        <h3 id="community-head">Communities</h3>
        {console.log("\n NavBar curUserStatus 2: ", curUserStatus, " ", (curUserStatus === "login"), "\n")}
        {(curUserStatus === "login") ? <CreateCommunityButton user={user} userStatus={curUserStatus}/> : <button id="community-button"> Create Community </button>}
        {/* {(curUserStatus === "guest") ? <button id="community-button">Create Community</button>: <CreateCommunityButton user={curUser} userStatus={curUserStatus}/>} */}
        <GetCommunities refreshCount={refreshCount} user={curUser} userStatus={curUserStatus}/>
      </div>
    </div>
  );
  console.log("\n NavBar curUserStatus: ", curUserStatus, " ", (curUserStatus === "login"), "\n")
  console.log(setCurUser, setCurUserStatus);
  useEffect(() => {
    const changeNavBar = () => {
      console.log("\n curUser: ", curUser, "\n");
      console.log("\n changeNavBar invoked \n");
      setRefreshCount(refreshCount + 1)
      updateNavBar(
        <div className="navbar">
          <CreateHomeButton />
          <hr id="delimeter" />
          <div className="community">
            <h3 id="community-head">Communities</h3>
            {console.log("\n NavBar curUserStatus 2: ", curUserStatus, " ", (curUserStatus === "login"), "\n")}
            {(curUserStatus === "login") ? <CreateCommunityButton user={curUser} userStatus={curUserStatus}/> : <button id="community-button">Create Community</button>}
            {/* {(curUserStatus === "guest") ? <button id="community-button">Create Community</button>: <CreateCommunityButton user={curUser} userStatus={curUserStatus}/>} */}
            <GetCommunities refreshCount={refreshCount} user={curUser} userStatus={curUserStatus}/>
          </div>
        </div>
      );
    };
    NavBarEmitter.on('updateNavBar', changeNavBar);
    return () => NavBarEmitter.off('updateNavBar', changeNavBar);
  }, [refreshCount, userStatus, user, curUser, curUserStatus]);
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
export function GetCommunities({refreshCount, user, userStatus}) {
  const [communityList, setCommunityList] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [curUser, setCurUser] = useState(user);
  const [curUserStatus, setCurUserStatus] = useState(userStatus);
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
      var uniqueCommunityNames;
      if(curUserStatus === "guest"){
        uniqueCommunityNames = Array.from(new Set(communities.map((community) => community.name)));
      } else{
        console.log("\n navbar: curUser ", curUser, " curUserStatus: ", curUserStatus, "\n");
        const joinedCommunities = Array.from(new Set(communities.filter((community) => community.members.includes(curUser.displayName)).map((community) => community.name)));
        console.log("\n joinedCommunities: ", joinedCommunities, "\n");
        const notJoinedCommunities = Array.from(new Set(communities.filter((community) => !community.members.includes(curUser.displayName)).map((community) => community.name)));
        console.log("\n notJoinedCommunities: ", notJoinedCommunities, "\n");
        uniqueCommunityNames = [...joinedCommunities, "break", ...notJoinedCommunities];
      }
      uniqueCommunityNames = uniqueCommunityNames.map(c => {
        return {name: c, index: communities.findIndex(community => community.name === c)};
      });
      console.log("\n navbar uniqueCommunityNames: ", uniqueCommunityNames, "\n");
      setCommunityList(uniqueCommunityNames);
    }
  }, [communities, refreshCount, curUser, curUserStatus]);
  console.log("\n communityList: ", communityList, "\n");
  return (
    <ul id="community-list">
      {console.log("\n return communityList: ", communityList, "\n")}
      {communityList.map(c => (
        <li key={c.index} id={c.index}>
          {c.index !== -1 && <CommunityNameButton communityIndex={c.index} communityName={c.name}/>}
          {c.index === -1 && <hr id="nav-delimeter"/>}
        </li>
      ))}
    </ul>
  );
}