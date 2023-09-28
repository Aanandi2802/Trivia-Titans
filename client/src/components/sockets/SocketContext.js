import React, { createContext, useEffect, useState } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let newSocket = new WebSocket(
          "wss://rs84vi8zt5.execute-api.us-east-1.amazonaws.com/production1"
        );

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      } catch (error) {
        console.error("Error fetching secret:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
