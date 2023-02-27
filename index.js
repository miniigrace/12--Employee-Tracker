const inquirer = require("inquirer");
const mysql = require('mysql2');
require('console.table');

const connection = mysql.createConnection({host: 'localhost', user: 'root', password: 'shinyako3511', database: 'employees_db' });
connection.connect()

init()

//starts application
function init() {
  inquirer.prompt({
    type: "list",
    name: "start",
    message: "What would you like to do?",
    choices: ["View All Employees", "View All Departments", "View All Roles", "View All Employees By Department", "View All Employees By Manager",
      "Add Employee", "Remove Employee", "Update Employee Role", "Add Employee Role", "Remove Role", "Add New Department", "Remove Department"]
  })
    .then(function (response) {
      switch (response.start) {

        case "View All Employees":
          return viewEmployees();
          //break;

        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Employees By Department":
          viewEmpByDep();
          break;

        case "View All Employees By Manager":
          viewEmpByManager();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmpRole();
          break;

        case "Add Employee Role":
          addRole();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "Add New Department":
          addDepartment();
          break;

        case "Remove Department":
          removeDept();
          break;

        case "Update Employee Manager":
          updateEmpManager();
          break;
      }
    })
};

//view employees
function viewEmployees() {
    console.log('function invoked')
  const empQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
  CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name
  FROM employee 
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager ON  employee.manager_id = manager.id`

  connection.query(empQuery, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  })
};

// view department
function viewDepartments() {
  const depQuery = `SELECT * FROM department`
  connection.query(depQuery, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  })
};

//view roles
function viewRoles() {
  const roleQuery = `SELECT * FROM role`
  connection.query(roleQuery, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  })
};

//view emp by department
function viewEmpByDep() {
  const depQuery1 = ("SELECT * FROM department");

  connection.query(depQuery1, (err, response) => {
    if (err) throw err;
    const departments = response.map(element => {
      return { name: `${element.name}` }
    });

    inquirer.prompt([{
      type: "list",
      name: "dept",
      message: "Please select a department to view employees",
      choices: departments

    }]).then(answer => {
      const depQuery2 = `SELECT employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name as department 
      FROM employee LEFT JOIN role on employee.role_id = role.id 
      LEFT JOIN department ON role.department_id =department.id LEFT JOIN employee manager ON employee.manager_id=manager.id
      WHERE ?`
      connection.query(depQuery2, [{ name: answer.dept }], function (err, res) {
        if (err) throw err;
        console.table(res)
        init();
      })
    })
  })
};

//view employees by manager
function viewEmpByManager() {
  let query1 = `SELECT * FROM employee e WHERE e.manager_id IS NULL`

  connection.query(query1, function (err, res) {
    if (err) throw err;
    const managers = res.map(function (element) {
      return {
        name: `${element.first_name} ${element.last_name}`,
        value: element.id
      }
    });
    inquirer.prompt([{
      type: "list",
      name: "emByManager",
      message: "Please select manager to view employees",
      choices: managers
    }])
      .then(response => {
        console.log(response.emByManager)
        let query2 = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name, ' ', manager.last_name) as manager, department.name AS department FROM employee
        LEFT JOIN role on employee.role_id = role.id
        LEFT JOIN department on department.id = role.department_id
        LEFT JOIN employee manager on employee.manager_id = manager.id
        WHERE employee.manager_id = ?`
        connection.query(query2, [response.emByManager], (err, data) => {
          if (err) throw err;
          console.table(data);
          init()
        })
      })
  })
};

//adding new employee
function addEmployee() {
  let addQuery = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, department.name,
  role.salary, employee.manager_id 
    FROM employee
    INNER JOIN role on role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id`
  connection.query(addQuery, (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "Please enter employee first name"
      }, {
        type: "input",
        name: "last_name",
        message: "Please enter employee last name"
      }, {
        type: "list",
        name: "role",
        message: "Please select employee title",
        choices: results.map(role => {
          return { name: role.title, value: role.role_id }
        })
      }, {
        type: "input",
        name: "manager",
        message: "Please enter employee manager id"
      }])
      .then(answer => {
        console.log(answer);
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
          [answer.first_name, answer.last_name, answer.role, answer.manager],
          function (err) {
            if (err) throw err
            console.log(`${answer.first_name} ${answer.last_name} added as a new employee`)
            init();
          })
      })
  })
};

//removing employee
function removeEmployee() {
  let query1 = `SELECT * FROM employee`
  connection.query(query1, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: "list",
      name: "emId",
      message: "Please select employee to remove",
      choices: res.map(employee => {
        return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
      })
    }])
      .then(answer => {
        let query2 = `DELETE FROM employee WHERE ?`
        connection.query(query2, [{ id: answer.emId }], (err) => {
          if (err) throw err;
          console.log("Employee removed");
          init();
        })
      })
  })
};

// removing role
function removeRole() {
  let query1 = `SELECT * FROM role`
  connection.query(query1, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: "list",
      name: "roleId",
      message: "Please select role to remove",
      choices: res.map(roles => {
        return { name: `${roles.title}`, value: roles.id }
      })
    }])
      .then(answer => {
        let query2 = `DELETE FROM role WHERE ?`
        connection.query(query2, [{ id: answer.roleId }], (err) => {
          if (err) throw err;
          console.log("Role removed");
          init();
        })
      })
  })
};

//updating employee role
function updateEmpRole() {
  let query = ("SELECT * FROM employee");

  connection.query(query, (err, response) => {

    const employees = response.map(function (element) {
   
    
      return `${element.last_name}`
    });

    inquirer.prompt([{
      type: "list",
      name: "employee",
      message: "Which employees role do you want to update",
      choices: employees
    }])
      .then(inputEmployee => {
        console.log('inuptEmployee',inputEmployee)
        connection.query("SELECT * FROM role", (err, data) => {

          const roles = data.map(function (role) {
            return {
              name: role.title,
              value: role.id
            }
            
          });

          inquirer.prompt([{
            type: "list",
            name: "roles",
            message: "What's the new role",
            choices: roles
          }])
            .then(inputRole => {
                console.log('inputRole', inputRole)
              const query1 = `UPDATE employee
        SET employee.role_id = ? 
        WHERE employee.last_name = ?`
              connection.query(query1, [inputRole.roles, inputEmployee.employee], function (err, res) {
                var tempPosition;
                
                for (var k = 0; k < roles.length; k++) {
                  if (roles[k].value == inputRole.roles) {
                    tempPosition = roles[k].name;
                  }
                }
               
                var tempName;
                for (var g = 0; g < employees.length; g++) {
                  if (employees[g].last_name== inputEmployee) {
                    tempName = employees[g].last_name;
                  }
                }

                  console.log(`Successfully updated ${inputEmployee.employee} to position of ${tempPosition}`);
            
                init();
              })
            })
        })
      })
  })
};

//add new role
function addRole() {
  let query1 = `SELECT * FROM role`
  connection.query(query1, (err, data) => {
    if (err) throw err
    inquirer.prompt([
      {
        type: "input",
        name: "roleId",
        message: "Please enter id for new role"
      }, {
        type: "input",
        name: "role",
        message: "Please enter title of new role"
      }, {
        type: "input",
        name: "salary",
        message: "Please enter salary for new role"
      }, {
        type: "input",
        name: "deptId",
        message: "Please enter department id for new role"
      }])
      .then(function (answers) {
        let query2 = `INSERT INTO role VALUES (?,?,?,?)`
        connection.query(query2, [answers.roleId, answers.role, answers.salary, answers.deptId], function (err) {
          if (err) throw err;
          console.log(`${answers.role} added as new role`)
          init();
        })
      })
  })
}

//add new department
function addDepartment() {
  let query1 = `SELECT * FROM department`
  connection.query(query1, (err, res) => {
    if (err) throw err
    inquirer.prompt([{
      type: "input",
      name: "deptId",
      message: "Please enter id for new department"
    }, {
      type: "input",
      name: "deptName",
      message: "Please enter name for new department"
    }])
      .then(answers => {
        let query2 = `INSERT INTO department VALUES (?,?)`
        connection.query(query2, [answers.deptId, answers.deptName], (err) => {
          if (err) throw err
          console.log(`${answers.deptName} added as a new department`)
          init();
        })
      })
  })
};

// removing department
function removeDept() {
  let query1 = `SELECT * FROM department`
  connection.query(query1, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: "list",
      name: "deptId",
      message: "Please select a department to remove",
      choices: res.map(departments => {
        return { name: `${departments.name}`, value: departments.id }
      })
    }])
      .then(answer => {
        let query2 = `DELETE FROM department WHERE ?`
        connection.query(query2, [{ id: answer.deptId }], (err) => {
          if (err) throw err;
          console.log("Department removed")
          init();
        })
      })
  })
};
