import React, { useState, useEffect } from "react";
import { communityClickedEmitter } from "./newCommunity.js";
import { HomePage } from "./phreddit.js";
import axios from 'axios';

export function WelcomePage(){
    const [register, setRegister] = useState(false);
    const [login, setLogin] = useState(false);
    const [guest, setGuest] = useState(false);
    const [pageContent, setPageContent] = useState(
    <>
      <section className="logo-title">
        <img src = "image\Official Phreddit Logo.png" alt="Phreddit Logo" id="Phreddit_logo"
        style={{cursor:"pointer"}}></img>        {/* // onClick={() => {communityClickedEmitter.emit("communityClicked", -1, "", null, false)}} */}
        <h3 className="Company_Name" id="phreddit-website-name"
        style={{cursor:"pointer"}}> Phreddit</h3> {/* //onClick={() => {communityClickedEmitter.emit("communityClicked", -1, "", null, false)}}  */}
      </section>
      <button type="button" id="register-new-user" onClick={() => {setRegister(true)}}> Register </button>
      <button type="button" id="login-user" onClick={() => {setLogin(true)}}> Login </button>        {/* //  onClick={} */}
      <button type="button" id="guest-user" onClick={() => {setGuest(true)}}> Continue as Guest </button>       {/* //  onClick={} */}
    </>
    );
    useEffect(() => {
        if(register){
            setPageContent(<RegisterUser />)
        } else if(login){
            setPageContent(<LoginUser />)
        } else if(guest){
            setPageContent(HomePage())
        }
    }, [register, login, guest])
    return (<>
    {pageContent}
      {/* <section className="logo-title">
        <img src = "image\Official Phreddit Logo.png" alt="Phreddit Logo" id="Phreddit_logo"
        style={{cursor:"pointer"}}></img>        
        <h3 className="Company_Name" id="phreddit-website-name"
        style={{cursor:"pointer"}}> Phreddit</h3> 
      </section>
      <button type="button" id="register-new-user" onClick={() => {setRegister(true)}}> Register </button>
      {register && <RegisterUser />}
      <button type="button" id="login-user" onClick={() => {setLogin(true)}}> Login </button>       
      {login && <LoginUser />}
      <button type="button" id="guest-user" onClick={() => {HomePage()}}> Continue as Guest </button>       */}
    </>)
}

export const LoginUser = () => {
    const [formInputs, setFormInputs] = useState({
        email: '',
        password: '',
    });
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormInputs(prevInputs => ({
        ...prevInputs,
        [name]: value
      }));
    };
    // const validateInputs = () => {
    //   const { content, username } = formInputs;
    //   if (content.length === 0 || content.length > 500) {
    //     window.alert("The comment content must be between 1 and 500 characters.");
    //     return false;
    //   }
    //   if (username.length === 0) {
    //     window.alert("The username cannot be empty.");
    //     return false;
    //   }
    //   return true;
    // };
    const validateUser = async () => {
    //   if (!validateInputs()) return;
      try {
        // const newComment = {
        //   content: formInputs.content,
        //   commentedBy: formInputs.username
        // };
        // console.log('Attempting to submit comment:', newComment);
        // console.log('Replying to post:', replyToPost);
        // console.log('Post ID:', post._id);
        // const comment = await axios.post('http://localhost:8000/comments', newComment);
        // let add;
        // console.log('Comment ID:', comment.data._id);
        // console.log("REPLIED ID:", commentRepliedTo);
        // if (replyToPost) {
        //   console.log("COMMENTING");
        //   add = await axios.put(`http://localhost:8000/posts/${post._id}/comments`, {
        //     commentID: comment.data._id
        // });
        // } else {
        //   console.log("REPLYING");
        //   console.log("REPLIED ID:", commentRepliedTo._id);
        //   add = await axios.put(`http://localhost:8000/comments/${commentRepliedTo._id}/replies`, {
        //     commentID: comment.data._id
        // });
        // }
        // console.log("New comment added:", comment.data);
        // console.log("New comment added to post:", add.data);
        // communityClickedEmitter.emit("communityClicked", -6, "", post, false);
      } catch (error) {
        // console.error("Error adding comment:", error.response ? error.response.data : error.message);
        // window.alert("An error occurred while adding the comment. Please try again.");
      }
    };
    return (
      <form id="user-login-page-stuff">
        <div className="form-div">
            <label htmlFor="login-email">Email (Account Name): </label>
            <input type="text" 
            name="content"
            placeholder="Write your email here..." 
            id="login-email"
            value={formInputs.email} 
            onChange={handleInputChange}
            ></input>
        </div>
        <div className="form-div">
            <label htmlFor="login-password">Password: </label>
            <input type="password" 
            name="content"
            placeholder="Write your password here..." 
            id="login-password"
            value={formInputs.password} 
            onChange={handleInputChange}
            ></input>
        </div>
        <button type="button" id="user-login-button" onClick={validateUser}>
          Login
        </button>
      </form>
    );
}

export const RegisterUser = () => {
    const [formInputs, setFormInputs] = useState({
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormInputs(prevInputs => ({
        ...prevInputs,
        [name]: value
      }));
    };
    // const validateInputs = () => {
    //   const { content, username } = formInputs;
    //   if (content.length === 0 || content.length > 500) {
    //     window.alert("The comment content must be between 1 and 500 characters.");
    //     return false;
    //   }
    //   if (username.length === 0) {
    //     window.alert("The username cannot be empty.");
    //     return false;
    //   }
    //   return true;
    // };
    const submitUser = async () => {
    //   if (!validateInputs()) return;
      try {
        // const newComment = {
        //   content: formInputs.content,
        //   commentedBy: formInputs.username
        // };
        // console.log('Attempting to submit comment:', newComment);
        // console.log('Replying to post:', replyToPost);
        // console.log('Post ID:', post._id);
        // const comment = await axios.post('http://localhost:8000/comments', newComment);
        // let add;
        // console.log('Comment ID:', comment.data._id);
        // console.log("REPLIED ID:", commentRepliedTo);
        // if (replyToPost) {
        //   console.log("COMMENTING");
        //   add = await axios.put(`http://localhost:8000/posts/${post._id}/comments`, {
        //     commentID: comment.data._id
        // });
        // } else {
        //   console.log("REPLYING");
        //   console.log("REPLIED ID:", commentRepliedTo._id);
        //   add = await axios.put(`http://localhost:8000/comments/${commentRepliedTo._id}/replies`, {
        //     commentID: comment.data._id
        // });
        // }
        // console.log("New comment added:", comment.data);
        // console.log("New comment added to post:", add.data);
        // communityClickedEmitter.emit("communityClicked", -6, "", post, false);
      } catch (error) {
        // console.error("Error adding comment:", error.response ? error.response.data : error.message);
        // window.alert("An error occurred while adding the comment. Please try again.");
      }
    };
    return (
      <form id="new-user-register-page-stuff">
        <div className="form-div">
            <label htmlFor="register-new-first-name">First Name: </label>
            <input type="text" 
            name="content"
            placeholder="Write your first name here..." 
            id="register-new-first-name"
            value={formInputs.firstName} 
            onChange={handleInputChange}
            ></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-last-name">Last Name: </label>
            <input type="text" 
            name="content"
            placeholder="Write your last name here..." 
            id="register-new-last-name"
            value={formInputs.lastName} 
            onChange={handleInputChange}
            ></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-email">Email (Account Name): </label>
            <input type="text" 
            name="content"
            placeholder="Write your email here..." 
            id="register-new-email"
            value={formInputs.email} 
            onChange={handleInputChange}
            ></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-display-name">Display Name: </label>
            <input type="text" 
            name="content"
            placeholder="Write your display name here..." 
            id="register-new-display-name"
            value={formInputs.displayName} 
            onChange={handleInputChange}
            ></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-password">Password: </label>
            <input type="password" 
            name="content"
            placeholder="Write your password here..." 
            id="register-new-password"
            value={formInputs.password} 
            onChange={handleInputChange}
            ></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-confirm-password">Confirm Password: </label>
            <input type="password" 
            name="content"
            placeholder="Write your password here..." 
            id="register-new-confirm-password"
            value={formInputs.confirmPassword} 
            onChange={handleInputChange}
            ></input>
        </div>
        <button type="button" id="new-user-submit-button" onClick={submitUser}>
          Sign Up
        </button>
      </form>
    );
};