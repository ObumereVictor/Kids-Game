import React, { useEffect } from "react";
import { useGlobalContext } from "../../utils/Context";
const { Navigate } = require("react-router-dom");
const Cookies = require("js-cookie");

const SignUpVerifyProtectedRoute = ({ verifyPage, children }) => {
  if (!verifyPage) {
    return <Navigate to="../sign-up" replace="true" />;
  }
  return children;
};

const SignInVerifyProtectedRoute = ({ children }) => {
  const { loginNav, loginToken } = useGlobalContext();

  if (loginNav.gotoverifypage) {
    return children;
  }
  // return <Navigate to={`../../dashboard/${loginToken}`} replace="true" />;
};

const SignInProtectedRoute = ({ children }) => {
  const { loginNav } = useGlobalContext();
  if (!loginNav.gotodashboard) {
    return <Navigate to="../../sign-in" replace="true" />;
  }
  return children;
};

const SignInCompleteProfileProtectedRoute = ({ children }) => {
  const { loginNav } = useGlobalContext();
  if (!loginNav.gotocompleteprofile) {
    return <Navigate to="../../sign-in" replace="true" />;
  }
  return children;
};

const CreateGameProtectedRoute = ({ role, children }) => {
  if (role !== "admin") {
    Cookies.remove("login_token");
    return <Navigate to="../../sign-in" replace="true" />;
  }

  return children;
};

const EditProfileProtectRoute = ({ token, cookie, children }) => {
  if (cookie || token) return children;

  return <Navigate to="../../sign-in" replace="true" />;
};

const GameProtectedRoute = ({ token, gameId, cookie, children }) => {
  console.log({ token, cookie, gameId });
  if (token || cookie) return children;
  return <Navigate to="../../sign-in" replace="true" />;
};

export {
  SignUpVerifyProtectedRoute,
  SignInVerifyProtectedRoute,
  SignInProtectedRoute,
  SignInCompleteProfileProtectedRoute,
  CreateGameProtectedRoute,
  EditProfileProtectRoute,
  GameProtectedRoute,
};
