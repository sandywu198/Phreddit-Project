import React, { useState, useEffect } from "react";
import { communityClickedEmitter } from "./newCommunity.js";
import { HomePage } from "./phreddit.js";
import axios from 'axios';

export function WelcomePage(){
  console.log("\n welcomepage \n");
    const [register, setRegister] = useState(false);
    const [login, setLogin] = useState(false);
    const [guest, setGuest] = useState(false);
    const [clear, setClear] = useState(false);
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
            setPageContent(<HomePage userStatus={"guest"}/>)
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
  const [loggedin, setLoggedin] = useState(false);
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
    const validateUser = () => {
      axios.post('http://localhost:8000/users/login', formInputs)
      .then(res => {
        setLoggedin(true);
      }).catch(err => {
        window.alert(err.response.data.message);
      }) 
    };
    return (loggedin ? <HomePage userStatus={"login"}/> : 
      (<form id="user-login-page-stuff">
        <div className="form-div">
            <label htmlFor="login-email">Email (Account Name): </label>
            <input type="text" 
            name="email"
            placeholder="Write your email here..." 
            id="login-email"
            value={formInputs.email} 
            onChange={handleInputChange}
            minLength={2} 
            required></input>
        </div>
        <div className="form-div">
            <label htmlFor="login-password">Password: </label>
            <input type="password" 
            name="password"
            placeholder="Write your password here..." 
            id="login-password"
            value={formInputs.password} 
            onChange={handleInputChange}
            minLength={1} 
            required></input>
        </div>
        <button type="button" id="user-login-button" onClick={validateUser}>
          Login
        </button>
      </form>)
    );
}

export const RegisterUser = () => {
  const [registered, setRegistered] = useState(false);
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
    const submitUser = () => {
      console.log("\n submitUser: ", formInputs, "\n");
      axios.post('http://localhost:8000/users/register', formInputs)
      .then(res => {
        window.alert("Successfully registered! Please login at the welcome page. You will now be redirected.");
        setRegistered(true);
      })
      .catch(err => {
        window.alert(err.response?.data?.message);
      }) 
    };
    return ( registered ? <WelcomePage /> :
      (<form id="new-user-register-page-stuff">
        <div className="form-div">
            <label htmlFor="register-new-first-name">First Name: </label>
            <input type="text" 
            name="firstName"
            placeholder="Write your first name here..." 
            id="register-new-first-name"
            value={formInputs.firstName} 
            onChange={handleInputChange}
            minLength={1} 
            required></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-last-name">Last Name: </label>
            <input type="text" 
            name="lastName"
            placeholder="Write your last name here..." 
            id="register-new-last-name"
            value={formInputs.lastName} 
            onChange={handleInputChange}
            minLength={1} 
            required></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-email">Email (Account Name): </label>
            <input type="text" 
            name="email"
            placeholder="Write your email here..." 
            id="register-new-email"
            value={formInputs.email} 
            onChange={handleInputChange}
            minLength={2} 
            required></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-display-name">Display Name: </label>
            <input type="text" 
            name="displayName"
            placeholder="Write your display name here..." 
            id="register-new-display-name"
            value={formInputs.displayName} 
            onChange={handleInputChange}
            minLength={1} 
            required></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-password">Password: </label>
            <input type="password" 
            name="password"
            placeholder="Write your password here..." 
            id="register-new-password"
            value={formInputs.password} 
            onChange={handleInputChange}
            minLength={2} 
            required></input>
        </div>
        <div className="form-div">
            <label htmlFor="register-new-confirm-password">Confirm Password: </label>
            <input type="password" 
            name="confirmPassword"
            placeholder="Confirm your password..." 
            id="register-new-confirm-password"
            value={formInputs.confirmPassword} 
            onChange={handleInputChange}
            minLength={2}  
            required></input>
        </div>
        <button type="button" id="new-user-submit-button" onClick={submitUser}>
          Sign Up
        </button>
      </form>)
    );
};