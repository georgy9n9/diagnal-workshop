import React from "react";

interface MovieCardProps {
  title: string;
  posterUrl: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

const MovieCard: React.FC<MovieCardProps> = ({ title, posterUrl }) => {
  return (
    <div className="movie-card">
      <img
        src={`${BASE_URL}/images/${posterUrl}`}
        alt={title}
        className="movie-poster"
      />
      <p className="movie-title">{title}</p>
    </div>
  );
};

export default MovieCard;
