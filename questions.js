const inquirer = require("inquirer");
const connection = require("./connection");
// init questions
function init() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add a record",
                "View Records",
                "Update Employee Roles",
                "Delete Records",
                "Update Employee Managers",
                "View Department Budget"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Add a record":
                    addRecord();
                    break;
                case "View Department Budget":
                    viewBudget();
                    break;
                case "View Records":
                    viewRecords();
                    break;
                case "Update Employee Roles":
                    updateEmployee();
                    break;
                case "Update Employee Managers":
                    updateManager();
                    break;
                case "Delete Records":
                    deleteRecord();
                    break;
            }
        })
}

function viewRecords() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Which records do you want to view?",
            choices: [
                "Departments",
                "Manager",
                "Roles",
                "Employees",
                "Return to Menu"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Departments":
                    findDepartment();
                    break;
                case "Manager":
                    findManager();
                    break;
                case "Roles":
                    findrole();
                    break;

                case "Employees":
                    findEmployee();
                    break;

                case "Return to Menu":
                    init();
                    break;
            }
        });
}

function viewBudget() {
    inquirer
        .prompt({
            name: "departmentNum",
            type: "input",
            message: "Which department do you want to view total budget?",
        })

    .then(function(answer) {

        connection.query("SELECT department.name, department_id, SUM (role.salary) AS budget FROM role INNER JOIN employee INNER JOIN department ON role.id = employee.role_id AND department.id = role.department_id WHERE role.department_id = ?  GROUP BY department_id", [answer.departmentNum],
            function(err, res) {
                if (err) throw err;
                console.table(res)
                init();
            })
    })
}

function addRecord() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What kind of record do you want to add?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
                "Return to Menu"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Departments":
                    addDepartment();
                    break;

                case "Roles":
                    addrole();
                    break;

                case "Employees":
                    addEmployee();
                    break;

                case "Return to Menu":
                    init();
                    break;
            }
        });
}

function deleteRecord() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What kind of record do you want to delete?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
                "Manager",
                "Return to Menu"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Departments":
                    deleteDepartment();
                    break;
                case "Manager":
                    deleteManager();
                    break;
                case "Roles":
                    deleterole();
                    break;

                case "Employees":
                    deleteEmployee();
                    break;

                case "Return to Menu":
                    init();
                    break;
            }
        });
}

function updateManager() {
    inquirer.prompt([{
            name: "id",
            type: "number",
            message: "Enter the ID of the employee you want to update",
        },
        {
            name: "managerID",
            type: "number",
            message: "Enter the new manager ID number",
        },
    ]).then(function(answer) {
        connection.query("UPDATE employee SET ? WHERE ? ", [{ manager_id: answer.managerID }, { id: answer.id }],
            function(err, res) {
                if (err) throw err;
                console.log(`Employee ID ${answer.id} updated with new Manager ${answer.managerID} `)
                init();
            })
    })
}

function updateEmployee() {
    inquirer.prompt([{
                name: "id",
                type: "number",
                message: "Enter the ID of the employee whose role you want to update",
            },
            {
                name: "roleID",
                type: "number",
                message: "Enter the role ID number",
            },
        ])
        .then(function(answer) {
            connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: answer.roleID }, { id: answer.id }],
                function(err, res) {
                    if (err) throw err;
                    console.log(`Employee ID ${answer.id} updated with role ID ${answer.roleID}`)
                    init();
                }
            )
        });
}

function findDepartment() {
    connection.query("SELECT * FROM department;", function(err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function findManager() {
    connection.query("SELECT manager_id, first_name, last_name FROM employee;", function(err, res) {
        if (err) throw err;
        console.table(res);
        init();
    })
}

function findrole() {
    connection.query("SELECT role.id, title, salary, name FROM role INNER JOIN department ON department_id = department.id;", function(err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function findEmployee() {
    console.log("running findEmployee()")
    connection.query("SELECT employee.id, manager_id, first_name, last_name, title, salary FROM employee INNER JOIN role ON employee.role_id = role.id;", function(err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function addDepartment() {
    inquirer.prompt([{
            name: "departmentID",
            type: "input",
            message: "Enter the name of the department you want to add:",
        }])
        .then(function(answer) {
            connection.query("INSERT INTO department SET ?", { name: answer.departmentID },
                function(err, res) {
                    if (err) throw err;
                    console.log(`Department ${answer.departmentID} successfully added!`)
                    init();
                }
            )
        });
}

function deleteDepartment() {
    inquirer.prompt([{
            name: "departmentID",
            type: "input",
            message: "Enter the id of the department you want to delete:",
        }])
        .then(function(answer) {
            connection.query("DELETE FROM department WHERE department.id = ?", [answer.departmentID],
                function(err, res) {
                    if (err) throw err;
                    console.log(`Department ${answer.departmentID} successfully deleted!`)
                    init();
                }
            )
        });
}

function addrole() {
    inquirer.prompt([{
                name: "title",
                type: "input",
                message: "Enter the title of the role you want to add:",
            },
            {
                name: "salary",
                type: "number",
                message: "Enter a number for the salary:",
            },
            {
                name: "departmentID",
                type: "number",
                message: "Enter a number for the department:",
            },
        ])
        .then(function(answer) {
            console.log(answer)
            connection.query("INSERT INTO role SET ?", {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentID
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(`role ${answer.title} with salary ${answer.salary} in department ${answer.departmentID} added!`)
                    init();
                }
            )
        });
}

function deleterole() {
    inquirer.prompt([{
            name: "title",
            type: "input",
            message: "Enter the title of the role you want to delete:",
        }, ])
        .then(function(answer) {
            console.log(answer)
            connection.query("DELETE FROM role WHERE role.title =? ", [answer.title],
                function(err, res) {
                    if (err) throw err;
                    console.log(`role ${answer.title} `)
                    init();
                }
            )
        });
}

function deleteManager() {
    inquirer.prompt([{
            name: "managerID",
            type: "input",
            message: "Enter the id of the Manager you want to delete:",
        }, ])
        .then(function(answer) {
            console.log(answer)
            connection.query("DELETE FROM employee WHERE employee.manager_id =? ", [answer.managerID],
                function(err, res) {
                    if (err) throw err;
                    console.log(`Deleted ${answer.managerID} `)
                    init();
                }
            )
        });
}

function addEmployee() {
    inquirer.prompt([{
                name: "firstName",
                type: "input",
                message: "Enter the first name of the new employee:",
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter the first last of the new employee:",
            },
            {
                name: "roleID",
                type: "number",
                message: "Enter a number for the role ID:",
            },
            {
                name: "managerID",
                type: "number",
                message: "Enter a number for the manager ID",
            }
        ])
        .then(function(answer) {
            console.log(answer)
            connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleID,
                    manager_id: answer.managerID
                },
                function(err, res) {
                    if (err) throw err;

                    console.log(`New employee: ${answer.firstName} ${answer.lastName} with role ID ${answer.roleID} and Manager with an ID of ${answer.managerID}`)
                    init();
                }
            )
        });
}


function deleteEmployee() {
    inquirer.prompt([{
                name: "firstName",
                type: "input",
                message: "Enter the first name of the employee you want to delete:",
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter the first last of the employee you want to delete:",
            }
        ])
        .then(function(answer) {
            console.log(answer)
                // console.log(`The employee deleted: ${answer.firstName} ${answer.lastName} with role ID ${answer.roleID} and Manager with an ID of ${answer.managerID}`)
            connection.query("DELETE FROM employee WHERE first_name = ? AND last_name = ? ", [answer.firstName, answer.lastName],

                function(err, res) {
                    if (err) throw err;
                    console.log(`The employee deleted: ${answer.firstName} ${answer.lastName}`)
                    init();
                })

        });
}

module.exports = {
    init,
    viewRecords,
    addRecord,
    updateEmployee,
    deleteRecord,
    viewBudget,
}