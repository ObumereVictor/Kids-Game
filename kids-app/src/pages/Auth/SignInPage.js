import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "../../utils/Context";
import img from "../../../src/utils/img/sign-in-side.jpg";
import { Alert2 } from "../../utils/Alert";
import Loading from "../../utils/Loading";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";

const SignInPage = () => {
  const {
    setVerifyPage,
    verifyPage,
    resetForm,
    handleSignInChange,
    signInDetails,
    handleSignInSubmit,
    alert2,
    showAlert2,
    isLoading,
    setSignInPassword,
    isSignInPassword,
    loginNav,
    userDetails,
    resendVerficationEmail,
    loginToken,
    setLoginNav,
    isAuthenticated,
  } = useGlobalContext();

  const navigate = useNavigate();

  const emailRef = useRef(null);

  // USEEFFECT IF COOKIE IS OK
  useEffect(() => {
    if (isAuthenticated.user) {
      setLoginNav((navs) => {
        navs.gotodashboard = true;
        return navs;
      });
      navigate(`/dashboard/${isAuthenticated.cookie}`);
    }
    if (isAuthenticated.userId) {
      setLoginNav((navs) => {
        navs.gotocompleteprofile = true;
        return navs;
      });
      navigate(
        `/dashboard/complete-profile/${isAuthenticated.userId}/${isAuthenticated.cookie}`
      );
    }
  });

  // USEEFFECT TO SET VERIFY PAGE TO DEFAULT
  useEffect(() => {
    if (verifyPage) {
      setVerifyPage(false);

      resetForm();
    }
  }, []);

  // USEEFFECT TO NAVIGATE TO DASHBOARD
  useEffect(() => {
    if (loginNav.gotodashboard) {
      navigate(`../dashboard/${loginToken}`);
    }
  }, [loginNav.gotodashboard]);

  // USE EFFECT TO NAVIGATE TO COMPLETE PROFILE
  useEffect(() => {
    if (loginNav.gotocompleteprofile) {
      navigate(
        `../dashboard/complete-profile/${userDetails.userId}/${loginToken}`
      );
    }
  }, [loginNav.gotocompleteprofile]);

  // USE EFFECT TO NAVIGATE TO LOGIN
  useEffect(() => {
    if (loginNav.gotoverifypage) {
      navigate(`../verify/${userDetails.userId}`);
      resendVerficationEmail();
    }
  }, [userDetails]);

  useEffect(() => {
    setLoginNav({
      gotodashboard: false,
      gotoverifypage: false,
      gotocompleteprofile: false,
    });
    navigate("../sign-in");
  }, []);

  //  USEEFECT TO FOCUS ON EMAIL INPUT
  useEffect(() => {
    // emailRef.current.focus();
  }, []);

  const cookie = Cookies.get("login_token");
  if (cookie) {
    return (
      <main className="fetch-loading">
        <Loading
          height={"100px"}
          width={"100px"}
          type={"spin"}
          color={"green"}
        />
      </main>
    );
  }
  return (
    <main className="sign-in-page">
      <form onSubmit={handleSignInSubmit}>
        <h2>Welcome Back!</h2>
        {alert2 && <Alert2 {...alert2} removeAlert={showAlert2} />}
        <div className="email-div">
          <label htmlFor="username">Email:</label>
          <input
            id="username"
            ref={emailRef}
            type="email"
            name="email"
            onChange={handleSignInChange}
            value={signInDetails.email}
          />
        </div>
        <div className="password-input">
          <label htmlFor="password">Password:</label>
          <span className="password-ele">
            <input
              id="password"
              type={isSignInPassword ? "text" : "password"}
              name="password"
              onChange={handleSignInChange}
              value={signInDetails.password}
            />
            <span
              className="toggle-pass-btn"
              onClick={() => setSignInPassword(!isSignInPassword)}
            >
              {isSignInPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </span>
        </div>
        <p onClick={() => navigate("../forgot-password")}>Forgot Password?</p>
        {isLoading ? (
          <Loading
            className={"loading"}
            type={"spin"}
            color={"grey"}
            height={"50px"}
            width={"50px"}
          />
        ) : (
          <input type="submit" className="submit-btn s-btn" value="Sign In" />
        )}
      </form>
      <section className="sign-in-side">
        <img src={img} alt="sign-in-ng" />
      </section>
    </main>
  );
};

export default SignInPage;
