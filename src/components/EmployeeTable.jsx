import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from "lucide-react";

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function SortHead({ label, field, sort, onSort }) {
  const active = sort.field === field;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" className="sort-btn" onClick={() => onSort(field)}>
        {label}
        <Icon size={14} />
      </button>
    </th>
  );
}

export default function EmployeeTable({ employees, sort, onSort, onEdit, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <SortHead label="Name" field="name" sort={sort} onSort={onSort} />
          <SortHead label="Role" field="role" sort={sort} onSort={onSort} />
          <th>Email</th>
          <th>Phone</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id}>
            <td data-label="Name">
              <div className="person">
                <span className="avatar" aria-hidden="true">{initials(emp.name)}</span>
                <span className="person-name">{emp.name}</span>
              </div>
            </td>
            <td data-label="Role"><span className="role-pill">{emp.role || "Not set"}</span></td>
            <td data-label="Email"><a href={`mailto:${emp.email}`}>{emp.email}</a></td>
            <td data-label="Phone">{emp.phone || "Not added"}</td>
            <td className="actions-col">
              <div className="row-actions">
                <button type="button" className="btn btn-ghost" onClick={() => onEdit(emp)} aria-label={`Edit ${emp.name}`}>
                  <Pencil size={15} /> Edit
                </button>
                <button type="button" className="btn btn-ghost danger" onClick={() => onDelete(emp)} aria-label={`Delete ${emp.name}`}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
