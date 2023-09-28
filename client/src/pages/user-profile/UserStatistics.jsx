import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProfileEdit.scss";
import UserProfileNavbar from "./UserProfileNavbar";
import axios from "axios"; // Import Axios for API calls
import { Form, Button, Alert, Row, Col } from "react-bootstrap";

export default function UserStatistics() {
  const initialUserData = {
    gamesPlayed: 10,
    lossRatio: "3",
    totalPoints: "500",
    winRatio: "7",
  };

  const [userData, setUserData] = useState(initialUserData);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Fetch user data from the backend when the component mounts
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    // Replace 'your_user_id' with the actual user ID from your authentication system
    const userId = 'ap@dal.ca';

    // Make an API call to fetch the user data
    axios.get(`/api/user/${userId}`)
      .then((response) => {
        // Extract only the required fields from the response
        const { gamesPlayed, lossRatio, totalPoints, winRatio } = response.data;
        setUserData({ gamesPlayed, lossRatio, totalPoints, winRatio });
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  };

  return (
    <>
      <UserProfileNavbar />
      <div className="profile-edit">
        <div className="main-section">
          <h2>User Statistics</h2>
          
          <Form>
            <Col className="mb-3">
                <Form.Group controlId="firstName">
                  <Form.Label>Games Played :</Form.Label>
                  <Form.Control
                    type="text"
                    value={userData.gamesPlayed || ""}
                    disabled
                  />
                </Form.Group>
              {/* <Row md={6}> */}
                <Form.Group controlId="firstName">
                  <Form.Label>Win Ratio</Form.Label>
                  <Form.Control
                    type="text"
                    value={userData.winRatio || ""}
                    disabled
                  />
                </Form.Group>
              {/* </Row> */}
              {/* <Row md={6}> */}
                <Form.Group controlId="firstName">
                  <Form.Label>Loss Ratio:</Form.Label>
                  <Form.Control
                    type="text"
                    value={userData.lossRatio || ""}
                    disabled
                  />
                </Form.Group>
              {/* </Row> */}
              {/* <Row md={6}> */}
                <Form.Group controlId="firstName">
                  <Form.Label>Total Points Earned:</Form.Label>
                  <Form.Control
                    type="text"
                    value={userData.totalPoints || ""}
                    disabled
                  />
                </Form.Group>
              {/* </Row> */}
            </Col>

          </Form>

          <Link to="/myprofile">Back to My Profile</Link>
</div>
          
        </div>
    </>
  );
}
