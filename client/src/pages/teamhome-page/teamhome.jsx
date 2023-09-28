import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./teamHome.css";

const TeamHome = () => {
  const user = useSelector((state) => state.loginStatus.userInfo);
  const id = user.pid;
  const src =
    "https://team-home-aurm4bodaa-uc.a.run.app/team_home2?playerID=" + id;
  return (
    <div>
      <iframe
        id="iframe-id"
        src={src}
        frameBorder="0"
        style={{ border: "0", width: "100%", height: "100vh" }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default TeamHome;
