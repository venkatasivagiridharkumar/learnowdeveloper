import { useEffect, useState } from "react";
import "./index.css";

const DEFAULT_AVATAR =
  "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Images-HD.png";

const UserDetails = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const url = "https://learnowbackend2.onrender.com/user-details";

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load user details");

        const data = await res.json();
        setRows(Array.isArray(data) ? data : [data]);

      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="ud-container">
      <h1 className="ud-title">User Details</h1>

      {loading && <p className="ud-status">Loading…</p>}
      {error && <p className="ud-error">Error: {error}</p>}
      {!loading && rows.length === 0 && <p className="ud-status">No users found</p>}

      <div className="ud-list">
        {rows.map((u, idx) => (
          <div className="ud-card" key={idx}>
            <img
              src={u.photo || DEFAULT_AVATAR}
              alt="avatar"
              className="ud-avatar"
            />

            <div className="ud-info">
              <p><strong>Username:</strong> {u.username}</p>
              <p><strong>Full Name:</strong> {u.full_name}</p>
              <p><strong>Address:</strong> {u.address}</p>
              <p><strong>Phone:</strong> {u.phone}</p>
              <p><strong>Highest Study:</strong> {u.highest_study}</p>
              <p><strong>College:</strong> {u.college}</p>
              <p><strong>Graduation Year:</strong> {u.graduation_year}</p>
              <p><strong>Expertise:</strong> {u.expertise}</p>
              <p><strong>Joined Date:</strong> {u.joined_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetails;
