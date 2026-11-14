import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="logo">
        <h2>ARTGAN</h2>
        <span>AI Restoration</span>
      </div>

      {/* MENU ICON */}
      <div className="menu-icon" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${open ? "active" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
    </div>
  );
}