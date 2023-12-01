import { Link, Outlet } from "react-router-dom";
import React, { useEffect, lazy, useState } from "react";
import "../style/hss.css";
import { FaBars } from "react-icons/fa";
import { useGlobalContext } from "../utils/Context";
import SideBarPage from "./SideBar";

const Root = () => {
  const { showSideBar, toggle, setDashboardActive } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  // USE EFFECT FOR SIDEBAR
  useEffect(() => {
    setDashboardActive(false);
  });

  const handleLoading = () => {
    console.log("hello");
    setLoading(false);
  };

  // // USE EFFECT TO LOAD ALL COMPONENT
  // useEffect(() => {
  //   window.addEventListener("load", handleLoading);
  //   return () => window.removeEventListener("load", handleLoading);
  // }, []);

  // if (loading) {
  //   return <h2>Loadiinnngggg.....</h2>;
  // }

  return (
    <main className="root">
      <section className="root-header">
        <Link to="/" className="header-link">
          <h2>KIDS APP</h2>
        </Link>

        <div className="root-auth">
          <Link to="sign-up">
            <button>Sign Up</button>
          </Link>
          <Link to="sign-in">
            <button>Sign In</button>
          </Link>
        </div>
        <div className="toggle-btn" onClick={showSideBar}>
          <FaBars />
        </div>
      </section>
      {toggle && <SideBarPage />}
      <section>
        <Outlet />
      </section>
    </main>
  );
};

export default Root;
