import { useEffect } from "react";

export default function ConfirmDialog({ employee, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="overlay" onMouseDown={onCancel}>
      <div className="dialog dialog-sm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(e) => e.stopPropagation()}>
        <h2 id="confirm-title">Delete {employee.name}?</h2>
        <p className="muted">This removes the employee from the list. You cannot undo this.</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Keep employee</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} autoFocus>Delete employee</button>
        </div>
      </div>
    </div>
  );
}
