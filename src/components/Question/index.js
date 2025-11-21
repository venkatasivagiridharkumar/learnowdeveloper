import React, { useEffect, useState } from "react";
import "./index.css";

const API_URL = "https://learnowbackmongo.onrender.com/coding-questions";

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (mounted) setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch questions error:", err);
        if (mounted) setError(err.message || "Failed to load questions");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="ql-root">
      <header className="ql-header">
        <h1 className="ql-title">Coding Questions</h1>
        <p className="ql-sub">Displaying all questions — view-only.</p>
      </header>

      {loading ? (
        <div className="ql-state">Loading questions…</div>
      ) : error ? (
        <div className="ql-state ql-error">Error: {error}</div>
      ) : questions.length === 0 ? (
        <div className="ql-state">No questions available.</div>
      ) : (
        <div className="ql-list">
          {questions.map((q) => (
            <article className="ql-row" key={q.id ?? `${q.name}-${Math.random()}`}>
              <div className="ql-left">
                <div className="ql-id">#{q.id}</div>
              </div>

              <div className="ql-main">
                <div className="ql-top">
                  <h2 className="ql-name">{q.name}</h2>
                  <div className={`ql-difficulty ql-${(q.difficulty || "").toLowerCase()}`}>
                    {q.difficulty || "Unknown"}
                  </div>
                </div>

                <p className="ql-meta">
                  <strong>Link:</strong>{" "}
                  <a className="ql-link" href={q.link} target="_blank" rel="noopener noreferrer">
                    {q.link}
                  </a>
                </p>

                <div className="ql-details">
                  {Object.entries(q).map(([key, value]) => {
                    if (["id", "name", "difficulty", "link"].includes(key)) return null;
                    return (
                      <div className="ql-detail" key={key}>
                        <span className="ql-detail-key">{key}:</span>{" "}
                        <span className="ql-detail-val">{String(value ?? "—")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Question;
