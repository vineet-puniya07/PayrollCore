const express = require("express");
const path = require("path");
const { readEmployees, writeEmployees } = require("./modules/filehandler");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Dashboard with search
app.get("/", async (req, res) => {
    const employees = await readEmployees();
    const searchQuery = req.query.search ? req.query.search.toLowerCase() : "";
    
    let filteredEmployees = employees;
    if (searchQuery) {
        filteredEmployees = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchQuery) ||
            emp.department.toLowerCase().includes(searchQuery)
        );
    }
    
    res.render("index", { employees: filteredEmployees, searchQuery });
});


// Add page
app.get("/add", (req, res) => {
    res.render("add");
});


// Add employee
app.post("/add", async (req, res) => {
    let { name, department, salary } = req.body;
    salary = Number(salary);

    if (!name || !department || salary <= 0)
        return res.send("Invalid input");

    const employees = await readEmployees();

    employees.push({
        id: Date.now(),
        name,
        department,
        salary
    });

    await writeEmployees(employees);
    res.redirect("/");
});


// Delete employee
app.get("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);

    let employees = await readEmployees();
    employees = employees.filter(emp => emp.id !== id);

    await writeEmployees(employees);
    res.redirect("/");
});


// Update employee
app.post("/update/:id", async (req, res) => {
    const id = Number(req.params.id);
    let { name, avatar, gender, department, salary, day, month, year, notes } = req.body;
    salary = Number(salary);

    if (!name || !department || salary <= 0)
        return res.send("Invalid input");

    // Handle department as checkbox (can be array or string)
    const deptValue = Array.isArray(department) ? department.join(", ") : department;

    const employees = await readEmployees();
    const index = employees.findIndex(emp => emp.id === id);

    if (index === -1) return res.send("Employee not found");

    employees[index] = { 
        id, 
        name, 
        avatar: avatar || "",
        gender: gender || "",
        department: deptValue, 
        salary,
        day: day || "",
        month: month || "",
        year: year || "",
        notes: notes || ""
    };

    await writeEmployees(employees);
    res.redirect("/");
});

// Edit form (GET)
app.get("/edit/:id", async (req, res) => {
    const id = Number(req.params.id);
    const employees = await readEmployees();

    const employee = employees.find(emp => emp.id === id);
    if (!employee) return res.send("Employee not found");

    res.render("edit", { employee });
});


// Update employee (POST - alternate route)
app.post("/edit/:id", async (req, res) => {
    const id = Number(req.params.id);
    let { name, department, salary } = req.body;
    salary = Number(salary);

    if (!name || !department || salary <= 0)
        return res.send("Invalid input");

    const employees = await readEmployees();
    const index = employees.findIndex(emp => emp.id === id);

    employees[index] = { id, name, department, salary };

    await writeEmployees(employees);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
