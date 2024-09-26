const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: '4411',
    port: 5432,
});

client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

const viewAllDepartments = (callback) => {
    client.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
            callback(res.rows);
        }
    });
};


const viewAllRoles = (callback) => {
    const query = `
      SELECT role.id, role.title, role.salary, department.name AS department 
      FROM role 
      JOIN department ON role.department_id = department.id
    `;

    client.query(query, (err, res) => {
        if (err) {
            console.error('Error fetching roles:', err);
            callback([]); // Call the callback with an empty array in case of error
        } else {
            if (res.rows.length === 0) {
                console.warn('No roles found.');
            } else {
                console.table(res.rows);
            }
            callback(res.rows);
        }
    });
};

const viewAllEmployees = (callback) => {
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id
    `;

    client.query(query, (err, res) => {
        if (err) {
            console.error('Error fetching employees:', err);
            callback([]);
        } else {
            if (res.rows.length === 0) {
                console.warn('No employees found.');
            } else {
                console.table(res.rows);
            }
            callback(res.rows);
        }
    });
};

// Function to add a new department
const addDepartment = (departmentName, callback) => {
    client.query('INSERT INTO department (name) VALUES ($1)', [departmentName], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Department added successfully!');
            callback();
        }
    });
};

const addRole = (title, salary, departmentId, callback) => {
    client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Role added successfully!');
            callback();
        }
    });
};

const addEmployee = (firstName, lastName, roleId, managerId, callback) => {
    client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Employee added successfully!');
            callback();
        }
    });
};

const updateEmployeeRole = (employeeId, roleId, callback) => {
    client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Employee role updated successfully!');
            callback();
        }
    });
};

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};