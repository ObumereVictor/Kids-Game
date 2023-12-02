import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import { useGlobalContext } from "../utils/Context";
import SideBarPage from "./SideBar";
import DropDown from "../utils/DropDown";

const DashboardRoot = () => {
  const { toggle, showSideBar, gameDetails, gettingUser, isLoading } =
    useGlobalContext();
  const [isDropDownActive, setIsDropDownActive] = useState(false);

  useEffect(() => {
    gettingUser();
  });

  const handleDropDown = (event) => {
    event.preventDefault();
    setIsDropDownActive(true);
    if (event.target.classList.contains("active")) {
      event.target.classList.remove("active");
      setIsDropDownActive(false);
    }
  };
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <main className="dashboard-root">
      <header className="dashboard-header">
        <h2>KIDS APP</h2>
        <div className="toggle-btn" onClick={showSideBar}>
          <FaBars />
        </div>
        <div
          className={`${isDropDownActive ? "profile active" : "profile"}`}
          onClick={handleDropDown}
        >
          <img
            src={gameDetails.profilePic}
            alt="profile-pic"
            className="display-picture"
          />
          <p>{gameDetails.username}</p>

          {isDropDownActive ? (
            <p className="show-profile">
              <RiArrowUpSFill />
            </p>
          ) : (
            <p className="hide-profile">
              <RiArrowDownSFill />
            </p>
          )}
        </div>
      </header>

      <div className="dropdown-div">{isDropDownActive && <DropDown />}</div>
      {toggle && <SideBarPage />}

      <div>
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardRoot;
