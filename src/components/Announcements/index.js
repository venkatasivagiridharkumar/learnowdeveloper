import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { useState, useEffect } from "react";

const Announcements = () => {
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAnnouncementsList = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://learnowback.onrender.com/announcements");

      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }

      const data = await response.json();
      
      setAnnouncementsList(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncementsList();
  }, []);

  return (
    <div className="users-container">
      <h1 className="users-title">Announcements</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && announcementsList.length === 0 && (
        <p>No announcements found.</p>
      )}

      <ul className="users-list">
        {announcementsList.map((item) => (
          <li key={item.id} className="user-item">
            <p>{item.id}</p>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <p>{item.date}</p>
            <p>{item.duration}</p>
            <p>{item.duration}</p>
            <p>{item.link}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
