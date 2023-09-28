import React, { useEffect, useState, useContext } from "react";
import "./home-page.styles.scss";
import Table from "./table";
import { useSelector } from "react-redux";
import SocketContext from "../../components/sockets/SocketContext";
import { useNavigate } from "react-router-dom";

const DropdownFilter = ({ options, selectedValue, onValueChange }) => {
  return (
    <select
      value={selectedValue}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const HomePage = () => {
  const user = useSelector((state) => state.loginStatus.userInfo);
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const columns = [
    {
      title: "ID",
      data: "gameId",
    },
    {
      title: "Name",
      data: "name",
      render: function (data, type, row) {
        return '<a href="#" class="text-decoration-none">' + data + "</a>";
      },
    },
    {
      title: "Date and Time",
      render: function (data, type, row) {
        const dateTime = new Date(row.startTime);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        if (row.name === "name2") {
          console.log(row);
        }
        const formattedDateTime = dateTime.toLocaleString(undefined, options);
        return formattedDateTime;
      },
    },
    {
      title: "Category",
      data: "category",
    },
    {
      title: "Difficulty",
      render: function (data, type, row) {
        console.log(row.difficulty);
        switch (row.difficulty) {
          case "0":
            return "Easy";
          case "1":
            return "Medium";
          case "2":
            return "Hard";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "Duration",
      data: "timeFrame",
    },
    {
      title: "Number of Teams",
      // data: "teamScores.length",
      render: function (data, type, row) {
        if (Array.isArray(row.teamScores)) {
          return row.teamScores.length;
        } else {
          return 0;
        }
      },
    },
    {
      title: "Status",
      render: function (data, type, row) {
        if (Array.isArray(row.teamScores)) {
          const foundIndex = row.teamScores.findIndex((item) => {
            const segments = item.teamId._path.segments;
            return segments.length > 1 && segments[1] === user.t_name;
          });
          if (foundIndex !== -1) {
            return '<button class="btn btn-secondary w-100">Leave</button>';
          } else {
            return '<button class="btn btn-primary w-100">Join</button>';
          }
        } else {
          return '<button class="btn btn-primary w-100">Join</button>';
        }
      },
    },
  ];

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        console.log(message);
        if (message.origin === "startGame") {
          console.log(message);
          navigate("/trivia", { state: message.gameDetails });
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  }, [socket]);

  useEffect(() => {
    fetchGames(filterType, filterValue);
  }, [filterType, filterValue]);

  // useEffect(() => {
  //   // Set up the Firestore listener
  //   const unsubscribe = db.collection("games").onSnapshot((snapshot) => {
  //     const updatedData = snapshot.docs.map((doc) => doc.data());
  //     console.log(updatedData);
  //   });

  //   // Clean up the listener on component unmount
  //   return () => unsubscribe();
  // }, []);

  const fetchGames = async (filterType, filterValue) => {
    // if (filterType !== "category") {
    //   filterValue = parseInt(filterValue);
    // }
    const data = {
      filterType,
      filterValue,
    };
    try {
      // Send the POST request
      fetch(
        `https://us-central1-serverless-project-392613.cloudfunctions.net/function-4`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then((res) => res.json())
        .then((result) => {
          // Handle the response from the API
          console.log(result); // Do something with the response
          const { games } = result;
          setGames(games);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setFilterValue(""); // Reset filter value when filter type changes
  };

  const handleFilterValueChange = (value) => {
    setFilterValue(value);
  };

  const filterOptions = [
    { label: "Difficulty", value: "difficulty" },
    { label: "Category", value: "category" },
    { label: "Duration", value: "timeFrame" },
  ];

  const difficultyOptions = [
    { label: "Easy", value: "0" },
    { label: "Medium", value: "1" },
    { label: "Hard", value: "2" },
  ];

  const categoryOptions = [
    { label: "Sports", value: "sports" },
    { label: "History", value: "history" },
    { label: "Mathematics", value: "mathematics" },
    { label: "Coding", value: "coding" },
  ];

  const timeFrameOptions = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
    { label: "25", value: "25" },
    { label: "30", value: "30" },
    { label: "35", value: "35" },
    { label: "40", value: "40" },
    { label: "45", value: "45" },
    { label: "50", value: "50" },
    { label: "55", value: "55" },
    { label: "60", value: "60" },
  ];

  const getFilterValueOptions = () => {
    switch (filterType) {
      case "difficulty":
        return difficultyOptions;
      case "category":
        return categoryOptions;
      case "timeFrame":
        return timeFrameOptions;
      default:
        return [];
    }
  };

  const modifiedFunc = (data) => {
    const updatedArray = games.map((item) => {
      if (item.gameId === data.gameId) {
        return data;
      }
      return item;
    });
    setGames(updatedArray);
  };

  return (
    <div className="home-page">
      <h1 className="text-center mb-4">Game List</h1>
      <div className="d-flex justify-content-center">
        <div>
          <label>Filter By: </label>
          <DropdownFilter
            options={filterOptions}
            selectedValue={filterType}
            onValueChange={handleFilterTypeChange}
          />
        </div>
        {filterType && (
          <div className="ms-3">
            <label>Filter Value: </label>
            <DropdownFilter
              options={getFilterValueOptions()}
              selectedValue={filterValue}
              onValueChange={handleFilterValueChange}
            />
          </div>
        )}
      </div>
      {/* <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul> */}
      <div className="my-4">
        <Table data={games} columns={columns} modifiedFunc={modifiedFunc} />
      </div>
    </div>
  );
};

export default HomePage;
