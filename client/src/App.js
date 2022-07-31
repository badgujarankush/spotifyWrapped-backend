import React,{useEffect, useState} from 'react'
import './App.css';
import {accessToken, logout} from './Api/spotify';


function App() {
  const [token,setToken] = useState(null);


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
