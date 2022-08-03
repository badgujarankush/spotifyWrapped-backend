import React, { useEffect, useState } from "react";
import { useGetRecentlyPlayedQuery } from "../../Api/spotifyApi";
import { Bars } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Recent from "../Common/Recent";
import "./RecentlyPlayed.css";
import refresh from "../../Images/refresh.png";
const RecentlyPlayed = () => {
  const {
    data: recent,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetRecentlyPlayedQuery(50);


  if (error) {
    return <div className="error">Error</div>;
  }

  return (
    <div className="topArtists">
      
      <div className="top-header">
        <h1>Recently Played</h1>
        <img onClick={refetch} src={refresh} alt="reload" />
      </div>
  

      <div className="main-section-rest">
        <div className="recent-tracks-card-container">
          {isLoading || isFetching ? (
            <div className="loader">
              <Bars color="#00BF00" height="80" width="80" />
            </div>
          ) : (
            recent?.items?.map((song, i) => (
              <Recent track={song.track} time={song} key={song.id}/>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentlyPlayed;
