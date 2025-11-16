import { useState, useEffect } from "react";
import "./index.css";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://learnowback.onrender.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="users-container">
      <h1 className="users-title">Users</h1>

      <ul className="users-list">
        {users.map((u, index) => (
          <li className="user-item" key={index}>
            <div className="user-left">
              <img
                src={
                  u.photo ||
                  "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Images-HD.png"
                }
                alt="avatar"
                className="user-avatar"
              />
            </div>

            <div className="user-right">
              <p className="user-name">{u.username}</p>
              <p className="user-mentor">
                Mentor: <span>{u.mentor_username || "None"}</span>
              </p>
              <p className="user-password">
                Password: <span>{u.password || "N/A"}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
