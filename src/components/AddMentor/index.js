import React, { useState} from "react";
import "./index.css";

const API_URL = "https://learnowbackmongo.onrender.com/add-mentor";

const isValidUrl = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;

const AddMentor = () => {
  const [form, setForm] = useState({
    username: "",
    name: "",
    phone: "",
    Photo: "",
    expertise: "",
    experience: "",
    bio: "",
    linkedIn: ""
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validate fields and return an errors object
  const validate = (values) => {
    const e = {};
    if (!values.username.trim()) e.username = "Username is required.";
    if (!values.name.trim()) e.name = "Name is required.";

    if (!values.phone.trim()) e.phone = "Phone is required.";
    else if (!phoneRegex.test(values.phone.trim())) e.phone = "Enter a valid phone number.";

    if (!values.Photo.trim()) e.Photo = "Photo URL is required.";
    else if (!isValidUrl(values.Photo.trim())) e.Photo = "Photo must be a valid URL (http/https).";

    if (!values.expertise.trim()) e.expertise = "Expertise is required.";

    if (values.experience === "" || values.experience === null) {
      e.experience = "Experience (years) is required.";
    } else {
      const n = Number(values.experience);
      if (!Number.isFinite(n) || n < 0) e.experience = "Enter a valid non-negative number.";
    }

    if (!values.bio.trim()) e.bio = "Bio is required.";

    if (!values.linkedIn.trim()) e.linkedIn = "LinkedIn URL is required.";
    else if (!isValidUrl(values.linkedIn.trim())) e.linkedIn = "LinkedIn must be a valid URL (http/https).";

    return e;
  };

  // derived: is form valid
  const formErrors = validate(form);
  const isValid = Object.keys(formErrors).length === 0;

  // update field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );

    const validation = validate(trimmed);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setServerError("");

    try {
      // ensure experience is number in payload
      const payload = {
        username: trimmed.username,
        name: trimmed.name,
        phone: trimmed.phone,
        Photo: trimmed.Photo,
        expertise: trimmed.expertise,
        experience: Number(trimmed.experience),
        bio: trimmed.bio,
        linkedIn: trimmed.linkedIn
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let resJson = null;
      try { resJson = await res.json(); } catch (err) { /* ignore non-json */ }

      if (!res.ok) {
        const msg = (resJson && (resJson.message || JSON.stringify(resJson))) || `Server error ${res.status}`;
        setServerError(msg);
        alert("Error: " + msg);
      } else {
        const successMsg = (resJson && (resJson.message || "Mentor added successfully")) || "Mentor added successfully";
        alert(successMsg);
        setForm({
          username: "",
          name: "",
          phone: "",
          Photo: "",
          expertise: "",
          experience: "",
          bio: "",
          linkedIn: ""
        });
      }
    } catch (err) {
      console.error("Network error:", err);
      setServerError("Network error. Please try again.");
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // optional: live validate on blur to show errors early
  const handleBlur = (e) => {
    const { name } = e.target;
    const v = { ...form };
    const validation = validate(v);
    setErrors((p) => ({ ...p, [name]: validation[name] }));
  };

  return (
    <div className="am-root">
      <h1 className="am-title">Add Mentor</h1>

      <form className="am-form" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="am-server-error" role="alert">{serverError}</div>}

        <label className="am-label">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`am-input ${errors.username ? "am-invalid" : ""}`}
          placeholder="e.g. Charan"
        />
        {errors.username && <div className="am-field-error">{errors.username}</div>}

        <label className="am-label">Full name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`am-input ${errors.name ? "am-invalid" : ""}`}
          placeholder="e.g. Meda Sree Ram Charan"
        />
        {errors.name && <div className="am-field-error">{errors.name}</div>}

        <label className="am-label">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`am-input ${errors.phone ? "am-invalid" : ""}`}
          placeholder="+91 9989550883"
        />
        {errors.phone && <div className="am-field-error">{errors.phone}</div>}

        <label className="am-label">Photo URL</label>
        <input
          name="Photo"
          value={form.Photo}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`am-input ${errors.Photo ? "am-invalid" : ""}`}
          placeholder="https://..."
        />
        {errors.Photo && <div className="am-field-error">{errors.Photo}</div>}

        <label className="am-label">Expertise (comma separated)</label>
        <input
          name="expertise"
          value={form.expertise}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`am-input ${errors.expertise ? "am-invalid" : ""}`}
          placeholder="Java, Python, SQL"
        />
        {errors.expertise && <div className="am-field-error">{errors.expertise}</div>}

        <label className="am-label">Experience (years)</label>
        <input
          name="experience"
          type="number"
          min="0"
          value={form.experience}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`am-input ${errors.experience ? "am-invalid" : ""}`}
          placeholder="3"
        />
        {errors.experience && <div className="am-field-error">{errors.experience}</div>}

        <label className="am-label">Short Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`am-textarea ${errors.bio ? "am-invalid" : ""}`}
          placeholder="Short bio (e.g. Ready to Help you 24/7)"
          rows={3}
        />
        {errors.bio && <div className="am-field-error">{errors.bio}</div>}

        <label className="am-label">LinkedIn URL</label>
        <input
          name="linkedIn"
          value={form.linkedIn}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`am-input ${errors.linkedIn ? "am-invalid" : ""}`}
          placeholder="https://linkedin"
        />
        {errors.linkedIn && <div className="am-field-error">{errors.linkedIn}</div>}

        <div className="am-actions">
          <button
            type="submit"
            className="am-submit"
            disabled={!isValid || submitting}
            aria-disabled={!isValid || submitting}
          >
            {submitting ? "Adding..." : "Add Mentor"}
          </button>

          <button
            type="button"
            className="am-reset"
            onClick={() => { setForm({
              username: "",
              name: "",
              phone: "",
              Photo: "",
              expertise: "",
              experience: "",
              bio: "",
              linkedIn: ""
            }); setErrors({}); setServerError(""); }}
            disabled={submitting}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMentor;
