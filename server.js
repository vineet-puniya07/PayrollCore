const express = require("express");
const path = require("path");
const { readEmployees, writeEmployees } = require("./modules/filehandler");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Dashboard
app.get("/", async (req, res) => {
    const employees = await readEmployees();
    res.render("index", { employees });
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


// Edit form
app.get("/edit/:id", async (req, res) => {
    const id = Number(req.params.id);
    const employees = await readEmployees();

    const employee = employees.find(emp => emp.id === id);
    if (!employee) return res.send("Employee not found");

    res.render("edit", { employee });
});


// Update employee
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
