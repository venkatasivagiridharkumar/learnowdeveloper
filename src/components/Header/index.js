import { useEffect, useRef, useState } from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdown on outside click or Esc key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <nav className="nav-container" aria-label="Main navigation">
      <div className="logo-container">
        <img
          src="https://live.staticflickr.com/65535/54910103636_05549c31fa_c.jpg"
          className="nav-logo"
          alt="Learnow Tech"
        />
      </div>

      <div className="nav-profile-container">
        <p className="nav-name-element">Venkata Siva Giridhar Kumar</p>

        {/* Profile Button */}
        <button
          ref={btnRef}
          className="nav-profile-button"
          aria-haspopup="menu"
          aria-expanded={open ? "true" : "false"}
          aria-controls="profile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <img
            src="https://live.staticflickr.com/65535/54908701162_ae0926c4e9_n.jpg"
            className="nav-profile-image"
            alt="Venkata Siva Giridhar Kumar"
          />
          <span className="nav-caret" aria-hidden="true">▾</span>
        </button>
        <div
          id="profile-menu"
          ref={menuRef}
          role="menu"
          className={`profile-menu ${open ? "is-open" : ""}`}
        >
          <Link to="/users" className="profile-menu-item">Users</Link>
          <Link to="/add-users" className="profile-menu-item">Add Users</Link>
          <Link to="/user-details" className="profile-menu-item">User Details</Link>
          <Link to="/update-user-details" className="profile-menu-item">Update Users Details</Link>
          <Link to="/mentors" className="profile-menu-item">Mentors</Link>
          <Link to="/add-mentor" className="profile-menu-item">Add Mentors</Link>
          <Link to="/questions" className="profile-menu-item">Questions</Link>
          <Link to="/add-question" className="profile-menu-item">Add Questions</Link>
          <Link to="/jobs" className="profile-menu-item">Jobs</Link>
          <Link to="/add-job" className="profile-menu-item">Add Jobs</Link>
          <Link to="/delete-job" className="profile-menu-item">Delete Jobs</Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Header;
