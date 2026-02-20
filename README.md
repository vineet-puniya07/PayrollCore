# 🏢 PayrollCore

A simple **Employee Payroll Management System** built with **Node.js**, **Express**, and **EJS** templating. Manage your workforce — add, edit, search, and delete employees — with data persisted to a local JSON file.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Web Framework | Express v5 |
| Templating | EJS |
| Data Store | `employees.json` (flat-file) |
| Static Assets | `public/` directory |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Server runs at **http://localhost:3000**

---

## 🗂 Project Structure

```
PayrollCore/
├── server.js            # Express app & route definitions
├── employees.json       # Persistent employee data store
├── modules/
│   └── filehandler.js   # readEmployees / writeEmployees helpers
├── views/
│   ├── index.ejs        # Dashboard (list + search)
│   ├── add.ejs          # Add employee form
│   └── edit.ejs         # Edit employee form
└── public/              # Static assets (CSS, images)
```

---

## 🔄 How It Works — Architecture Diagram

```mermaid
flowchart TD
    Browser(["🌐 Browser / Client"])

    subgraph Express["Express Server · server.js"]
        R1["GET /\nDashboard + Search"]
        R2["GET /add\nAdd Form"]
        R3["POST /add\nCreate Employee"]
        R4["GET /edit/:id\nEdit Form"]
        R5["POST /update/:id\nUpdate Employee"]
        R6["GET /delete/:id\nDelete Employee"]
    end

    subgraph FileHandler["modules/filehandler.js"]
        FH_R["readEmployees()\nfs.readFile → JSON.parse"]
        FH_W["writeEmployees()\nJSON.stringify → fs.writeFile"]
    end

    subgraph DataStore["Data Store"]
        JSON[("📄 employees.json")]
    end

    subgraph Views["views/ · EJS Templates"]
        V1["index.ejs\nEmployee List"]
        V2["add.ejs\nAdd Form"]
        V3["edit.ejs\nEdit Form"]
    end

    subgraph Static["public/\nStatic Assets"]
        CSS["CSS / Images"]
    end

    Browser -- "HTTP Request" --> Express

    R1 --> FH_R
    R3 --> FH_R
    R3 --> FH_W
    R4 --> FH_R
    R5 --> FH_R
    R5 --> FH_W
    R6 --> FH_R
    R6 --> FH_W

    FH_R -- "reads" --> JSON
    FH_W -- "writes" --> JSON

    R1 -- "res.render" --> V1
    R2 -- "res.render" --> V2
    R4 -- "res.render" --> V3

    R3 -- "res.redirect(/)" --> Browser
    R5 -- "res.redirect(/)" --> Browser
    R6 -- "res.redirect(/)" --> Browser

    V1 & V2 & V3 -- "HTML Response" --> Browser
    Static -- "served automatically" --> Browser
```

---

## 📋 API / Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Dashboard — list all employees, supports `?search=` query |
| `GET` | `/add` | Render add-employee form |
| `POST` | `/add` | Submit new employee |
| `GET` | `/edit/:id` | Render edit form for employee `id` |
| `POST` | `/update/:id` | Submit updated employee data |
| `GET` | `/delete/:id` | Delete employee by `id` |

---

## 👤 Employee Data Model

```json
{
  "id": 1700000000000,
  "name": "Jane Doe",
  "avatar": "https://...",
  "gender": "Female",
  "department": "Engineering, Design",
  "salary": 75000,
  "startDate": "2024-01-15",
  "notes": "Senior developer"
}
```

---

## 📝 License

ISC
