import React, { useState, useEffect, useCallback } from "react"; 
import axios from 'axios'; 
import EventEmitter from 'events'; 
import { communityClickedEmitter } from "./newCommunity.js"; 

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

export const CommunityListDropdown = ({ onInputChange }) => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  useEffect(() => {
      axios.get("http://localhost:8000/communities")
          .then(res => setCommunities(res.data))
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
          <select id="community-dropdown" value={selectedCommunity} onChange={handleChange} required> 
              <option value="">Select a community</option>
              {communities.map((community) => (
                  <option key={community._id} value={community._id}>{community.name}</option>
              ))}
          </select>
      </div>
  );
};

export const PostTitleComponent = ({ onInputChange }) => {
    const [title, setTitle] = useState("");

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

export const PostContentComponent = ({ onInputChange }) => {
    const [content, setContent] = useState("");

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

export const NewLinkFlair = ({ onInputChange }) => {
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

export const LinkFlairDropdown = ({ onInputChange }) => {
    const [linkFlairs, setLinkFlairs] = useState([]);
    const [selectedFlair, setSelectedFlair] = useState("");
    useEffect(() => {
        axios.get("http://localhost:8000/linkflairs")
            .then(res => setLinkFlairs(res.data))
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

export const CreatePostComponent = () => {
    const [formData, setFormData] = useState({
        community: '',
        title: '',
        content: '',
        linkFlairID: '',
        newLinkFlair: '',
        postedBy: ''
    });
    console.log("New Post Community ID:", formData.community);
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    const handleSubmit = async (event) => {
      event.preventDefault();
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
       <form id="new-post-page-stuff" onSubmit={handleSubmit}>
           <CommunityListDropdown onInputChange={(value) => handleInputChange('community', value)} />
           <PostTitleComponent onInputChange={(value) => handleInputChange('title', value)} />
           <PostContentComponent onInputChange={(value) => handleInputChange('content', value)} />
           <LinkFlairDropdown onInputChange={(value) => handleInputChange('linkFlairID', value)} />
           <NewLinkFlair onInputChange={(input) => handleInputChange('newLinkFlair', input)} />
           
           <div className="form-div">
               <label htmlFor="posted-by">Posted By:</label>
               <input 
                   type="text" 
                   id="posted-by" 
                   value={formData.postedBy} 
                   onChange={(e) => handleInputChange('postedBy', e.target.value)} 
                   required 
               />
           </div>

           <button type="submit">Create Post</button>
       </form>
   );
};

export default CreatePostComponent;