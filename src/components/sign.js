import { Link } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./Sign.css"
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";


const PasswordSignIn = () => {
  // since we are verifying through the email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // we also have to an error state 
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();
  
  // Instantiate the auth service SDK

//  we have s spearte part that takes change for the change in the input section
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sign in with email and password in firebase auth service
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // The signed-in user info
      const user = userCredential.user;
      const username = user.displayName; // Assuming username is stored in displayName
      setUser({ ...user, username }); // Set the user in context
      navigate("/"); // Redirect to home page
    } catch (err) {
     // Handle Errors here.
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);
      console.log(errorCode)

      switch (errorCode) {
        case "auth/invalid-email":
          setErrorMessage("This email address is invalid.");
          break;
        case "auth/user-disabled":
          setErrorMessage(
            "This email address is disabled by the administrator."
          );
          break;
        case "auth/user-not-found":
          setErrorMessage("This email address is not registered.");
          break;
        case "auth/wrong-password":
          setErrorMessage("The password is invalid or the user does not have a password.")
          break;
        default:
          setErrorMessage(errorMessage);
          break;
      }
    }
  };

  return (
    <div className='signinContainer'>
      <div className='signinContainer__box'>
        <div className='signinContainer__box__inner'>
          <h1>Sign In</h1>
          <form className='signinContainer__box__form' onSubmit={handleSubmit}>
            <input
              type='email'
              placeholder='Email'
              name='email'
              onChange={handleChange}
            />
            <input
              type='password'
              placeholder='Password'
              name='password'
              onChange={handleChange}
            />
            <button type='submit'>Sign In</button>
            {error && <p>{errorMessage}</p>}
          </form>

          <div className='signinContainer__box__signup'>
            <p>
              Don't have an account? <Link to='/signup'>Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSignIn;