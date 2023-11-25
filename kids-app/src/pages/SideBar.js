import React, { useEffect } from "react";
import { useGlobalContext } from "../utils/Context";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import img from "../utils/img/cartoonbg.png";
const SideBarPage = () => {
  const {
    toggle,
    hideSideBar,
    isDashboardActive,
    setDashboardActive,
    signOut,
    gameDetails,
    isAuthenticated,
  } = useGlobalContext();

  const navigate = useNavigate();

  // USE EFFECT FOR SIDEBAR
  useEffect(() => {
    setDashboardActive(true);
  }, []);
  return (
    <section>
      <section
        className={`${toggle ? "sideBar-bg-img active" : "sideBar-bg-img"} `}
      >
        <img src={img} alt="cartoon bf" />
      </section>
      <section className={`${toggle ? "sideBar active" : "sideBar"}`}>
        <div className="hide-btn" onClick={hideSideBar}>
          <FaTimes />
        </div>
        {isDashboardActive ? (
          <div className="dashboard-sidebar">
            <div>
              <img
                src={gameDetails.profilePic}
                alt="profile pic"
                className="display-picture"
              />
              <p>{gameDetails.username}</p>
            </div>
            <button
              onClick={(event) => {
                event.preventDefault();
                navigate(`../dashboard/edit-profile/${isAuthenticated.cookie}`);
              }}
            >
              Edit Profile
            </button>
            <Link to="/">
              <button className="sign-out-btn" onClick={signOut}>
                Sign Out{" "}
              </button>
            </Link>
          </div>
        ) : (
          <div className="sideBar-links">
            <Link to="sign-up" style={{ textDecoration: "none" }}>
              <button onClick={hideSideBar}> Sign Up</button>
            </Link>
            <Link to="sign-in" style={{ textDecoration: "none" }}>
              <button onClick={hideSideBar}>Sign In</button>
            </Link>
          </div>
        )}
      </section>
    </section>
  );
};

export default SideBarPage;
