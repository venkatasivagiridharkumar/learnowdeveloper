
import React, { useState, useMemo } from "react";
import "./index.css";

const API_URL = "https://learnowback.onrender.com/add-coding-question";

const isValidHttpUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const AddQuestion = () => {
  const [form, setForm] = useState({ name: "", difficulty: "Easy", link: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = (values) => {
    const e = {};
    if (!values.name || !values.name.trim()) e.name = "Question name is required.";
    if (!values.difficulty || !["Easy", "Medium", "Hard"].includes(values.difficulty))
      e.difficulty = "Choose a difficulty.";
    if (!values.link || !values.link.trim()) e.link = "Link is required.";
    else if (!isValidHttpUrl(values.link.trim())) e.link = "Enter a valid http(s) URL.";
    return e;
  };

  // memoized validity
  const formErrors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(formErrors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setServerError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const v = validate(form);
    setErrors((p) => ({ ...p, [name]: v[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = {
      name: form.name.trim(),
      difficulty: form.difficulty,
      link: form.link.trim(),
    };

    const v = validate(trimmed);
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
        body: JSON.stringify(trimmed),
      });

      let resJson = null;
      try { resJson = await res.json(); } catch {}

      if (!res.ok) {
        const msg = (resJson && (resJson.message || JSON.stringify(resJson))) || `Server error ${res.status}`;
        setServerError(msg);
        alert("Failed to add question: " + msg);
      } else {
        const successMsg = (resJson && (resJson.message || "Question added")) || "Question added";
        alert(successMsg);
        setForm({ name: "", difficulty: "Easy", link: "" });
        setErrors({});
      }
    } catch (err) {
      console.error(err);
      setServerError("Network error. Please try again.");
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="aq-root" aria-live="polite">
      <h2 className="aq-title">Add Coding Question</h2>

      <form className="aq-form" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="aq-server-error" role="alert">{serverError}</div>}

        <label className="aq-label" htmlFor="q-name">Question name</label>
        <input
          id="q-name"
          name="name"
          className={`aq-input ${errors.name ? "aq-invalid" : ""}`}
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Fibonacci"
          autoComplete="off"
        />
        {errors.name && <div className="aq-field-error">{errors.name}</div>}

        <label className="aq-label" htmlFor="q-difficulty">Difficulty</label>
        <select
          id="q-difficulty"
          name="difficulty"
          className={`aq-select ${errors.difficulty ? "aq-invalid" : ""}`}
          value={form.difficulty}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        {errors.difficulty && <div className="aq-field-error">{errors.difficulty}</div>}

        <label className="aq-label" htmlFor="q-link">Link (http/https)</label>
        <input
          id="q-link"
          name="link"
          className={`aq-input ${errors.link ? "aq-invalid" : ""}`}
          value={form.link}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://example.com/problem"
        />
        {errors.link && <div className="aq-field-error">{errors.link}</div>}

        <div className="aq-actions">
          <button
            type="submit"
            className="aq-submit"
            disabled={!isValid || submitting}
            aria-disabled={!isValid || submitting}
          >
            {submitting ? "Adding..." : "Add Question"}
          </button>

          <button
            type="button"
            className="aq-reset"
            onClick={() => { setForm({ name: "", difficulty: "Easy", link: "" }); setErrors({}); setServerError(""); }}
            disabled={submitting}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
