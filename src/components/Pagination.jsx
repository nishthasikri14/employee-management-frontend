import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, totalItems, pageSize, onChange }) {
  if (totalItems === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="muted">Showing {from} to {to} of {totalItems}</span>
      <div className="pager">
        <button type="button" className="btn btn-ghost" disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="page-num">Page {page} of {totalPages}</span>
        <button type="button" className="btn btn-ghost" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
          Next <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
