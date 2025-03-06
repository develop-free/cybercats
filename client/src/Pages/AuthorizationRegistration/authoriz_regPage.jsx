import React, { useState } from 'react';
import './authoriz_regPage.css'; // Make sure to adjust the path as needed

const Authorization = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div>
      <button id="back-button" className="back-button" onClick={() => window.history.back()}>
        <i className="fa-solid fa-arrow-left"></i> Вернуться назад
      </button>
      <div className="container" id="container">
        <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
          {isSignUp ? (
            <form>
              <h1>Create Account</h1>
              <div className="social-icons">
                <a href="#" className="icon"><i className="fa-brands fa-telegram"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-vk"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-yandex"></i></a>
              </div>
              <span>or use your email for registration</span>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button type="submit">Sign Up</button>
            </form>
          ) : (
            <form>
              <h1>Sign In</h1>
              <div className="social-icons">
                <a href="#" className="icon"><i className="fa-brands fa-telegram"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-vk"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-yandex"></i></a>
              </div>
              <span>or use your email password</span>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <a href="#">Forget Your Password?</a>
              <button type="submit">Sign In</button>
            </form>
          )}
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" id="login" onClick={toggleForm}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden" id="register" onClick={toggleForm}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
