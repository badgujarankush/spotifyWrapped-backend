import React,{useEffect, useState} from 'react'
import './App.css';
import {accessToken, logout} from './Api/spotify';
import { useGetTopArtistsQuery, useGetTopSongsQuery, useGetRecentlyPlayedQuery, useGetUserQuery, useGetUserPlaylistQuery} from './Api/spotifyApi';


function App() {
  const [token,setToken] = useState(null);
  const {data:topArtists, error, isFetching} = useGetTopArtistsQuery({limit:5,offset:0,range:'long_term'});
  const {data:topSongs } = useGetTopSongsQuery({limit:5,offset:0,range:'long_term'});
  const {data:recent} = useGetRecentlyPlayedQuery(5);
  const { data:user} = useGetUserQuery();
  const user_id = user?.id;
  const {data:playlists} = useGetUserPlaylistQuery(user_id);
  console.log("topArtists",topArtists);
  console.log("top songs",topSongs);
  console.log("recently played",recent);
  console.log("user details",user);
  console.log("playlists",playlists);
  useEffect(() => {
    setToken(accessToken);
  }, []);


  return (
    <div className="App">
    {!token? <a
          className="App-link"
          href="http://localhost:8888/login"
        >
          Login To Spotify
        </a>: 
        <>
        <h1>Logged In</h1>
        <button onClick={logout}>Log Out</button>
        </>
       }
        
    </div>
  );
}

export default App;