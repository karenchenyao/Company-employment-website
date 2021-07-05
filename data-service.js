const fs = require("fs");
let employees = [];
let departments = [];

module.exports.initialize = function(){
    return new Promise((resolve,reject) => {
        fs.readFile('./data/employees.json',(err,data)=>{
            if(err){
                reject("unable to read file");
            }
            employees = JSON.parse(data);
        })
        fs.readFile('./data/departments.json',(err,data)=>{
            if(err){
                reject("unable to read file");
            }
            departments = JSON.parse(data);
        })
        resolve();
    })
}

module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject) => {
        if(employees.length ==0){
            reject("no results returned");
        }
        resolve(employees);
    });

}

module.exports.getDepartments = function(){
    return new Promise((resolve, reject) => {
        if(departments.length ==0){
            reject("no results returned");
        }
        resolve(departments);
    });

}

module.exports.getManagers = function() {
    return new Promise((resolve, reject) => {
        var manager = [];
        for(let i=0; i< employees.length; i++){
            if(employees[i].isManager == true){
                manager.push(employees[i]);
            }
        };
        if (manager.length == 0) {
            reject("no results returned");
        };
        resolve(manager);
    })
}

module.exports.addEmployee = function(employeeData){
    return new Promise(function(resolve,reject){
        employeeData.isManager = (employeeData.isManager == null)? false : true;
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
        if(!employeeData){
            reject("No data to be added")
        }
    });

}

module.exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve,reject){
        var emp = [];
        for(let i=0; i < employees.length; i++){
            if (employees[i].status == status){
                emp.push(employees[i])
            }
        }
        if (emp.length == 0){
            reject("no results returned")
        } 
        resolve(emp);   
    })
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function(resolve,reject){
        var emp = [];
        for(let i=0; i < employees.length; i++){
            if (employees[i].department == department){
                emp.push(employees[i])
            }
        }
        if (emp.length == 0){
            reject("no results returned")
        } 
        resolve(emp);   
    })
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve,reject){
        var emp = [];
        for(let i=0; i < employees.length; i++){
            if (employees[i].employeeManagerNum == manager){
                emp.push(employees[i])
            }
        }
        if (emp.length == 0){
            reject("no results returned")
        } 
        resolve(emp);   
    })
}

module.exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve,reject){
        var emp = {};
        for(let i=0; i < employees.length; i++){
            if (employees[i].employeeNum == num){
                emp = employees[i];
            }
        }
        if (emp == 0){
            reject("no results returned")
        } 
        resolve(emp);   
    })
}

module.exports.updateEmployee = function(employeeData){
    return new Promise(function(resolve,reject){
        for(let i=0; i < employees.length; i++){
            if(employees[i].employeeNum == employeeData.employeeNum){
                employees[i].firstName = employeeData.firstName;
            }
        }
        if (!employeeData){
            reject("no results returned")
        }
        resolve();
    })
}