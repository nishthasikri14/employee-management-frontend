import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        placeholder="Search by name, role or email"
        aria-label="Search employees"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="icon-btn" aria-label="Clear search" onClick={() => onChange("")}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}
