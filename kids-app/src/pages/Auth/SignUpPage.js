import React, { useRef, useEffect, useState } from "react";
import img from "../../utils/img/sign-side.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGlobalContext } from "../../utils/Context";
import Loading from "../../utils/Loading";
import { Alert1, Alert2 } from "../../utils/Alert";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const SignUpPage = () => {
  const navigate = useNavigate();

  // GLOBAL CONTEXT VARIABLES
  const {
    isPasswordShown,
    handlePassword,
    handleRePassword,
    userInputs,
    handleSignUpChange,
    handleSignUpSubmit,
    isLoading,
    alert,
    alert2,
    showAlert,
    showAlert2,
    ageRef,
    repasswordRef,
    verifyPage,
    userDetails,
    handleTermsAndConditionShow,
    handleTermsAndConditionHide,
    termsAndConRef,
    handleCheckboxOnChange,
    checkboxRef,
    isTermsActive,
  } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  //  FIRST NAME REF
  const firstNameRef = useRef(null);

  // USE EFFECT TO FOCUS ON FIRSTNAME
  useEffect(() => {
    // firstNameRef.current.focus();
    Cookies.remove("login_token");
  }, []);

  // USE EFFECT TO NAVIGATE TO VERIFY PAGE
  useEffect(() => {
    if (verifyPage) {
      const interval = setInterval(() => {
        navigate(`../register/verify/${userDetails.userId}`);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [verifyPage]);

  const handleLoading = () => {
    setLoading(false);
  };
  // USE EFFECT TO LOAD ALL COMPONENT
  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);
  // if (loading) {
  //   return <h2>Loadiinnngggg.....</h2>;
  // }

  return !loading ? (
    <main className="sign-up">
      <form onSubmit={handleSignUpSubmit}>
        <h2>Welcome</h2>
        {<Alert2 {...alert2} className="alert2" removeAlert={showAlert2} />}
        <div>
          <label htmlFor="firstname">First Name: </label>
          <input
            type="text"
            id="firstname"
            autoComplete="off"
            name="firstname"
            ref={firstNameRef}
            onChange={handleSignUpChange}
            value={userInputs.firstname}
          />
        </div>
        <div>
          <label htmlFor="lastname">Last Name: </label>
          <input
            type="text"
            id="lastname"
            autoComplete="off"
            name="lastname"
            onChange={handleSignUpChange}
            value={userInputs.lastname}
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            name="email"
            onChange={handleSignUpChange}
            value={userInputs.email}
          />
        </div>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            name="username"
            onChange={handleSignUpChange}
            value={userInputs.username}
          />
        </div>
        <div>
          <label htmlFor="age"> Age: </label>
          <input
            type="number"
            id="age"
            autoComplete="off"
            name="age"
            ref={ageRef}
            onChange={handleSignUpChange}
            value={userInputs.age}
          />
        </div>
        <div className="password-input">
          <label htmlFor="password">Password: </label>

          <span className="password-ele">
            <input
              // ref={inputRef}
              type={`${isPasswordShown.password ? "text" : "password"}`}
              autoComplete="off"
              id="password"
              name="password"
              onChange={handleSignUpChange}
              value={userInputs.password}
            />
            <span className="toggle-pass-btn" onClick={handlePassword}>
              {isPasswordShown.password ? (
                <FaEyeSlash className="hide" />
              ) : (
                <FaEye className="show" />
              )}
            </span>
          </span>
        </div>
        <div className="password-input">
          <label htmlFor="re-password">Retype Password: </label>
          <span className="password-ele">
            <input
              ref={repasswordRef}
              type={`${isPasswordShown.repassword ? "text" : "password"}`}
              autoComplete="off"
              id="re-password"
              name="repassword"
              onChange={handleSignUpChange}
              value={userInputs.repassword}
            />
            <span className="toggle-pass-btn" onClick={handleRePassword}>
              {isPasswordShown.repassword ? (
                <FaEyeSlash className="hide" />
              ) : (
                <FaEye className="show" />
              )}
            </span>
          </span>
        </div>

        <span className="terms-container">
          <input
            type="checkbox"
            id="checkbox"
            ref={checkboxRef}
            onChange={handleCheckboxOnChange}
          />
          <label htmlFor="checkbox">
            I Agree to the{" "}
            <a
              href=""
              className="terms-link"
              onClick={handleTermsAndConditionShow}
            >
              {" "}
              Terms and Condition
            </a>
          </label>
        </span>
        {isLoading ? (
          <Loading
            className={"loading"}
            type={"spin"}
            color={"grey"}
            height={"50px"}
            width={"50px"}
          />
        ) : (
          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        )}
      </form>
      <div className="sign-up-side">
        <img src={img} alt="sign-side" />
      </div>
      {alert.show && (
        <div className="alert-container">
          <Alert1 {...alert} className="alert" removeAlert={showAlert} />
        </div>
      )}
      <div className="termscon" ref={termsAndConRef}>
        <h2>Terms and Conditions</h2>
        <p>Please read this terms of use carefully.</p>
        <p>
          This terms apply to your use of our game whether on your computer or
          mobile devices. These terms also apply to any other services we may
          provide in relation to the game such as customer support, social
          media, community channels and other websites.
        </p>
        <ul>
          <li>The information you provided is for the game use only.</li>
          <li>
            You are responsible for the activities on your account, it’s yours,
            don’t share it!
          </li>
          <li>Don’t make payment to anyone to make use of this game </li>
        </ul>
        <button className="agree-btn" onClick={handleTermsAndConditionHide}>
          I agree
        </button>
      </div>
    </main>
  ) : (
    <h2>Loadinggggg component....</h2>
  );
};

export default SignUpPage;
