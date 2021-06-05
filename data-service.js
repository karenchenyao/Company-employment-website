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

module.exports.getManagers = functions() {
    return new Promise((resolve, reject) => {
        var manager = [];
        for(let i=0; i<employees.length;i++){
            if(employees[i].isManager == true){
                manager.push(employees[i]);
            }
        }
        if (manager.length == 0) {
            reject("no results returned");
        }
        resolve(manager);
    });
}