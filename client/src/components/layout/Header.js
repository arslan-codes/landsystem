import { React, useState } from "react";
import { NavLink } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import "../../styles/authstyle.css";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("data"));
  const [account, setAccount] = useState(null);

  function logout() {
    localStorage.clear();
    window.location = "/";
  }

  async function requestAccount() {
    console.log("Requesting account...");

    // Check if Meta Mask Extension exists
    if (window.ethereum) {
      console.log("detected");

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log(accounts);
      } catch (error) {
        console.log("Error connecting...");
      }
    } else {
      alert("Meta Mask not detected");
    }
  }

  return (
    <section className="h-wrapper">
      <div className="flexCenter paddings innerWidth h-container">
        <NavLink to="" className="nav-link"></NavLink>

        <div className="flexCenter h-menu">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/LandInspector" className="nav-link">
            LandInspector
          </NavLink>
          <NavLink to="/sellerpage" className="nav-link">
            Sell Property
          </NavLink>
          <NavLink to="/BuyProperty" className="nav-link">
            Buy Property
          </NavLink>
          {/* <NavLink to="/Marketplace" className="nav-link">
            Marketplace
          </NavLink> */}
          <NavLink to="/Property" className="nav-link"></NavLink>

          <NavLink to="/about" className="nav-link">
            About Us
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact Us
          </NavLink>

          <NavLink to="/register" className="nav-link">
            SignUp/Login
          </NavLink>

          {localStorage.getItem("data") ? (
            <button className="button" onClick={requestAccount}>
              Connect wallet
            </button>
          ) : null}
        </div>
        {localStorage.getItem("data") ? (
          <NavDropdown title={user && user.email}>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        ) : null}
      </div>
    </section>
  );
};

export default Header;
