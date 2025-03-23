import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css';


const Navbar = () => {
  const navigate = useNavigate();
  
  const goToLogout = (e) => {
    e.preventDefault(); 
    navigate('/Login'); 
};

  return (
    <nav className="navheader">
      <div className="logo">
        <img src="https://img.icons8.com/?size=100&id=41643&format=png&color=000000" alt="logo" />
      </div>
      <div className="navbutton">
        <button className="backbtn"  onClick={() => navigate(-1)}>Back</button>
        <button className="logbtn" onClick={goToLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
