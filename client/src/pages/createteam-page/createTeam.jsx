import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CreateTeam = () => {
  const user = useSelector((state) => state.loginStatus.userInfo);
  const id = user.pid;
  const src = "https://create-team-aurm4bodaa-uc.a.run.app/#playerID=" + id;
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

export default CreateTeam;
