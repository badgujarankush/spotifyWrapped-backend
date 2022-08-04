import React from 'react'
import logo from '../../Images/logos_spotify-icon.png';
import background from '../../Images/background.png';
import '../LandingPage/LandingPage.css';

const LOGIN_URI =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8888/login'
    : 'https://spotwrap.herokuapp.com/login';
const LandingPage = () => {
  
  return (
    <div className='landing-page'>
      <div className='title'>
        <div className='logo'><img src={logo} alt='logo'/></div>
        <h1>SPOTIFY WRAPPED</h1>
      </div>
      <div className='content'>
        <img src={background} alt='drop'/>
        <div className='description'><h1>Find your <br></br><span>TOP</span><br></br>ARTISTS.<br></br>SONGS.</h1>
        <p>Dont need to wait for year-end to find your wrapped up. Get your spotify wrapped <span>now</span></p>
        <a href={LOGIN_URI}>Continue with Spotify</a></div>
        
      </div>
    </div>
  )
}

export default LandingPage