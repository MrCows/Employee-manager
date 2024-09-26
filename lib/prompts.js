const inquirer = require('inquirer');
const { 
  viewAllDepartments, 
  viewAllRoles, 
  viewAllEmployees, 
  addDepartment, 
  addRole, 
  addEmployee, 
  updateEmployeeRole 
} = require('../db/queries');

// Main menu function
const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]).then(answer => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments(mainMenu);
        break;
      case 'View all roles':
        viewAllRoles(mainMenu);
        break;
      case 'View all employees':
        viewAllEmployees(mainMenu);
        break;
      case 'Add a department':
        addNewDepartment();
        break;
      case 'Add a role':
        addNewRole();
        break;
      case 'Add an employee':
        addNewEmployee();
        break;
      case 'Update an employee role':
        updateRoleForEmployee();
        break;
      case 'Exit':
        process.exit();
    }
  });
};

const addNewDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:'
    }
  ]).then(answer => {
    addDepartment(answer.departmentName, mainMenu);
  });
};

const addNewRole = () => {
  viewAllDepartments((departments) => {
    const departmentChoices = departments.map(department => ({
      name: department.name,
      value: department.id
    }));

    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the name of the role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for this role:',
        choices: departmentChoices
      }
    ]).then(answers => {
      addRole(answers.title, answers.salary, answers.departmentId, mainMenu);
    });
  });
};

const addNewEmployee = () => {
  viewAllRoles((roles) => {
    const roleChoices = roles.map(role => ({
      name: role.title,
      value: role.id
    }));

    viewAllEmployees((employees) => {
      const managerChoices = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }));
      managerChoices.push({ name: 'None', value: null });

      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Enter the employee\'s first name:'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Enter the employee\'s last name:'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'Select the role for this employee:',
          choices: roleChoices
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the manager for this employee:',
          choices: managerChoices
        }
      ]).then(answers => {
        addEmployee(answers.firstName, answers.lastName, answers.roleId, answers.managerId, mainMenu);
      });
    });
  });
};

const updateRoleForEmployee = () => {
  viewAllEmployees((employees) => {
    const employeeChoices = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));

    viewAllRoles((roles) => {
      const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id
      }));

      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee whose role you want to update:',
          choices: employeeChoices
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'Select the new role for this employee:',
          choices: roleChoices
        }
      ]).then(answers => {
        updateEmployeeRole(answers.employeeId, answers.roleId, mainMenu);
      });
    });
  });
};

module.exports = { mainMenu };