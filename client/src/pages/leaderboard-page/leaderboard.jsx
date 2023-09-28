import { collection, getDocs } from "firebase/firestore";
// import { db } from "./firebase";
import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { doc, onSnapshot } from "firebase/firestore";
const $ = require("jquery");

const LeaderboardPage = () => {
  const [data, setData] = useState("Team");
  const [src, setSrc] = useState(
    "https://lookerstudio.google.com/embed/reporting/a638e470-257b-4bb0-8a84-5610fd58e353/page/p_dim9bu7z7c?http://localhost:3000"
  );

  // const fetchPost = async () => {
  //   await getDocs(collection(db, "games")).then((querySnapshot) => {
  //     const newData = querySnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     setTodos(newData);
  //     console.log(todos, newData);
  //   });
  // };

  // useEffect(() => {
  //   fetchPost();
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, "games"), (doc) => {
  //     console.log("Current data: ", doc);
  //   });

  //   return () => {
  //     // Unsubscribe the listener when the component unmounts
  //     unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      // Check if the width is less than 786px
      setIframe();
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check for the current width
    handleResize();

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function setIframe() {
    if (data === "Team") {
      if (window.innerWidth < 786) {
        setSrc(
          "https://lookerstudio.google.com/embed/reporting/bba836d4-ed17-416f-a419-5522e538f675/page/p_8xw6pya07c?http:localhost:3000"
        );
        $("iframe").css("height", "1025px");
      } else {
        setSrc(
          "https://lookerstudio.google.com/embed/reporting/a638e470-257b-4bb0-8a84-5610fd58e353/page/p_dim9bu7z7c?http:localhost:3000"
        );
        $("iframe").css("height", "150vh");
      }
    } else {
      if (window.innerWidth < 786) {
        setSrc(
          "https://lookerstudio.google.com/embed/reporting/f7b0e3f6-f923-43d7-87d6-92e3b036b9b7/page/p_8xw6pya07c?http:localhost:3000"
        );
        $("iframe").css("height", "1025px");
      } else {
        setSrc(
          "https://lookerstudio.google.com/embed/reporting/48bcd2ec-02d4-48d9-bdb3-492725cf6262/page/VcAXD?http:localhost:3000"
        );
        $("iframe").css("height", "150vh");
      }
    }
  }

  function setIframebyKey(key) {
    if (key === "Team") {
      if (window.innerWidth < 786) {
        setSrc(
          "https://lookerstudio.google.com/embed/reporting/bba836d4-ed17-416f-a419-5522e538f675/page/p_8xw6pya07c?http:localhost:3000"
        );
        $("iframe").css("height", "1025px");
      } else {
        setSrc(
          "https://lookerstudio.google.com/embed/reporting/a638e470-257b-4bb0-8a84-5610fd58e353/page/p_dim9bu7z7c?http:localhost:3000"
        );
        $("iframe").css("height", "150vh");
      }
    } else {
      if (window.innerWidth < 786) {
        setSrc(
          "https://lookerstudio.google.com/embed/reporting/f7b0e3f6-f923-43d7-87d6-92e3b036b9b7/page/p_8xw6pya07c?http:localhost:3000"
        );
        $("iframe").css("height", "1025px");
      } else {
        setSrc(
          "https://lookerstudio.google.com/embed/reporting/48bcd2ec-02d4-48d9-bdb3-492725cf6262/page/VcAXD?http:localhost:3000"
        );
        $("iframe").css("height", "150vh");
      }
    }
  }

  function setKey(key) {
    setData(key);
    setIframebyKey(key);
  }

  return (
    <div>
      <Tabs
        id="controlled-tab-example"
        activeKey={data}
        onSelect={(k) => setKey(k)}
        className="mb-3 text-white"
        style={{ color: "white !important" }}
      >
        <Tab eventKey="Team" title="Top Team">
          <h1 className="text-center">Top Team Leaderboard</h1>
        </Tab>
        <Tab eventKey="Individual" title="Top Player">
          <h1 className="text-center">Top Player Leaderboard</h1>
        </Tab>
      </Tabs>
      <hr />
      <iframe
        id="iframe-id"
        src={src}
        frameBorder="0"
        style={{ border: "0", width: "100%" }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default LeaderboardPage;
