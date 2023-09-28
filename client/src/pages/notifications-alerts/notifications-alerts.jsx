import React, { useState, useEffect } from "react";
import { Dropdown, Alert } from "react-bootstrap";
import axios from "axios";
import UserProfileNavbar from "../user-profile/UserProfileNavbar";

export default function NotificationsAlerts() {
  const [selectedKind, setSelectedKind] = useState(null);
  const [viewedNotifications, setViewedNotifications] = useState({});
  const [notificationsData, setNotificationsData] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);

  useEffect(() => {
    const fetchNotificationsData = async (req, response) => {
      try {
        const response = await axios.post("https://app-474s4an3qa-uc.a.run.app/get-notifications");
        const notifications = response.data.notifications;
        const types = Array.from(new Set(notifications.map(notification => notification.type)));
      
        setNotificationsData(notifications);
        setNotificationTypes(types);
      } catch (error) {
        console.error("Error fetching notifications data:", error);
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
      }
      
    };
    fetchNotificationsData();
  }, []);

  const markNotificationAsViewed = (notificationId) => {
    const updatedViewedNotifications = { ...viewedNotifications };
    updatedViewedNotifications[notificationId] = true;
    setViewedNotifications(updatedViewedNotifications);
    localStorage.setItem(
      "viewedNotifications",
      JSON.stringify(updatedViewedNotifications)
    );
  };

  return (
    <>
      <UserProfileNavbar />
      <div className="profile-edit">
        <div className="main-section">
          <h2>Notifications</h2>

          <Dropdown>
            <Dropdown.Toggle variant="primary" id="notifications-dropdown">
              {selectedKind || "Filter Notifications"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {notificationTypes.map((type, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setSelectedKind(type)}
                >
                  {type}
                </Dropdown.Item>
              ))}
              <Dropdown.Item>
                  Achievements
                </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {selectedKind && (
            <div className="mt-3">
              <h4>Notifications of {selectedKind}</h4>
              {notificationsData
                .filter(notification => notification.type === selectedKind)
                .map((notification, index) => (
                  <Alert
                    key={index}
                    variant={viewedNotifications[notification.id] ? "dark" : "info"}
                  >
                    {notification.message}
                  </Alert>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
