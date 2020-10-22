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
                // "Delete Records"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Add a record":
                    addRecord();
                    break;

                case "View Records":
                    viewRecords();
                    break;

                case "Update Employee Roles":
                    updateEmployee();
                    break;

                    //  case "Delete Records ":
                    // deleteRecord();
                    //break;
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
                "Jobs",
                "Employees",
                "Return to Menu"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Departments":
                    findDepartment();
                    break;

                case "Jobs":
                    findJob();
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

function addRecord() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What kind of record do you want to add?",
            choices: [
                "Departments",
                "Jobs",
                "Employees",
                "Return to Menu"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Departments":
                    addDepartment();
                    break;

                case "Jobs":
                    addJob();
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
/*
function deleteRecord() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What kind of record do you want to delete?",
            choices: [
                "Departments",
                "Jobs",
                "Employees",
                "Return to Menu"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Departments":
                    deleteDepartment();
                    break;

                case "Jobs":
                    deleteJob();
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
*/
function updateEmployee() {
    inquirer.prompt([{
                name: "id",
                type: "number",
                message: "Enter the ID of the employee whose role you want to update",
            },
            {
                name: "jobID",
                type: "number",
                message: "Enter the Job ID number",
            },
        ])
        .then(function(answer) {
            connection.query("UPDATE employee SET ? WHERE ?", [{ job_id: answer.jobID }, { id: answer.id }],
                function(err, res) {
                    if (err) throw err;
                    console.log(`Employee ID ${answer.id} updated with Job ID ${answer.jobID}`)
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

function findJob() {
    connection.query("SELECT job.id, title, salary, name FROM job INNER JOIN department ON department_id = department.id;", function(err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function findEmployee() {
    console.log("running findEmployee()")
    connection.query("SELECT employee.id, first_name, last_name, title, salary FROM employee INNER JOIN job ON employee.job_id = job.id;", function(err, res) {
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
/*
function deleteDepartment() {
    inquirer.prompt([{
            name: "departmentID",
            type: "input",
            message: "Enter the name of the department you want to delete:",
        }])
        .then(function(answer) {
            connection.query("DELETE FROM department WHERE department.id = answer.departmentID") ,
                function(err, res) {
                    if (err) throw err;
                    console.log(`Department ${answer.departmentID} successfully deleted!`)
                    init();
                }
            )
        });
}
*/
function addJob() {
    inquirer.prompt([{
                name: "title",
                type: "input",
                message: "Enter the title of the job you want to add:",
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
            connection.query("INSERT INTO job SET ?", {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentID
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(`Job ${answer.title} with salary ${answer.salary} in department ${answer.departmentID} added!`)
                    init();
                }
            )
        });
}
/*
function deleteJob() {
    inquirer.prompt([{
                name: "title",
                type: "input",
                message: "Enter the title of the job you want to delete:",
            },
        ])
        .then(function(answer) {
            console.log(answer)
            connection.query("DELETE FROM job WHERE job.title = answer.title"), 
                function(err, res) {
                    if (err) throw err;
                    console.log(`Job ${answer.title} with salary ${answer.salary} in department ${answer.departmentID} deleted!`)
                    init();
                }
            )
        });
}

*/

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
                name: "jobID",
                type: "number",
                message: "Enter a number for the Job ID:",
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
                    job_id: answer.jobID,
                    manager_id: answer.managerID
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(`New employee: ${answer.firstName} ${answer.lastName} with Job ID ${answer.jobID} and Manager with an ID of ${answer.managerID}`)
                    init();
                }
            )
        });
}
/*

function addEmployee() {
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
            connection.query("DELETE FROM employee WHERE employee.first_name = answer.firstName AND employee.last_name = answer.lastName "), 
              
                function(err, res) {
                    if (err) throw err;
                    console.log(`The employee deleted: ${answer.firstName} ${answer.lastName} with Job ID ${answer.jobID} and Manager with an ID of ${answer.managerID}`)
                    init();
                }
            )
        });
}
*/
module.exports = {
    init,
    viewRecords,
    addRecord,
    updateEmployee,
    //deleteRecord
}