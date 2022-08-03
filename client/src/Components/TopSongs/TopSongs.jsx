import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bars } from "react-loader-spinner";
import "../TopSongs/TopSongs.css";
import { useGetTopSongsQuery } from "../../Api/spotifyApi";

import Button from "../Common/Button";
import Track from "../Common/Track";
const TopSongs = () => {
  const [range, setRange] = useState("long_term");
  const {
    data: topSongs,
    error,
    isLoading,
    isFetching,
  } = useGetTopSongsQuery({ limit: 50, offset: 0, range });


  console.log("topSongs:", topSongs);
  return (
    <div className="topArtists">
      <h1>Top Songs</h1>
      <div className="main-section-rest">
        <Button range={range} setRange={setRange} />

        <div className="tracks-card-container">
          {isLoading || isFetching ? (
            <div className="loader">
              <Bars color="#00BF00" height="80" width="80" />
            </div>
          ) : (
            topSongs?.items?.map((item, index) => (
              <Track track={item} ind={index} key={item.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TopSongs;
