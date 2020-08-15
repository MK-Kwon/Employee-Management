const myPassword = "";

// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const colors = require("colors");

// Connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: myPassword,
  database: "employee_management_DB"
});

connection.connect(err => {
  if (err) throw err;
  console.log(
    "---------------------".brightCyan.bgBlack.bold +
    "WELCOME TO EMPLOYEE MANAGEMENT!".brightCyan.bgBlack.bold +
    "---------------------".brightCyan.bgBlack.bold
  );
  startApp();
});

function startApp() {
    inquirer.prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View", "Add", "Update", "Delete", "Exit"]
    })
      .then(answer => {
        switch (answer.action) {
          case "View":
            viewData();
            break;
  
          case "Add":
            addData();
            break;
  
          case "Update":
            updateData();
            break;
  
          case "Delete":
            deleteData();
            break;
  
          case "Exit":
            exitApp();
            break;
        }
      });
  }

  function viewData() {
    inquirer.prompt({
        type: "list",
        name: "viewItem",
        message: "What would you like to view?",
        choices: [
          "All departments",
          "All roles",
          "All employees",
          "Employees by manager",
          "Employees by department",
          "Total utilized budget of a specific department"
        ]
      })
      .then(answer1 => {
        switch (answer1.viewItem) {

          case "All departments":
            connection.query(`SELECT * FROM department`, function (err, res) {
              if (err) throw err;
              console.table(res);
              startApp();
            });
            break;

          case "All roles":
            connection.query(`SELECT * FROM role`, function (err, res) {
            if (err) throw (err);
            console.table(res);
            startApp();
          });
          break;

          case "All employees":
            connection.query(`SELECT * FROM employee`, function (err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;

          case "Employees by manager":
          // Retrieve manager names and IDs from employee table
          connection.query(`SELECT * FROM employee`, function (err, res) {
            if (err) throw err;
            let managerIDs = [];
            for (const employee of res) {
              if (employee.manager_id !== null) {
                managerIDs.push(employee.manager_id);
              }
            }
            let uniqueIDs = [...new Set(managerIDs)];
            let managerArr = [];
            for (const employee of res) {
              if (uniqueIDs.indexOf(employee.id) > -1) {
                managerArr.push(employee);
              }
            }
            // Pass manager names to inquirer options
            inquirer
              .prompt([
                {
                  name: "mgrChoice",
                  type: "rawlist",
                  message: "Which manager?",
                  choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < managerArr.length; i++) {
                      choiceArray.push(
                        `${managerArr[i].first_name} ${managerArr[i].last_name}`
                      );
                    }
                    return choiceArray;
                  }
                }
              ])
              .then(answer2 => {
                // Create a query using the manager name selected by user
                const answerArr = answer2.mgrChoice.split(" ");
                const mgrFirst = answerArr[0];
                const mgrLast = answerArr[1];
                const query = `
                          SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, manager.first_name manager_first_name, manager.last_name manager_last_name, department.name department_name
                          FROM employee
                          INNER JOIN role ON employee.role_id = role.id
                          INNER JOIN department ON role.department_id = department.id
                          INNER JOIN employee manager ON employee.manager_id = manager.id
                          WHERE (manager.first_name = "${mgrFirst}" AND manager.last_name = "${mgrLast}");
                          `;
                // Read data specified by above query and print to console
                connection.query(query, function (err2, res2) {
                  if (err2) throw err2;
                  console.table(res2);
                  startApp();
                });
              });
          });
          break;
          
          case "Employees by department":
          // Read all data in the department table and pass department names to inquirer options
          connection.query(`SELECT * FROM department`, function (err, res) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: "deptChoice",
                  type: "rawlist",
                  message: "Which department?",
                  choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < res.length; i++) {
                      choiceArray.push(res[i].name);
                    }
                    return choiceArray;
                  }
                }
              ])
              .then(answer3 => {
                // Create a query using the department name specified by user
                const query = `
                          SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name department_name, employee.manager_id
                          FROM employee
                          INNER JOIN role ON employee.role_id = role.id
                          INNER JOIN department ON role.department_id = department.id
                          WHERE department.name = "${answer3.deptChoice}";`;
                // Read data specified by above query and print to console
                connection.query(query, function (err2, res2) {
                  if (err2) throw err2;
                  console.table(res2);
                  startApp();
                });
              });
          });
          break;

          case "Total utilized budget of a specific department":
          // Read all data in the department table and pass department names to inquirer options
          connection.query(`SELECT * FROM department`, function (err, res) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: "deptChoice",
                  type: "rawlist",
                  message: "Which department?",
                  choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < res.length; i++) {
                      choiceArray.push(res[i].name);
                    }
                    return choiceArray;
                  }
                }
              ])
              .then(answer4 => {
                // Create a query using the department name specified by user
                const query = `
                          SELECT department.name department_name, SUM(role.salary) utilized_budget
                          FROM employee
                          INNER JOIN role ON employee.role_id = role.id
                          INNER JOIN department ON role.department_id = department.id
                          WHERE department.name = "${answer4.deptChoice}";
                          `;
                // Read data specified by above query and print to console
                connection.query(query, function (err2, res2) {
                  if (err2) throw err2;
                  console.table(res2);
                  startApp();
                });
              });
          });
          break;

          default:
          console.log("Error, please try again");
          startApp();
      }
    });
  }

  function addData() {
        // Get further info about user's desired action
    inquirer.prompt({
        type: "list",
        name: "addItem",
        message: "What would you like to add?",
        choices: ["Department", "Role", "Employee"]
    })
        .then(answer5 => {
        switch (answer5.addItem) {
            case "Department":
            inquirer.prompt([
                {
                name: "deptName",
                type: "input",
                message: "Department name",
                validate: function (val) {
                    return /^[a-zA-Z]+( [a-zA-Z]+)*$/gi.test(val);
                }

                }
            ])
                .then(answer6 => {
                // Create a query using user-entered department data
                const query = `
                        INSERT INTO department (name)
                        VALUES ("${answer6.deptName}");
                        `;
                // Run query and log error or success
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`"${answer6.deptName}" was added to departments.`);
                    startApp();
                });
            });
            break;

            case "Role":
                // Read all data in the department table and pass department IDs & names to inquirer options
                connection.query(`SELECT * FROM department`, function (err, res) {
                    if (err) throw err;
                    // Get role data from user
                    inquirer.prompt([
                    {
                        name: "title",
                        type: "input",
                        message: "Role title",
                        validate: function (val) {
                        return /^[a-zA-Z]+( [a-zA-Z]+)*$/gi.test(val);
                        }
                    },
                    {
                        name: "salary",
                        type: "number",
                        message: "Role salary:",
                        validate: function (val) {
                        return /^[0-9]+$/gi.test(val);
                        }
                    },
                    {
                        name: "departmentID",
                        type: "list",
                        message: "Role department ID:",
                        choices: function () {
                        let choiceArr = [];
                        for (let i = 0; i < res.length; i++) {
                            choiceArr.push(`${res[i].id} (${res[i].name})`);
                        }
                        return choiceArr;
                        }
                    }
                    ])
                    .then(answer7 => {
                        // Create a query using user-entered role data
                        const answerDeptArr = answer7.departmentID.split(" ");
                        const deptID = Number(answerDeptArr[0]);
                        const query = `
                                INSERT INTO role (title, salary, department_id)
                                VALUE ("${answer7.title}", ${answer7.salary}, ${deptID});
                                `;
                        // Run query and log error or success
                        connection.query(query, function (err, res) {
                        if (err) throw err;
                        console.log(`"${answer7.title}" was added to roles.`);
                        startApp();
                        });
                    });
                });
                break;

                case "Employee":
          // Read all data in the role table and pass role IDs & names to inquirer options
          connection.query(`SELECT * FROM role`, function (err, roleData) {
            if (err) throw err;
            // Read all data in the employee table and pass manager IDs & names to inquirer options
            connection.query(`SELECT * FROM employee`, function (err2, managerData) {
              if (err2) throw err2;
              // Get employee data from user
              inquirer.prompt([
                {
                  name: "firstName",
                  type: "input",
                  message: "Employee's first name:",
                  validate: function (val) {
                    return /^[a-zA-Z]+$/gi.test(val);
                  }
                },
                {
                  name: "lastName",
                  type: "input",
                  message: "Employee's last name:",
                  validate: function (val) {
                    return /^[a-zA-Z]+$/gi.test(val);
                  }
                },
                {
                  name: "roleID",
                  type: "list",
                  message: "Employee's role ID:",
                  choices: function () {
                    let choiceArr = [];
                    for (let i = 0; i < roleData.length; i++) {
                      choiceArr.push(
                        `${roleData[i].id} (${roleData[i].title})`
                      );
                    }
                    return choiceArr;
                  }
                },
                {
                  name: "managerID",
                  type: "list",
                  message: "Employees's manager's ID:",
                  choices: function () {
                    let choiceArr = [];
                    for (let i = 0; i < managerData.length; i++) {
                      choiceArr.push(
                        `${managerData[i].id} (${managerData[i].first_name} ${managerData[i].last_name})`
                      );
                    }
                    return choiceArr;
                  }
                }
              ])
                .then(answer8 => {
                  // Create a query using user-entered role data
                  const answerRoleArr = answer8.roleID.split(" ");
                  const roleID = Number(answerRoleArr[0]);
                  const answerManagerArr = answer8.managerID.split(" ");
                  const managerID = Number(answerManagerArr[0]);
                  const query = `
                              INSERT INTO employee (first_name, last_name, role_id, manager_id)
                              VALUES ("${answer8.firstName}", "${answer8.lastName}", ${roleID}, ${managerID}); 
                              `;
                  // Run query and log error or success
                  connection.query(query, function (err3, res3) {
                    if (err3) throw err3;
                    console.log(
                      `"${answer8.firstName} ${answer8.lastName}" was added to employees.`
                    );
                    startApp();
                  });
                });
            });
          });
          break;

          default:
            console.log("Error, please try again");
            startApp();
        }
    });
}

function updateData() {
    // Read all data in the employee table and pass to inquirer options
  connection.query(`SELECT * FROM employee`, function (err, res) {
    if (err) throw err;
    // Get further info about user's desired action
    inquirer.prompt([
      {
        name: "updateItem",
        type: "list",
        message: "What would you like to update?",
        choices: ["Employee's role", "Employee's manager"]
      },
      {
        name: "employee",
        type: "list",
        message: "Which employee would you like to update?",
        choices: function () {
          let choiceArr = [];
          for (let i = 0; i < res.length; i++) {
            choiceArr.push(`${res[i].id} (${res[i].first_name} ${res[i].last_name})`);
          }
          return choiceArr;
        }
      }
    ])
      .then(answer9 => {
        // Interpret user-entered data
        const answerEmpArr = answer9.employee.split(" ");
        const chosenEmpID = Number(answerEmpArr[0]);

        switch (answer9.updateItem) {

          case "Employee's role":
            // Read all data in the role table and pass to inquirer options
            connection.query(`SELECT * FROM role`, function (err2, res2) {
              if (err2) throw err2;
              // Ask user for employee's updated role
              inquirer.prompt([
                {
                  name: "newRole",
                  type: "list",
                  message: "What is the employees updated role?",
                  choices: function () {
                    let choiceArr = [];
                    for (let i = 0; i < res2.length; i++) {
                      choiceArr.push(`${res2[i].id} (${res2[i].title})`);
                    }
                    return choiceArr;
                  }
                }
              ])
                .then(answer10 => {
                  // Make a query and log error or success
                  const answerRoleArr = answer10.newRole.split(" ");
                  const newRole = Number(answerRoleArr[0]);
                  connection.query(
                    `UPDATE employee SET role_id = ${newRole} WHERE id = ${chosenEmpID}`,
                    function (err3, res3) {
                      if (err3) throw err3;
                      console.log(`The employee's role was updated.`);
                      startApp();
                    }
                  );
                });
            });
            break;

            case "Employee's manager":
            // Read all data in the employee table and pass to inquirer options
            connection.query(`SELECT * FROM employee`, function (err2, res2) {
              if (err2) throw err;
              // Ask user for employee's manager
              inquirer.prompt([
                {
                  name: "newManager",
                  type: "list",
                  message: "Who is the employee's updated manager?",
                  choices: function () {
                    let choiceArr = [];
                    for (let i = 0; i < res2.length; i++) {
                      choiceArr.push(
                        `${res2[i].id} (${res2[i].first_name} ${res2[i].last_name})`
                      );
                    }
                    return choiceArr;
                  }
                }
              ])
                .then(answer10 => {
                  // Make query and log error or success
                  const answerManagerArr = answer10.newManager.split(" ");
                  const newManager = answerManagerArr[0];
                  connection.query(
                    `UPDATE employee SET manager_id = ${newManager} WHERE id = ${chosenEmpID}`,
                    function (err3, res3) {
                      if (err3) throw err3;
                      console.log(`The employee's manager was updated.`);
                      startApp();
                    }
                  );
                });
            });
            break;

            default:
            console.log("Error, please try again");
            startApp();
        }
      });
  });
}

function deleteData() {
    // Get further info about user's desired action
  inquirer.prompt([
    {
      name: "deleteItem",
      type: "list",
      message: "What would you like to delete?",
      choices: ["Department", "Role", "Employee"]
    }
  ])
    .then(answer11 => {
      switch (answer11.deleteItem) {
        case "Department":
          // Read all data from department table and apss to inquirer
          connection.query(`SELECT * FROM department`, function (err, res) {
            if (err) throw err;
            // Ask user which department to delete
            inquirer.prompt([
              {
                name: "department",
                type: "list",
                message: "Which department?\n" +
                  "CAUTION! DELETING A DEPARTMENT WILL ALSO DELETE ASSOCIATED ROLES AND EMPLOYEES!".red.bold,

                choices: function () {
                  let choiceArr = [];
                  for (let i = 0; i < res.length; i++) {
                    choiceArr.push(`${res[i].id} (${res[i].name})`);
                  }
                  return choiceArr;
                }
              }
            ])
              .then(answer12 => {
                // Make query and log error or success
                const answerDeppArr = answer12.department.split(" ");
                const deleteDept = Number(answerDeppArr[0]);
                const query = `DELETE FROM department WHERE id = ${deleteDept}`;
                connection.query(query, function (err2, res2) {
                  if (err2) throw err2;
                  console.log("Deleted department.");
                  startApp();
                });
              });
          });
          break;

          case "Role":
          // Read all data from role table and pass to inqirer
          connection.query(`SELECT * FROM role`, function (err, res) {
            if (err) throw err;
            // Ask user which role to delete
            inquirer.prompt([
              {
                name: "role",
                type: "list",
                message:
                  "Which role?\n" +
                  "CAUTION! DELETING A ROLE WILL ALSO DELETE ASSOCIATED EMPLOYEES!".red.bold,
                choices: function () {
                  let choiceArr = [];
                  for (let i = 0; i < res.length; i++) {
                    choiceArr.push(`${res[i].id} (${res[i].title})`);
                  }
                  return choiceArr;
                }
              }
            ])
              .then(answer13 => {
                // Make query and log error or success
                const answerRoleArr = answer13.role.split(" ");
                const delteRole = answerRoleArr[0];
                const query = `DELETE FROM role WHERE id = ${delteRole}`;
                connection.query(query, function (err2, res2) {
                  if (err2) throw res2;
                  console.log("Deleted role.");
                  startApp();
                });
              });
          });
          break;
}

function exitApp() {

}

