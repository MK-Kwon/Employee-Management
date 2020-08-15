USE employee_management_DB;

INSERT INTO department (name)
VALUES ("Accounting"),("Sales"),("Design");

INSERT INTO role (title, salary, department_id)
VALUES ("Director of Accounting", 100000.00, 1),
("Senior Accountant", 85000.00, 1),
("Accountant", 50000.00, 1),
("Vice Chairman", 150000.00, 2),
("Vice President", 120000.00, 2),
("Associate", 90000.00, 2),
("Director of Client Services", 80000.00, 3),
("Account Representative", 55000.00, 3),
("Client Service Coordinator", 45000.00, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Min Kyung", "Kwon", 1), ("Mery", "Hudson", 4), ("Josh", "Phillips", 7);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Corey", "Cheng", 2, 1), 
       ("Bill", "Kim", 3, 1), 
       ("Mike", "Flores", 3, 1), 
       ("Cheryl", "Havery", 5, 2),
       ("Ruby", "Foster", 5, 2), 
       ("Joshua", "Hamilton", 5, 2), 
       ("John", "Heyman", 6, 2), 
       ("Michell", "O'Neil", 6, 2),
       ("Bill", "Thomson", 8, 3), 
       ("Maxwell", "Pill", 8, 3), 
       ("Hamish", "Anderson", 9, 3);

SELECT * FROM employee;
