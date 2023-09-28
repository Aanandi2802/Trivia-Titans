
import { Nav, Navbar } from "react-bootstrap";
import "./UserProfileNavbar.scss";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import path from "../../constants/paths";
// import "./navigation.styles.scss";
import paths from "../../pages/paths";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notSubmitted } from "../../redux/isLogin.reducers";

function UserProfileNavbar() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();

  return (
    <Navbar bg="light" data-bs-theme="light">
      {/* Left section for "My Profile" */}
      <div className="left-section">
        <Navbar.Brand href="/myprofile" className="navbarmain">
          My Profile
        </Navbar.Brand>
        <div className="right-section">
        <Nav>
        
              <Link to={path.NOTIFICATIONSALERTS} className={`nav-link ${
                  location.pathname === path.NOTIFICATIONSALERTS
                    ? "navigation__link--active"
                    : ""
                }`}>
            Notifications
          </Link>
          <Link to={path.PROFILEEDIT} className={`nav-link ${
                  location.pathname === path.PROFILEEDIT
                    ? "navigation__link--active"
                    : ""
                }`}>
            Edit Profile
          </Link>
          <Link to={path.USERSTASTICS} className={`nav-link ${
                  location.pathname === path.USERSTASTICS
                    ? "navigation__link--active"
                    : ""
                }`}>
            User Statistics
          </Link>
          <Link to={path.TEAMAFFILIATIONS} className={`nav-link ${
                  location.pathname === path.TEAMAFFILIATIONS
                    ? "navigation__link--active"
                    : ""
                }`}>
            Team Affiliations
          </Link>
          <Link to={path.COMPARESCORES} className={`nav-link ${
                  location.pathname === path.COMPARESCORES
                    ? "navigation__link--active"
                    : ""
                }`}>
            
          </Link>
          <Link to="/comparescores" className="nav-link">
            Compare Scores
          </Link>
          <Link to="/logout" className="nav-link">
            Logout
          </Link>
        </Nav>
      </div>
      </div>

      {/* Right section for other links */}
      
    </Navbar>
  );
}

export default UserProfileNavbar;
