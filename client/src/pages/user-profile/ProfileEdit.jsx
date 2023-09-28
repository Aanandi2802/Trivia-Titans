import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import "./ProfileEdit.scss";
import UserProfileNavbar from "./UserProfileNavbar";
import axios from "axios"; // Import Axios for API calls
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProfileEdit() {
  let currentUserData;
  // const [isEditMode, setIsEditMode] = useState(false);
  // const [showAlert, setShowAlert] = useState(false);
  // // const [userData, setUserData] = useState({});
  // const navigate = useNavigate();

  // const loginEmail = useSelector((state) => state.loginStatus.userEmail);
  // const [userData, setUserData] = useState({}); // Define userData state and setUserData function
  const loginEmail = useSelector((state) => state.loginStatus.userEmail);
  const lemail = localStorage.getItem("loginEmail")
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

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
  }, [lemail]);
  

  // const handleSubmit = async () => {
  //   try {
  //     await axios.post("https://app-474s4an3qa-uc.a.run.app", {
  //       firstName: userData.firstName,
  //       lastName: formData.lastName,
  //       age: formData.age,
  //     });

  //     if (response.data.message === "User data updated successfully.") {
  //       setShowAlert(true);
  //     }
  //   } catch (error) {
  //     console.error("Error updating user data:", error);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("https://app-474s4an3qa-uc.a.run.app/edit-user-data", {
        firstName: userData.firstName,
        lastName: formData.lastName,
        age: formData.age,
      });

      if (response.data.message === "User data updated successfully.") {
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };


  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <>
      <UserProfileNavbar />
      <div className="profile-edit">
        <div className="main-section">
          <h2>Edit Profile</h2>
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
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditMode}
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
                    value={formData.age}
                    onChange={handleChange}
                    disabled={!isEditMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Contact Info:</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={userData.email}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              onClick={() => {
                if (isEditMode) {
                  handleSubmit();
                }
                setIsEditMode(!isEditMode);
              }}
            >
              {isEditMode ? "Save" : "Edit"}
            </Button>
          </Form>

          {showAlert && (
            <Alert
              variant="success"
              onClose={() => setShowAlert(false)}
              dismissible
              className="mt-3"
            >
              Profile updated successfully!
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}