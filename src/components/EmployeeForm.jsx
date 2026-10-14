import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns an object of field -> message. Empty object means valid.
function validate(values, otherEmails) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim().toLowerCase();
  const phone = values.phone.trim();

  if (!name) errors.name = "Enter the employee's name.";
  else if (name.length < 2) errors.name = "Name needs at least 2 characters.";

  if (!values.role.trim()) errors.role = "Enter a role, like Software Engineer.";

  if (!email) errors.email = "Enter an email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email, like name@company.com.";
  else if (otherEmails.includes(email)) errors.email = "Another employee already uses this email.";

  if (phone && !/^\d{10}$/.test(phone)) errors.phone = "Phone must be exactly 10 digits.";

  return errors;
}

export default function EmployeeForm({ employee, otherEmails, onSave, onClose }) {
  const isEdit = Boolean(employee);
  const [values, setValues] = useState({
    name: employee?.name ?? "",
    role: employee?.role ?? "",
    email: employee?.email ?? "",
    phone: employee?.phone ?? "",
  });
  const [touched, setTouched] = useState({});
  const firstField = useRef(null);

  const errors = validate(values, otherEmails);
  const show = (field) => touched[field] && errors[field];

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, role: true, email: true, phone: true });
    if (Object.keys(errors).length > 0) return;
    onSave({
      name: values.name.trim(),
      role: values.role.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
    });
  };

  const field = (name, label, props = {}) => (
    <div className={`field ${show(name) ? "has-error" : ""}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      <input
        id={`f-${name}`}
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={Boolean(show(name))}
        aria-describedby={show(name) ? `e-${name}` : undefined}
        ref={name === "name" ? firstField : null}
        {...props}
      />
      {show(name) && <p className="error" id={`e-${name}`}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form className="dialog" noValidate onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="form-title" onMouseDown={(e) => e.stopPropagation()}>
        <div className="dialog-head">
          <h2 id="form-title">{isEdit ? "Edit employee" : "Add employee"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close form"><X size={18} /></button>
        </div>

        {field("name", "Full name", { type: "text", autoComplete: "off", placeholder: "Aarav Sharma" })}
        {field("role", "Role", { type: "text", placeholder: "Software Engineer" })}
        {field("email", "Email", { type: "email", placeholder: "aarav@company.com" })}
        {field("phone", "Phone (optional)", { type: "tel", inputMode: "numeric", maxLength: 10, placeholder: "9876543210" })}

        <div className="dialog-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{isEdit ? "Save changes" : "Add employee"}</button>
        </div>
      </form>
    </div>
  );
}
