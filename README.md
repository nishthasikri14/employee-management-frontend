# Employee Management System (Frontend Intern Assignment)

A responsive React single page app for managing employees. No backend: data starts from a JSON array in code and is saved to `localStorage`.

##Screenshots

[Employee list] :  (<screenshots/Screenshot 2026-10-14 213203.png>)

[Validation] : (<screenshots/Screenshot 2026-10-14 213448.png>)

[Mobile view] : (<screenshots/Screenshot 2026-10-14 214824.png>)

## Features

Required
- Employee list with name, role, email, phone and actions
- Add employee with validation (name, role, email required)
- Edit employee, changes show immediately
- Delete employee with a confirmation dialog
- Search by name, role or email
- React hooks (`useState`, `useEffect`, `useMemo`, custom `useEmployees` hook)
- Initial data from a JSON array (`src/data/employees.js`)

Bonus
- localStorage persistence (survives refresh) and a "Reset sample data" button
- Sorting by name or role (click the column header)
- Inline validation messages (required, email format, duplicate email, 10 digit phone)
- Pagination (6 per page)
- Mobile layout where table rows turn into stacked cards

## Tech

React 18, Vite, plain CSS, lucide-react icons.

## Setup

```bash
npm install
npm run dev     # npm start also works
```

Open the URL Vite prints, usually http://localhost:5173.

## Structure

```
src/
  components/  SearchBar, EmployeeTable, EmployeeForm, ConfirmDialog, Pagination
  hooks/       useEmployees (CRUD + localStorage)
  data/        employees.js (initial JSON)
  App.jsx      filter, sort, pagination and modal state
```

## Design notes

- Filter, sort and pagination run in that order inside one `useMemo`.
- Page number is clamped so deleting the last item on a page never leaves an empty page.
- Duplicate email check ignores the employee currently being edited.
