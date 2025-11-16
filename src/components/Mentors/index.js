import React, { useEffect, useState, useMemo } from "react";
import "./index.css";

const API_URL = "https://learnowback.onrender.com/mentors-details";

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(d);
  } catch {
    return iso;
  }
};

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("experience");
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchMentors = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error(`Server responded ${res.status}`);

        const data = await res.json();
        if (mounted) {
          setMentors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to fetch mentors");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMentors();
    return () => { mounted = false; };
  }, [refreshCounter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = mentors.slice();

    if (q) {
      list = list.filter((m) => {
        const name = (m.name || "").toLowerCase();
        const username = (m.username || "").toLowerCase();
        const expertise = (m.expertise || "").toLowerCase();
        return name.includes(q) || username.includes(q) || expertise.includes(q);
      });
    }

    if (sortBy === "experience") {
      list.sort((a, b) => (Number(b.experience) || 0) - (Number(a.experience) || 0));
    } else {
      list.sort((a, b) => new Date(b.joining_date) - new Date(a.joining_date));
    }

    return list;
  }, [mentors, query, sortBy]);

  return (
    <div className="mentors-root">
      <div className="mentors-topbar">
        <h1 className="mentors-title">Mentors</h1>

        <div className="mentors-controls">
          <input
            className="mentors-search"
            type="search"
            placeholder="Search name, username or expertise..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="mentors-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="experience">Sort by experience</option>
            <option value="joining_date">Sort by joining date</option>
          </select>

          <button
            className="mentors-btn"
            onClick={() => setRefreshCounter((c) => c + 1)}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && mentors.length === 0 ? (
        <div className="mentors-loading">Loading mentors…</div>
      ) : error ? (
        <div className="mentors-error">
          <strong>Error: </strong> {error}
          <button className="mentors-btn" onClick={() => setRefreshCounter(c => c + 1)}>
            Retry
          </button>
        </div>
      ) : (
        filtered.length === 0 ? (
          <div className="mentors-empty">No mentors found.</div>
        ) : (
          <div className="mentor-table">
            {filtered.map((m, i) => {
              const {
                name,
                username,
                expertise,
                experience,
                phone,
                linkedin,
                bio,
                photo,
                joining_date
              } = m;

              return (
                <div className="mentor-row" key={i}>
                  <div className="mentor-row-left">
                    <img
                      className="mentor-row-img"
                      src={photo || "https://via.placeholder.com/140?text=No+Photo"}
                      alt={name}
                      onError={(e) => e.target.src = "https://via.placeholder.com/140?text=No+Photo"}
                    />
                  </div>

                  <div className="mentor-row-right">
                    <h2 className="mentor-row-name">
                      {name || username}
                    </h2>
                    <div className="mentor-row-username">@{username}</div>

                    <p className="mentor-row-bio">{bio}</p>

                    <div className="mentor-row-details">
                      <p><strong>Expertise:</strong> {expertise}</p>
                      <p><strong>Experience:</strong> {experience} yrs</p>
                      <p><strong>Joined:</strong> {formatDate(joining_date)}</p>
                      <p><strong>Phone:</strong> {phone}</p>
                    </div>

                    <div className="mentor-row-actions">
                      {phone && (
                        <a href={`tel:${phone}`} className="btn-ghost">
                          📞 Call
                        </a>
                      )}
                      {linkedin && (
                        <a href={linkedin} target="_blank" rel="noreferrer" className="btn-primary">
                          LinkedIn ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default Mentors;
