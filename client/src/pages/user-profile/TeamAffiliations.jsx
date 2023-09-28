
import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import UserProfileNavbar from "./UserProfileNavbar";
import axios from "axios"; // Import Axios for API calls

export default function TeamAffiliations() {

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

  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [showAcceptedRequests, setShowAcceptedRequests] = useState(true);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [showRejectedRequests, setShowRejectedRequests] = useState(false);
  const acceptedRequestsForUser = acceptedRequests.filter(request => request.receiver === userData.firstName);
  const pendingRequestsForUser = pendingRequests.filter(request => request.receiver === userData.firstName);
  const rejectedRequestsForUser = rejectedRequests.filter(request => request.receiver === userData.firstName);


  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios.post("https://app-474s4an3qa-uc.a.run.app/fetch-team-a")
      .then((response) => {
        const { requests } = response.data;
        const accepted = requests.filter((request) => request.status === "accept");
        const pending = requests.filter((request) => request.status === "pending");
        const rejected = requests.filter((request) => request.status === "reject");

        setAcceptedRequests(accepted);
        setPendingRequests(pending);
        setRejectedRequests(rejected);
      })
      .catch((error) => {
        console.log("Error fetching requests:", error);
      });
  };

  const handleShowAcceptedRequests = () => {
    setShowAcceptedRequests(true);
    setShowPendingRequests(false);
    setShowRejectedRequests(false);
  };

  const handleShowPendingRequests = () => {
    setShowAcceptedRequests(false);
    setShowPendingRequests(true);
    setShowRejectedRequests(false);
  };

  const handleShowRejectedRequests = () => {
    setShowAcceptedRequests(false);
    setShowPendingRequests(false);
    setShowRejectedRequests(true);
  };

  return (
    <>
      <UserProfileNavbar />
      <div className="profile-edit">
        <div className="main-section">
          <h2>Team Affiliations</h2>
          <div className="text-center mb-4">
            <Row>
              <Col>
                <Button className="btn-accept" onClick={handleShowAcceptedRequests}>
                  Accepted Requests
                </Button>
              </Col>
              <Col>
                <Button variant="secondary" onClick={handleShowPendingRequests}>
                  Pending Requests
                </Button>
              </Col>
              <Col>
                <Button variant="danger" onClick={handleShowRejectedRequests}>
                  Rejected Requests
                </Button>
              </Col>
            </Row>
          </div>

          {showAcceptedRequests && (
        <>
          <h3>Accepted Requests</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Team Name</th>
              </tr>
            </thead>
            <tbody>
              {acceptedRequestsForUser.map(request => (
                <tr key={request.id}>
                  <td>{request.sender}</td>
                  <td>{request.t_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {showPendingRequests && (
        <>
          <h3>Pending Requests</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Team Name</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequestsForUser.map(request => (
                <tr key={request.id}>
                  <td>{request.sender}</td>
                  <td>{request.t_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {showRejectedRequests && (
        <>
          <h3>Rejected Requests</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Team Name</th>
              </tr>
            </thead>
            <tbody>
              {rejectedRequestsForUser.map(request => (
                <tr key={request.id}>
                  <td>{request.sender}</td>
                  <td>{request.t_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
        </div>
      </div>
    </>
  );
}
