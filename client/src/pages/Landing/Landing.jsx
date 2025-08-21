import React from 'react'
import { Link } from 'react-router-dom';
import videoBg from '../../assets/video-2.mp4'
import './Landing.css'

const Landing = () => {
    return (
        <div className="landing-content">
            <video autoPlay muted loop className="video-bg">
                <source src={videoBg} type="video/mp4" />
            </video>


            <Link to="/home">
                <button className="landing-button">Ingresar</button>
            </Link>



        </div>
    );
}

export default Landing