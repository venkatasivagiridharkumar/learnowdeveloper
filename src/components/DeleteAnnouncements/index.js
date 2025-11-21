import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { useState } from "react";

const DeleteAnnouncement = () => {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id.trim()) {
      setError("Please enter an announcement ID.");
      setMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `https://learnow-backmongo-production.up.railway.app/delete-announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete announcement");
      }

      setMessage(
        data.message || `Announcement with ID ${id} deleted successfully.`
      );
      setId("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-announcement-page">
      <div className="delete-announcement-card">
        <h2 className="delete-title">Delete Announcement</h2>
        <p className="delete-subtitle">
          Enter the announcement ID you want to delete.
        </p>

        <form onSubmit={handleSubmit} className="delete-form">
          <div className="mb-3">
            <label htmlFor="announcementId" className="form-label">
              Announcement ID
            </label>
            <input
              id="announcementId"
              type="text"
              className="form-control"
              placeholder="e.g. 101"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Announcement"}
          </button>
        </form>

        {message && <p className="status-message success">{message}</p>}
        {error && <p className="status-message error">{error}</p>}
      </div>
    </div>
  );
};

export default DeleteAnnouncement;
