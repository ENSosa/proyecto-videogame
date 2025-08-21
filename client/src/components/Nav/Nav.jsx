import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import "./Nav.css";

const Nav = () => {
    return (
        <nav className="nav-container">
            <div className="nav-left">VideoGames</div>

            <div className="nav-center">
                <SearchBar />
            </div>

            <div className="nav-right">
                <Link to="/home" className="nav-link">Inicio</Link>
                <Link to="/create" className="nav-link">Crear Videojuego</Link>
            </div>
        </nav>
    );
};

export default Nav;
