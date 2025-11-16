// src/components/AddUsers.jsx
import { useState } from "react";
import "./index.css";

const AddUsers = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    mentorUsername: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (data) => {
    const err = {};
    const username = (data.username || "").trim();
    const password = (data.password || "").trim();
    const mentor = (data.mentorUsername || "").trim();

    if (!username) err.username = "Username is required.";
    else if (username.length < 3) err.username = "Username must be at least 3 characters.";

    if (!password) err.password = "Password is required.";
    else if (password.length < 6) err.password = "Password must be at least 6 characters.";

    if (!mentor) err.mentorUsername = "Mentor username is required.";

    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error for field while typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // trim inputs before validating/submitting
    const trimmedData = {
      username: formData.username.trim(),
      password: formData.password.trim(),
      mentorUsername: formData.mentorUsername.trim(),
    };

    const validationErrors = validate(trimmedData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
          const payload = {
        username: trimmedData.username,
        password: trimmedData.password,
        mentor_username: trimmedData.mentorUsername,
      };

      const res = await fetch("https://learnowback.onrender.com/add-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let resJson = null;
        resJson = await res.json();
     
      if (!res.ok) {
        const message =
          (resJson && (resJson.message || resJson.error)) ||
          `Server responded with status ${res.status}`;
        setErrors({ form: message });
        alert("Error: " + message);
      } else {
        alert("User added successfully!");
        setFormData({ username: "", password: "", mentorUsername: "" });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ form: "Network error. Please try again." });
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-container">
      <h1>Add User to the User Table</h1>

      <form onSubmit={handleSubmit} className="user-form" noValidate>
        {errors.form && <div className="form-error">{errors.form}</div>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Enter username"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <div id="username-error" className="field-error">
            {errors.username}
          </div>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <div id="password-error" className="field-error">
            {errors.password}
          </div>
        )}

        <label htmlFor="mentorUsername">Mentor Username</label>
        <input
          id="mentorUsername"
          type="text"
          name="mentorUsername"
          value={formData.mentorUsername}
          onChange={handleChange}
          required
          placeholder="Enter mentor username"
          aria-invalid={!!errors.mentorUsername}
          aria-describedby={errors.mentorUsername ? "mentor-error" : undefined}
        />
        {errors.mentorUsername && (
          <div id="mentor-error" className="field-error">
            {errors.mentorUsername}
          </div>
        )}

        <button type="submit" disabled={submitting} className="submit-btn">
          {submitting ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
