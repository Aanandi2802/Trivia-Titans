import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "./ProfileEdit.scss";
import UserProfileNavbar from "./UserProfileNavbar";
import axios from "axios"; 

export default function MyProfile() {

  let currentUserData;
  const lemail = localStorage.getItem("loginEmail")
  const [userData, setUserData] = useState({}); // Define userData state and setUserData function

  useEffect(() => {
    // Fetch user data from the backend when the component mounts
    const apiCall = async () => {
      try {
        console.log("Fetched User Data Successfully.")
        console.log(lemail)
        await axios({
          method: "post",
          url: "https://app-3gx7kxu67q-uc.a.run.app/get-user-data-by-email", 
          data: {
            email: lemail
          },
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => {
            console.log(res.data)
            if (res.data.message === "User found.") {
              currentUserData = res.data.userData;
              console.log(currentUserData);
              setUserData(currentUserData); 
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }

    apiCall();
  }, []);

  return (
    <>
      <UserProfileNavbar />
      <div className="profile-edit">
        <div className="main-section">
          <h2>My Profile</h2>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    disabled

                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    disabled

                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="age">
                  <Form.Label>Age:</Form.Label>
                  <Form.Control
                    type="text"
                    name="age"
                    value={userData.age}
                    disabled

                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="contactInfo">
                  <Form.Label>Contact Info:</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactInfo"
                    value={userData.email}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="profilePictureUrl">
                  <Form.Label>pid</Form.Label>
                  <Form.Control
                    type="text"
                    name="profilePictureUrl"
                    value={userData.pid}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="password">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

          </Form>

         
        </div>
      </div>
    </>
  );
}
