import React, { useEffect, useState } from "react";
import "./home-page.styles.scss";

const DropdownFilter = ({ options, selectedValue, onValueChange }) => {
  return (
    <select
      value={selectedValue}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [visiblePages, setVisiblePages] = useState([]);

  useEffect(() => {
    // Determine the range of visible pages
    const range = calculateVisiblePages(currentPage, totalPages);
    setVisiblePages(range);
  }, [currentPage, totalPages]);

  const calculateVisiblePages = (currentPage, totalPages) => {
    const visiblePageCount = 5; // Number of visible pages (adjust as needed)
    const halfRange = Math.floor(visiblePageCount / 2);
    let startPage = currentPage - halfRange;
    let endPage = currentPage + halfRange;

    if (startPage <= 0) {
      startPage = 1;
      endPage = Math.min(totalPages, visiblePageCount);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - visiblePageCount + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  return (
    <div>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchGames(currentPage, filterType, filterValue);
  }, [currentPage, filterType, filterValue]);

  const fetchGames = async (page, filterType, filterValue) => {
    const data = {
      filterType,
      filterValue,
    };
    try {
      // Send the POST request
      fetch(
        `https://us-central1-serverless-project-392613.cloudfunctions.net/function-2?page=${page}`,
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
          const { games, totalPages } = result;
          setGames(games);
          setTotalPages(totalPages);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
  ];

  const difficultyOptions = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
  ];

  const categoryOptions = [
    { label: "Sports", value: "sports" },
    { label: "History", value: "history" },
    { label: "Mathematics", value: "mathematics" },
    { label: "Coding", value: "coding" },
  ];

  const getFilterValueOptions = () => {
    switch (filterType) {
      case "difficulty":
        return difficultyOptions;
      case "category":
        return categoryOptions;
      default:
        return [];
    }
  };

  return (
    <div className="home-page">
      <h1>Game List</h1>
      <div>
        <label>Filter By:</label>
        <DropdownFilter
          options={filterOptions}
          selectedValue={filterType}
          onValueChange={handleFilterTypeChange}
        />
      </div>
      {filterType && (
        <div>
          <label>Filter Value:</label>
          <DropdownFilter
            options={getFilterValueOptions()}
            selectedValue={filterValue}
            onValueChange={handleFilterValueChange}
          />
        </div>
      )}
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default HomePage;
