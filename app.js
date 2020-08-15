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