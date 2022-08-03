import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bars } from "react-loader-spinner";

import "../Dashboard/Dashboard.css";

import {
  useGetRecentlyPlayedQuery,
  useGetTopArtistsQuery,
  useGetTopSongsQuery,
} from "../../Api/spotifyApi";
import { getTopGenres } from "../Common/getTopGenre";

const Dashboard = () => {
  const {
    data: topArtists,
    error,
    isFetching,
  } = useGetTopArtistsQuery({ limit: 5, offset: 0, range: "long_term" });

  const { data: topSongs } = useGetTopSongsQuery({
    limit: 5,
    offset: 0,
    range: "long_term",
  });

  const { data: recent } = useGetRecentlyPlayedQuery(5);
  
  const genres = getTopGenres(topArtists?.items);

  if (isFetching) {
    return (
      <div className="loader">
        <Bars color="#00BF00" height="80" width="80" />
      </div>
    );
  }

  if (error) {
    if (error.status === 401) {
      return <div className="error">Error Please refresh</div>;
    }
    return <div className="error">Error, please logout and then refresh</div>;
  }

  return (
    <div className="dash">
      <h1>Dashboard</h1>

      <div className="main-section">
        {/* Image of Top Artist */}
        <div className="top-image">
          {topArtists && (
            <img
              src={topArtists.items[0].images[0].url}
              alt={topArtists.items[0].name}
            ></img>
          )}
        </div>

        {/* List of Top Artists */}
        <div className="top-artists">
          <div className="title">
            <Link to="topArtists">Top Artists</Link>
          </div>

          {topArtists?.items?.map((artist, i) => (
            <p key={artist.id}>
              <span>#{i + 1}</span> {artist.name}
            </p>
          ))}
        </div>

        {/* List of Top Genres */}
        <div className="top-genre">
          <div className="title">
            <Link to="favouriteGenre">Top Genre</Link>
          </div>
          {genres?.slice(0, 5).map((g, i) => (
            <p key={i}>
              <span>#{i + 1}</span> {g[0]}
            </p>
          ))}
        </div>

        {/* List of Top Songs */}

        <div className="top-songs">
          <div className="title">
            <Link to="topSongs">Top Songs</Link>
          </div>
          {topSongs?.items?.map((song, i) => (
            <p key={song.id}>
              <span>#{i + 1}</span> {song.name}
            </p>
          ))}
        </div>

        {/* Recently Played */}
        <div className="recently-played">
          <div className="title">
            <Link to="recentlyPlayed">Recently played</Link>
          </div>
          {recent?.items?.map((song, i) => (
            <p key={song.id}>
              <span>#{i + 1}</span> {song.track.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
