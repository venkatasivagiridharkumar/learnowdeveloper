// src/components/UpdateUserDetails.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

const initialState = {
  username: "",
  full_name: "",
  address: "",
  phone: "",
  photo: "",
  highest_study: "",
  college: "",
  graduation_year: "",
  expertise: "",
};

const UpdateUserDetails = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(""); // server / network error
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    // Update photo preview when photo URL changes (debounced lightly)
    const t = setTimeout(() => {
      if (!formData.photo) {
        setPhotoPreview("");
        return;
      }
      try {
        // Accept only valid URLs
        new URL(formData.photo);
        setPhotoPreview(formData.photo);
      } catch {
        setPhotoPreview("");
      }
    }, 300);

    return () => clearTimeout(t);
  }, [formData.photo]);

  const validate = (data) => {
    const e = {};

    if (!data.username || data.username.trim() === "") e.username = "Username is required.";
    if (!data.full_name || data.full_name.trim() === "") e.full_name = "Full name is required.";
    if (!data.address || data.address.trim() === "") e.address = "Address is required.";

    // Basic phone validation (accepts +country and digits, spaces, hyphens, parentheses)
    if (!data.phone || data.phone.trim() === "") {
      e.phone = "Phone is required.";
    } else {
      const phoneNorm = data.phone.trim();
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(phoneNorm)) e.phone = "Enter a valid phone number.";
    }

    // Photo URL (optional? you indicated it is required in payload — we'll require it)
    if (!data.photo || data.photo.trim() === "") {
      e.photo = "Photo URL is required.";
    } else {
      try {
        new URL(data.photo.trim());
      } catch {
        e.photo = "Enter a valid URL for the photo.";
      }
    }

    if (!data.highest_study || data.highest_study.trim() === "")
      e.highest_study = "Highest study is required.";

    if (!data.college || data.college.trim() === "") e.college = "College is required.";

    if (!data.graduation_year || data.graduation_year.trim() === "") {
      e.graduation_year = "Graduation year is required.";
    } else {
      const gy = data.graduation_year.trim();
      if (!/^\d{4}$/.test(gy)) e.graduation_year = "Enter a 4-digit year (e.g. 2025).";
    }

    if (!data.expertise || data.expertise.trim() === "") e.expertise = "Expertise is required.";

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    // clear field error while typing
    setErrors((p) => ({ ...p, [name]: undefined }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const trimmed = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );

    const validation = validate(trimmed);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setFormError("");

    try {
      const payload = {
        username: trimmed.username,
        full_name: trimmed.full_name,
        address: trimmed.address,
        phone: trimmed.phone,
        photo: trimmed.photo,
        highest_study: trimmed.highest_study,
        college: trimmed.college,
        graduation_year: trimmed.graduation_year,
        expertise: trimmed.expertise,
      };

      const res = await fetch("https://learnowbackend2.onrender.com/update-user-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON (if backend responds with JSON)
      let resJson = null;
      try {
        resJson = await res.json();
      } catch (err) {
        // ignore parse error
      }

      if (!res.ok) {
        // If backend returns structured errors, map them to fields where possible
        if (resJson) {
          // if backend returns { errors: { field: 'msg' } } or { message: '...' }
          if (resJson.errors && typeof resJson.errors === "object") {
            setErrors(resJson.errors);
            setFormError(resJson.message || "Validation failed on server.");
          } else if (resJson.message) {
            setFormError(resJson.message);
          } else {
            setFormError(`Server error: ${res.status}`);
          }
        } else {
          setFormError(`Server error: ${res.status}`);
        }
      } else {
        // Success
        const successMsg = (resJson && (resJson.message || "Updated successfully.")) || "Updated successfully.";
        // You can choose to keep the form populated or reset it — we'll keep populated.
        alert(successMsg);
      }
    } catch (err) {
      console.error("Network error:", err);
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    // helpful during testing
    setFormData({
      username: "mallesh143",
      full_name: "Venkata siva giridhar kumar",
      address: "Badvel Andhra Pradesh",
      phone: "+91 9652530489",
      photo: "https://via.placeholder.com/150",
      highest_study: "B tech",
      college: "Siddharth Institute Of Engineering",
      graduation_year: "2025",
      expertise: "Java, Python",
    });
    setErrors({});
    setFormError("");
  };

  return (
    <div className="upd-container">
      <h2>Update User Details</h2>

      <form className="upd-form" onSubmit={handleSubmit} noValidate>
        {formError && <div className="upd-form-error" role="alert">{formError}</div>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="e.g. mallesh143"
          aria-invalid={!!errors.username}
        />
        {errors.username && <div className="upd-field-error">{errors.username}</div>}

        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Full name"
          aria-invalid={!!errors.full_name}
        />
        {errors.full_name && <div className="upd-field-error">{errors.full_name}</div>}

        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          aria-invalid={!!errors.address}
        />
        {errors.address && <div className="upd-field-error">{errors.address}</div>}

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 9xxxxxxxxx"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <div className="upd-field-error">{errors.phone}</div>}

        <label htmlFor="photo">Photo URL</label>
        <input
          id="photo"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          placeholder="https://..."
          aria-invalid={!!errors.photo}
        />
        {errors.photo && <div className="upd-field-error">{errors.photo}</div>}

        {photoPreview && (
          <div className="photo-preview">
            <img src={photoPreview} alt="preview" onError={() => setPhotoPreview("")} />
            <div className="photo-note">Preview</div>
          </div>
        )}

        <label htmlFor="highest_study">Highest Study</label>
        <input
          id="highest_study"
          name="highest_study"
          value={formData.highest_study}
          onChange={handleChange}
          placeholder="B tech / MSc / ... "
          aria-invalid={!!errors.highest_study}
        />
        {errors.highest_study && <div className="upd-field-error">{errors.highest_study}</div>}

        <label htmlFor="college">College</label>
        <input
          id="college"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="College name"
          aria-invalid={!!errors.college}
        />
        {errors.college && <div className="upd-field-error">{errors.college}</div>}

        <label htmlFor="graduation_year">Graduation Year</label>
        <input
          id="graduation_year"
          name="graduation_year"
          value={formData.graduation_year}
          onChange={handleChange}
          placeholder="2025"
          aria-invalid={!!errors.graduation_year}
        />
        {errors.graduation_year && <div className="upd-field-error">{errors.graduation_year}</div>}

        <label htmlFor="expertise">Expertise (comma separated)</label>
        <input
          id="expertise"
          name="expertise"
          value={formData.expertise}
          onChange={handleChange}
          placeholder="Java, Python"
          aria-invalid={!!errors.expertise}
        />
        {errors.expertise && <div className="upd-field-error">{errors.expertise}</div>}

        <div className="upd-actions">
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Details"}
          </button>
          <button type="button" className="btn-demo" onClick={handleFillDemo} disabled={submitting}>
            Fill Demo
          </button>
          <button
            type="button"
            className="btn-reset"
            onClick={() => {
              setFormData(initialState);
              setErrors({});
              setFormError("");
            }}
            disabled={submitting}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserDetails;
