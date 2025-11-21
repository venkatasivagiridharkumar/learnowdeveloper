import React, { useState, useMemo } from "react";
import "./index.css";

const API_URL = "https://learnow-backmongo-production.up.railway.app/add-jobs";

const AddJob = () => {
  const [form, setForm] = useState({
    id: "",
    company: "",
    role: "",
    link: "",
    ctc: "",
    description: "",
    technologies: "",
    location: "",
    last_date: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  
  const validate = (v) => {
    const e = {};
    Object.entries(v).forEach(([k, val]) => {
      if (!val || !String(val).trim()) e[k] = "This field is required.";
    });
    return e;
  };

  const formErrors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(formErrors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setServerError("");
  };

  const handleBlur = () => {
    const v = validate(form);
    setErrors(v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let json = null;
      try {
        json = await res.json();
      } catch {}

      if (!res.ok) {
        const msg =
          (json && (json.message || JSON.stringify(json))) ||
          `Error ${res.status}`;
        alert(msg);
        setServerError(msg);
      } else {
        alert("Job added successfully");
        setForm({
          id: "",
          company: "",
          role: "",
          link: "",
          ctc: "",
          description: "",
          technologies: "",
          location: "",
          last_date: "",
        });
        setErrors({});
      }
    } catch (err) {
      setServerError("Network error! Try again.");
      alert("Network error!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="aj-root">
      <h2 className="aj-title">Add Job</h2>

      <form className="aj-form" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="aj-server-error">{serverError}</div>}

        {[
          { name: "id", label: "Job ID" },
          { name: "company", label: "Company" },
          { name: "role", label: "Role" },
          { name: "link", label: "Link" },
          { name: "ctc", label: "CTC" },
          { name: "description", label: "Description" },
          { name: "technologies", label: "Technologies" },
          { name: "location", label: "Location" },
          { name: "last_date", label: "Last Date" },
        ].map((field) => (
          <div className="aj-field" key={field.name}>
            <label className="aj-label">{field.label}</label>
            <input
              className={`aj-input ${
                errors[field.name] ? "aj-invalid" : ""
              }`}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`Enter ${field.label}`}
            />
            {errors[field.name] && (
              <div className="aj-error">{errors[field.name]}</div>
            )}
          </div>
        ))}

        <div className="aj-actions">
          <button
            type="submit"
            className="aj-submit"
            disabled={!isValid || submitting}
          >
            {submitting ? "Adding..." : "Add Job"}
          </button>

          <button
            className="aj-reset"
            type="button"
            onClick={() => setForm({
              id: "",
              company: "",
              role: "",
              link: "",
              ctc: "",
              description: "",
              technologies: "",
              location: "",
              last_date: "",
            })}
            disabled={submitting}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
