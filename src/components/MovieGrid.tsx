// src/components/MovieGrid.tsx
import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "./MovieCard";

interface Movie {
  name: string;
  posterImage: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

const MovieGrid: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [isSearchInputVisible, setIsSearchInputVisible] =
    useState<boolean>(false); // State to toggle input visibility

  // Function to fetch movies from the mock JSON file
  const fetchMovies = useCallback(async (pageNum: number) => {
    try {
      let url = `${BASE_URL}/data/page${pageNum}.json`;
      console.log("url", url);
      const response = await fetch(url); // Adjust the URL to match the JSON file structure
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const title = data?.page?.title;
      setTitle(title);
      const newMovies = data.page["content-items"].content.map(
        (movie: any) => ({
          name: movie.name,
          posterImage: movie["poster-image"],
        })
      );

      setMovies((prevMovies) => [...prevMovies, ...newMovies]);

      // If the returned data is less than expected, set hasMore to false
      if (newMovies.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setHasMore(false); // Disable loading more data if an error occurs
    }
  }, []);

  // Load the first page when the component mounts
  useEffect(() => {
    fetchMovies(page);
  }, [fetchMovies, page]);

  // Handle scrolling and triggering new data fetch
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Check if the user has scrolled to the bottom of the grid
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to fetch the next set of data
    }
  };

  // Filter movies based on search query
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="movie-grid" onScroll={handleScroll}>
      <div className="header">
        <img
          src={`${BASE_URL}/images/Back.png`}
          alt="Back"
          className="back-icon"
          onClick={() => {
            // Handle back navigation, for example, you can go back in history
            window.history.back();
          }}
        />
        <h2 className="title">{title}</h2>
        <div className="search-container">
          <img
            src={`${BASE_URL}/images/search.png`}
            alt="Search"
            className="search-icon"
            onClick={() => setIsSearchInputVisible(!isSearchInputVisible)} // Toggle input visibility on click
          />
        </div>
      </div>

      {/* Conditionally render the search input based on isInputVisible */}
      {isSearchInputVisible && (
        <div
          className="search-input-container"
          style={{ marginBottom: "14px" }}
        >
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      <div className="grid-container">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie, index) => (
            <MovieCard
              key={index}
              title={movie.name}
              posterUrl={movie.posterImage}
            />
          ))
        ) : (
          <div className="no-data">No Movies Available</div>
        )}
      </div>
    </div>
  );
};

export default MovieGrid;
