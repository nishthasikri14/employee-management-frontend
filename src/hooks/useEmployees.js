import { useCallback, useEffect, useState } from "react";
import { initialEmployees } from "../data/employees";

const STORAGE_KEY = "ems.employees.v1";

// Read saved employees, fall back to the JSON array if nothing valid is stored
function loadEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // corrupted or blocked storage, use defaults
  }
  return initialEmployees;
}

export function useEmployees() {
  const [employees, setEmployees] = useState(loadEmployees);

  // Persist on every change so data survives refresh
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    } catch {
      // storage full or unavailable, app still works in memory
    }
  }, [employees]);

  const addEmployee = useCallback((data) => {
    setEmployees((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const updateEmployee = useCallback((id, data) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  }, []);

  const deleteEmployee = useCallback((id) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const resetEmployees = useCallback(() => setEmployees(initialEmployees), []);

  return { employees, addEmployee, updateEmployee, deleteEmployee, resetEmployees };
}
