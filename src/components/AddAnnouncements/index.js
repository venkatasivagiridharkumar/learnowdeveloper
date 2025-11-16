import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { useState } from "react";

const AddAnnouncement = () => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    duration: "",
    time: "",
    link: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Simple required check (you can extend this)
    if (
      !formData.id ||
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.duration ||
      !formData.time
    ) {
      setErrorMsg("Please fill in all required fields (*)");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://learnowback.onrender.com/add-announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add announcement");
      }

      setSuccessMsg("Announcement added successfully!");
      setFormData({
        id: "",
        title: "",
        description: "",
        date: "",
        duration: "",
        time: "",
        link: "",
      });
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ann-container">
      <div className="ann-card">
        <h1 className="ann-title">Add Announcement</h1>

        {successMsg && <p className="ann-msg ann-msg-success">{successMsg}</p>}
        {errorMsg && <p className="ann-msg ann-msg-error">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="row g-3 ann-form">
          <div className="col-12 col-md-6">
            <label htmlFor="id" className="form-label">
              ID *
            </label>
            <input
              type="number"
              id="id"
              name="id"
              className="form-control"
              value={formData.id}
              onChange={handleChange}
              placeholder="Enter ID"
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>

          <div className="col-12">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="date" className="form-label">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="time" className="form-label">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              className="form-control"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="duration" className="form-label">
              Duration (e.g. 2 hours) *
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              className="form-control"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration"
            />
          </div>

          <div className="col-12">
            <label htmlFor="link" className="form-label">
              Link (optional)
            </label>
            <input
              type="url"
              id="link"
              name="link"
              className="form-control"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="col-12 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary ann-submit-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncement;
