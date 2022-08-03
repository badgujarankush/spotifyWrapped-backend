import React,{useEffect, useState} from 'react'
import './App.css';
import {accessToken, logout} from './Api/spotifyApi';
// import { useGetTopArtistsQuery, useGetTopSongsQuery, useGetRecentlyPlayedQuery, useGetUserQuery, useGetUserPlaylistQuery} from './Api/spotifyApi';
import { Link } from "react-router-dom";
import LandingPage from "./Components/LandingPage/LandingPage";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Components/Dashboard/Dashboard";
import TopArtists from "./Components/TopArtists/TopArtists";
import TopSongs from "./Components/TopSongs/TopSongs";
import { Routes, Route } from "react-router-dom";
import RecentlyPlayed from "./Components/RecentlyPlayed/RecentlyPlayed";
import Playlist from "./Components/Playlists/Playlist";
import FavouriteGenre from "./Components/TopGenre/FavouriteGenre";

function App() {
  const [token,setToken] = useState(null);

  const [isActive, setActive] = useState("false");
  const handleToggle=()=>{
      setActive(!isActive);
      
  }
  useEffect(() => {
    setToken(accessToken);
  }, []);


  return (
    // <div className="App">
    // {!token? <a
    //       className="App-link"
    //       href="http://localhost:8888/login"
    //     >
    //       Login To Spotify
    //     </a>: 
    //     <>
    //     <h1>Logged In</h1>
    //     <button onClick={logout}>Log Out</button>
    //     </>
    //    }
        
    // </div>
    <div className="App">
    {/* {!token ? <LandingPage /> : <a onClick={logout}>Logout</a>} */}
    {!token ? (
      <LandingPage />
    ) : (
      <>
        <div className="dashboard">
          <div className={"navbar" +(!isActive ? " nav-active":"")}>
            <Navbar logout={logout} />
          </div>
          <div className="main">
            <div className="header">
            <Link to='/' className="banner">Wrapped</Link>
            <div onClick={handleToggle} className={"burgerMenu" + (!isActive? " toggle": "")}>
              <div className="line1"></div>
              <div className="line2"></div>
              <div className="line3"></div>
            </div>
            {/* <BurgerMenu/> */}
            </div>
            <Routes>
              <Route index exact path="/" element={<Dashboard />} />
              <Route exact path="/topArtists" element={<TopArtists />} />
              <Route exact path="/topSongs" element={<TopSongs />} />
              <Route exact path="/recentlyPlayed" element={<RecentlyPlayed />} />
              <Route exact path="/playlists" element={<Playlist />} />
              <Route exact path="/favouriteGenre" element={<FavouriteGenre />} />
            </Routes>
          </div>
        </div>
      </>
    )}
  </div>
  );
}

export default App;