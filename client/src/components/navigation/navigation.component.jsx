import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import path from "../../constants/paths";
import "./navigation.styles.scss";
import paths from "../../pages/paths";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notSubmitted } from "../../redux/isLogin.reducers";
import KommunicateChat from "../../pages/chat";

const Navigation = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const closeNavigation = () => {
    setIsNavigationOpen(false);
  };

  const logOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginEmail");
    dispatch(notSubmitted());
    navigate(path.LOGIN);
    window.location.reload();
  };
  return (
    <>
      <div className="menu">
        <MenuIcon />
      </div>
      <input
        readOnly
        className="menu-icon"
        type="checkbox"
        checked={isNavigationOpen}
        onClick={() => {
          setIsNavigationOpen((prevState) => !prevState);
        }}
      />
      <div className="navigation">
        <div className="navigation__top">
          <h2>Game</h2>
          <div className="navigation__links">
            <div className="navigation__links--primary">
              <Link
                to={path.HOME}
                onClick={closeNavigation}
                className={`navigation__link ${
                  location.pathname === path.HOME
                    ? "navigation__link--active"
                    : ""
                }`}
              >
                Home
              </Link>
              <Link
                to={path.LEADERBOARD}
                onClick={closeNavigation}
                className={`navigation__link ${
                  location.pathname === path.LEADERBOARD
                    ? "navigation__link--active"
                    : ""
                }`}
              >
                Leaderboard
              </Link>
              <Link
                to={path.TEAMHOME}
                onClick={closeNavigation}
                className={`navigation__link ${
                  location.pathname === path.TEAMHOME
                    ? "navigation__link--active"
                    : ""
                }`}
              >
                Team Home
              </Link>
              <Link
                to={path.CREATETEAM}
                onClick={closeNavigation}
                className={`navigation__link ${
                  location.pathname === path.CREATETEAM
                    ? "navigation__link--active"
                    : ""
                }`}
              >
                Create Team
              </Link>
              <Link
                to={path.MYPROFILE}
                onClick={closeNavigation}
                className={`navigation__link ${
                  location.pathname === path.MYPROFILE
                    ? "navigation__link--active"
                    : ""
                }`}
              >
                My Profile
              </Link>
              <Link
                to={path.NOTIFICATIONSALERTS}
                onClick={closeNavigation}
                className={`navigation__link ${
                  location.pathname === path.NOTIFICATIONSALERTS
                    ? "navigation__link--active"
                    : ""
                }`}
              >
                Notifications
              </Link>
              {/* <Link
                to={path.ADMIN}
                onClick={closeNavigation}
                className={`navigation__link ${
                  location.pathname === path.ADMIN
                    ? "navigation__link--active"
                    : ""
                }`}
              >
                ADMIN
              </Link> */}
              <button onClick={logOut}> Log Out</button>
            </div>
            <KommunicateChat />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
