import React, { useState, useEffect } from "react";
import { HomePage } from "./phreddit.js";
import axios from 'axios';
import EventEmitter from 'events';

export const WelcomePageEmitter = new EventEmitter();

export function WelcomePage(){
  console.log("\n welcomepage \n");
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [guest, setGuest] = useState(false);
  const [logout, setLogout] = useState(false);
  const [returning, setReturning] = useState(null);
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
  function resetAll() {
    setRegister(false);
    setLogin(false);
    setGuest(false);
    setLogout(false);
    setReturning(null);
  }
  useEffect(() => {
    const checkReturningUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/return-session', {withCredentials: true});
        console.log("\n return response: ", response, "\n");
        if(response){
          if (response.data.isAuthenticated) {
            console.log('User is authenticated:', response.data.user);
            setReturning(response.data.user);
          } else {
            console.log('User is not authenticated');
          }
        }
      } catch(error) {
        console.error('Error checking for user authentication status:', error);
      }
    };
    checkReturningUser();
  }, []);
  useEffect(() => {
    const handleLogout = async(status) => {
      setLogout(status);
      try {
        const res = await axios.post('http://localhost:8000/users/logout', {}, {withCredentials: true});
        console.log('Logout successful ', res);
      } catch (error) {
        console.error('Logout failed:', error.response?.data || error.message);
      }
    };
    WelcomePageEmitter.on('logout', handleLogout);
    return () => {
      WelcomePageEmitter.off('logout', handleLogout);
    };
  }, []); 
  useEffect(() => {
    if(returning){
      const copy = returning;
      resetAll();
      console.log("\n returning copy: ", copy, "\n");
      setPageContent(<HomePage userStatus={"login"} user={copy}/>)
    }
    else if(logout){
      console.log("\n logging out \n");
      resetAll();
      setPageContent(
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
      </>)
    } else if(register){
      resetAll();
      setPageContent(<RegisterUser />)
    } else if(login){
      resetAll()
      setPageContent(<LoginUser />)
    } else if(guest){
      resetAll()
      setPageContent(<HomePage userStatus={"guest"}/>)
    }
  }, [register, login, guest, logout, returning])
  return (<>{pageContent}</>)
}

// function to creating cookie for user
// const loginCookie = async (username, password) => {
//   try {
//     const response = await axios.post('http://localhost:8000/users/login', 
//       {username, password,}, {withCredentials: true});
//     console.log('Logged in successfully!');
//     const session = Cookies.get('session_id');
//     console.log("\n this is session cookie: ", session, "\n");
//   } catch (error) {
//     console.error('Login failed:', error);
//   }
// };

export const LoginUser = () => {
  const [loggedin, setLoggedin] = useState(false);
    const [formInputs, setFormInputs] = useState({
        email: '',
        password: '',
    });
    const [userObj, setUserObj] = useState(null);
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
      axios.post('http://localhost:8000/users/login', formInputs, {withCredentials:true})
      .then(res => {
        console.log('Logged in successfully!');
        // const session = Cookies.get('session_id');
        console.log("\n this is session : ", res.data, "\n");
        setLoggedin(true);
        setUserObj(res.data.user);
      }).catch(err => {
        window.alert(err.response.data.message);
      }) 
    };
    return (loggedin ? <HomePage userStatus={"login"} user={userObj}/> : 
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
      const user ={
        firstName: formInputs.firstName,
        lastName: formInputs.lastName,
        displayName: formInputs.displayName,
        email: formInputs.email,
        password: formInputs.password,
        confirmPassword: formInputs.confirmPassword,
      }
      console.log("\n submitUser: ", formInputs, "\n");
      axios.post('http://localhost:8000/users/register', user)
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