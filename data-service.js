const Sequelize=require('sequelize');

var sequelize=new Sequelize('da246mgdmvdekn','ropiryahazegzv','9725170b6bb91620f43e1abd178022310a221cd049d4f61b919a04a02aa85257',{
    host:'ec2-52-45-183-77.compute-1.amazonaws.com',
    dialect:'postgres',
    port:5432,
    dialectOptions:{
        ssl:{rejectUnauthorized:false}
    },
    query:{raw:true}
});

var Employee = sequelize.define('Employee',{
    employeeNum:{type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department',{
    departmentId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    departmentName: Sequelize.STRING
});

module.exports.initialize = function(){
    return new Promise((resolve,reject) => {
        return sequelize.sync().then(()=>{
            resolve();
        }).catch((err)=> {
            reject("unable to sync with the database")}
    
         )
    })
}

module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject) => {
        Employee.findAll().then(function(data){
            /*data = data.map((value) => value.dataValues); //pull the data(exclusively)*/
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    });

}

module.exports.getDepartments = function(){
    return new Promise((resolve, reject) => {
        Department.findAll().then(function(data){
            data = data.map((value) => value.dataValues);
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    });
}

module.exports.getManagers = function() {
    return new Promise((resolve, reject) => {
        reject();
    })
}

module.exports.addEmployee = function(employeeData){
    return new Promise(function(resolve,reject){
        employeeData.isManager=(employeeData.isManager)?true:false;
        for(const prop in employeeData){
            if (`employeeData.${prop} == ""`) `employeeData.${prop} = null`
        }
        Employee.create().then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    });

}

module.exports.getEmployeesByStatus = function(statusData){
    return new Promise(function(resolve,reject){
        Employee.findAll({
            where: {status: statusData}
        }).then(function(data){
            resolve(data)
        }).catch((err)=>{
            reject("no results returned");
        })
        
    })
}

module.exports.getEmployeesByDepartment = function(departmentData){
    return new Promise(function(resolve,reject){
        Employee.findAll({
            where:{department: departmentData}
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
      
    })
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve,reject){
        Employee.findAll({
            where:{employeeManagerNum: manager}
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
      
    })
}

module.exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve,reject){
        Employee.findAll({
            where:{employeeNum: num}
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
      
    })
}

module.exports.updateEmployee = function(employeeData){
    return new Promise(function(resolve,reject){
        employeeData.isManager=(employeeData.isManager)?true:false;
        for(const prop in employeeData){
            if (`employeeData.${prop} == ""`) `employeeData.${prop} = null`
        }
        Employee.update({
            where:{employeeNum:employeeData.employeeNum}
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    });
}