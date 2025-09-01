## Overview

This project is an ASN (Advanced Shipping Notice) Validator for Dick's Sporting Goods, built as a take-home assignment. It features a FastAPI backend for business rule validation and a React frontend for a user-friendly, step-based validation experience.

**Features:**

- ASN JSON validation against DSG business rules
- Clear error and compliance reporting
- Step-by-step UI with sample ASN templates
- Modern, responsive design
- Easy to run locally (no cloud dependencies)

---

## How to Run This Project

### 1. Start the backend (FastAPI)

Open a terminal and run:

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at http://localhost:8000

### 2. Start the frontend (React)

Open a new terminal and run:

```
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000

---

## Using the Validator

- You can paste your own ASN JSON into the app for validation.
  - **Note:** Your JSON must follow the required ASN schema/format (see sample templates in the UI for reference).
- The UI also provides sample "valid" and "invalid" ASN templates for quick testing.

---

## Project Structure

- `backend/` — FastAPI app, Pydantic models, business rule validators
- `frontend/` — React app, step-based UI, validation hooks/components

---

## Validation Logic & Extensibility

### Backend Validations

- Required fields for ASN, Carton, Item, UCC-128 Label, and TMS Routing
- PO number format: must match `DSG-YYYY-XXXXXX` (enforced at carton, item, and label level)
- Warehouse code: must be one of Dick's Sporting Goods distribution centers (351, 51, 651, 851, 1051)
- UCC-128 SSCC: must be 18 digits, start with 0
- Carton requirements: at least one item per carton, valid weight and dimensions
- Item requirements: valid SKU, UPC (12-13 digits), positive quantity
- TMS Routing: valid shipment ID, positive numbers for cartons, cube, pallets, weight
- Business rule: all items in a carton must have the same PO number as the carton
- Returns detailed error messages and a compliance summary (total cartons, items, weight, error count)

### Extensibility & Design Considerations

- The validation logic is modular and can be easily extended to support additional business rules or ASN formats as requirements evolve.
- The codebase is organized for clarity and maintainability, with clear separation between backend validation and frontend user experience.
- If this were a real company project, I could add things like user logins, keeping a record of changes, showing more detailed error types, or connecting to other company tools.

---

### Frontend

- Step-by-step form for ASN input, preview, and validation results
- Displays all errors, warnings, and compliance summary
- Includes demo/sample ASN templates for quick testing

---

## Tech Stack

- **Backend:** FastAPI, Pydantic, Python 3.11+
- **Frontend:** React (TypeScript), Tailwind CSS

---

## How to Test

1. Use the sample ASN templates in the UI to quickly test both valid and invalid cases.
2. Paste your own ASN JSON to validate custom data.
3. All validation errors and compliance details will be shown in the results step.

---

## Notes

- For this project, I used ASN data in JSON format because it’s much easier to read and work with for a coding assignment. In real companies, ASN data is often sent as EDI files, but converting EDI to JSON would take extra time and tools. Using JSON let me focus on the main goal: checking if the data is correct.

---

## Thank you for reviewing my project! :)

-Diego Rafael (2025)
