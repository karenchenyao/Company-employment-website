const Sequelize=require('sequelize');

var sequelize=new Sequelize('d67m4e9964gmqq','sqdoalmxntwgfj','60eaa24b4b9ec41e2d25328b1bcb7898ba14e1e509d69f2f06b8bd004909b717',{
    host:'ec2-52-55-33-170.compute-1.amazonaws.com',
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
    
         );
    });
}

module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject) => {
        Employee.findAll().then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("err on getAllEmployees");
        })
    });

}

module.exports.getManagers = function() {
    return new Promise((resolve, reject) => {
        reject();
    })
}

module.exports.getEmployeesByStatus = function(statusData){
    return new Promise(function(resolve,reject){
        Employee.findAll({
            where: {status: statusData}
        }).then(function(data){
            resolve(data)
        }).catch((err)=>{
            reject("error on getEmployeesByStatus");
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
            reject("error on getEmployeesByDepartment");
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
            reject("error on getEmployeesByManager");
        })
      
    })
}

module.exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve,reject){
        Employee.findAll({
            where:{employeeNum: num}
        }).then(function(data){
            resolve(data[0]);
        }).catch((err)=>{
            reject("error on getEmployeeByNum");
        })
      
    })
}

module.exports.addEmployee = function(employeeData){
    return new Promise(function(resolve,reject){
        employeeData.isManager=(employeeData.isManager)?true:false;
        for( var prop in employeeData){
            if (employeeData[prop] == '') {
                employeeData[prop] = null
            }
        }
        Employee.create(employeeData).then(function(data){
            resolve(data);
        }).catch((err)=>{
            console.error(err);
            reject("error on addEmployee");
        })
    });

}

module.exports.updateEmployee = function(employeeData){
    return new Promise(function(resolve,reject){
        employeeData.isManager=(employeeData.isManager)?true:false;
        for(var prop in employeeData){
            if (employeeData[prop] == '') {
                employeeData[prop] = null;
            }
        }
        Employee.update(employeeData,
            {where:{employeeNum:employeeData.employeeNum}
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            console.error(err);
            reject("error on updateEmployee");
        })
    });
}

module.exports.deleteEmployeeByNum = function(empNum){
    return new Promise(function(resolve,reject){
        Employee.destroy({
            where: {employeeNum: empNum}
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            console.error(err);
            reject("employee destroy was rejected!")
        });
    });
}

module.exports.getDepartments = function(){
    return new Promise((resolve, reject) => {
        Department.findAll().then(function(data){
            resolve(data);
        }).catch((err)=>{
            console.error(err);
            reject("err on getDepartments");
        });
    });
}

module.exports.getDepartmentById = function(depId){
    return new Promise(function(resolve,reject){
            Department.findAll({
                where:{departmentId: depId}
            }).then(function(data){
                resolve(data);
            }).catch((err)=>{
                reject("error on getDepartmentById function");
            })
    
    })
}

module.exports.addDepartment = function(departmentData){
    return new Promise(function(resolve,reject){
        for(var prop in departmentData){
            if (departmentData[prop] == '') {
                departmentData[prop] = null;
            }
        }
        Department.create(departmentData).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("error on addDepartment function");
        })
    });

}

module.exports.updateDepartment = function(departmentData){
    return new Promise(function(resolve,reject){
        for(var prop in departmentData){
            if (departmentData[prop] == ''){
                departmentData[prop] = null 
            } 
        }
        Department.update(departmentData,{
            where:{departmentId:departmentData.departmentId}
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("error on updateDepartment function");
        })
    });
}
module.exports.deleteDepartmentById = function(depId){
    return new Promise(function(resolve,reject){
        Department.destroy({
            where: {departmentId: depId}
        }).then(function(data){
            resolve(data);
        }).catch((err)=>{
            console.error(err);
            reject("department destroy was rejected!")
        });
    });
}