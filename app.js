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

  }

  function addData() {

}

function updateData() {

}

function deleteData() {

}

function exitApp() {

}

