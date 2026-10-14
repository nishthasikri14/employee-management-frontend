import { useMemo, useState } from "react";
import { Plus, RotateCcw, SearchX, Users } from "lucide-react";
import { useEmployees } from "./hooks/useEmployees";
import SearchBar from "./components/SearchBar";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import ConfirmDialog from "./components/ConfirmDialog";
import Pagination from "./components/Pagination";
import "./App.css";

const PAGE_SIZE = 6;

export default function App() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, resetEmployees } = useEmployees();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ field: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState({ open: false, employee: null });
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState("");

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  };

  // 1. filter  2. sort  3. paginate
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? employees.filter((e) => [e.name, e.role, e.email].some((v) => v.toLowerCase().includes(q)))
      : employees;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => a[sort.field].localeCompare(b[sort.field]) * dir);
  }, [employees, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // handles deleting the last item on a page
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (field) => {
    setSort((s) => (s.field === field ? { field, dir: s.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }));
    setPage(1);
  };

  const handleSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  const closeForm = () => setFormState({ open: false, employee: null });

  const handleSave = (data) => {
    if (formState.employee) {
      updateEmployee(formState.employee.id, data);
      flash(`${data.name} updated`);
    } else {
      addEmployee(data);
      setQuery("");
      setSort({ field: "name", dir: "asc" });
      flash(`${data.name} added`);
    }
    closeForm();
  };

  const handleDelete = () => {
    deleteEmployee(toDelete.id);
    flash(`${toDelete.name} deleted`);
    setToDelete(null);
  };

  // emails already used by other employees (for the duplicate check)
  const otherEmails = employees
    .filter((e) => e.id !== formState.employee?.id)
    .map((e) => e.email.toLowerCase());

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><Users size={18} /></span>
          <span>Staffroom</span>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => { resetEmployees(); setPage(1); flash("Sample data restored"); }}>
          <RotateCcw size={15} /> Reset sample data
        </button>
      </header>

      <main className="content">
        <section className="intro">
          <div>
            <h1>Employees</h1>
            <p className="muted">{employees.length} {employees.length === 1 ? "person" : "people"} in your directory</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setFormState({ open: true, employee: null })}>
            <Plus size={16} /> Add employee
          </button>
        </section>

        <section className="panel">
          <div className="toolbar">
            <SearchBar value={query} onChange={handleSearch} />
            <span className="muted">{filtered.length} {filtered.length === 1 ? "match" : "matches"}</span>
          </div>

          {employees.length === 0 ? (
            <div className="empty">
              <Users size={28} />
              <h3>No employees yet</h3>
              <p className="muted">Add your first employee to start the directory.</p>
              <button type="button" className="btn btn-primary" onClick={() => setFormState({ open: true, employee: null })}>
                <Plus size={16} /> Add employee
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <SearchX size={28} />
              <h3>No results for "{query}"</h3>
              <p className="muted">Check the spelling or try a role or email instead.</p>
              <button type="button" className="btn btn-ghost" onClick={() => handleSearch("")}>Clear search</button>
            </div>
          ) : (
            <>
              <EmployeeTable
                employees={pageItems}
                sort={sort}
                onSort={handleSort}
                onEdit={(emp) => setFormState({ open: true, employee: emp })}
                onDelete={setToDelete}
              />
              <Pagination page={currentPage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
            </>
          )}
        </section>
      </main>

      {formState.open && (
        <EmployeeForm employee={formState.employee} otherEmails={otherEmails} onSave={handleSave} onClose={closeForm} />
      )}
      {toDelete && <ConfirmDialog employee={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="toast" role="status" aria-live="polite">{notice}</div>
    </div>
  );
}
