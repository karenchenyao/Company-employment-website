/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: __Yao Chen________ Student ID: ____134082197_________ Date: ____August 4 2021_______
*https://ychen-569.herokuapp.com/
* Online (Heroku) Link: _________________________
*
********************************************************************************/

var express = require ("express");
var app = express();
var path = require("path");
const multer = require("multer");
const fs = require ("fs");
const data = require ("./data-service.js");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const dataServiceAuth = require ("./data-service-auth");
const clientSessions = require("client-sessions");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.engine('.hbs',exphbs({
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }

    }
})

);
app.set('view engine','.hbs');

var HTTP_PORT = process.env.PORT || 8080;

/*function onHTTPStart(){
    console.log("Express http server listening on PORT: " + HTTP_PORT);
}*/

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req,file,cb){
        cb(null,Date.now() + path.extname(file.originalname))    
    }

});

const upload = multer({storage:storage});

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route =="/")?"/":route.replace(/\/$/,"");
    next();
});

app.use(clientSessions({
    cookieName: "session",
    secret: "web322_A6",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

function ensureLogin(req,res,next){
    if(!req.session.user){
        res.redirect("/login");
    }else{
        next();
    }
}

app.get("/", function(req,res){
    res.render("home");
});

app.get("/about", function(req,res){
    res.render("about")
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post('/register', (req,res)=>{
    dataServiceAuth.registerUser(req.body).then(()=>{
        res.render("register",{successMessage: "User created"});
    }).catch((err)=>{
        res.render("register",{errorMessage: err, userName: req.body.userName});
    });
});

app.post("/login", (req,res)=>{
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body).then((user)=>{
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }
        res.redirect('/employees');
    }).catch((err)=>{
        res.render("login",{errorMessage: err, userName: req.body.userName});
    });
});

app.get("/logout", (req,res)=>{
    req.session.reset();
    res.redirect('/');
});

app.get("/userHistory", ensureLogin, (req, res)=>{
    res.render("userHistory");
});

app.get("/images/add",ensureLogin,(req,res)=>{
    res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), ensureLogin, (req,res) => {
        res.redirect("/images");
});

app.get("/images", ensureLogin, (req,res)=>{
    fs.readdir("./public/images/uploaded", (err,items)=>{
        res.render("images",{images:items});
    })

})

app.get("/managers",ensureLogin, (req,res)=>{
    data.getManagers().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err)
    });
});

app.get("/employees",ensureLogin, (req,res)=>{
        if (req.query.status){
            data.getEmployeesByStatus(req.query.status).then((data)=>{
                res.render("employees", {employees: data})
            }).catch((err)=>{
                res.render({message:"error on getEmployeesByStatus route"});
            })
            
        }
        else
        if (req.query.department){
            data.getEmployeesByDepartment(req.query.department).then((data)=>{
                if (data.length > 0){
                    res.render("employees", {employees: data})
                }
                else {
                    res.render("employees", {message: "no results"})
                }
    
            }).catch((err)=>{
                res.render({message:"error on getEmployeesByDepartment route"});
            })
        }
        else
        if(req.query.manager){
            data.getEmployeesByManager(req.query.manager).then((data)=>{
                res.render("employees", {employees: data})
            }).catch((err)=>{
                res.render({message:"error on getEmployeesByManager route"});
            })
        }
        else {
            data.getAllEmployees().then((data)=>{
                if(data.length >0){
                    res.render("employees", {employees: data});
                }
                else {
                    res.render("employees", {message: "no results"})
                };
            }).catch((err)=>{
                res.render({message:"error on getAllEmployees route"});
            })
        }
});

app.get("/employee/:empNum",ensureLogin, (req,res)=>{
    let viewData = {};

    data.getEmployeeByNum(req.params.empNum).then((data)=>{
        if(data){
            viewData.employee=data;
        }else{
            viewData.employee=null;
        }
    }).catch(()=>{
        viewData.employee=null;
    }).then(data.getDepartments).then((data)=>{
        viewData.departments=data;

        for(let i=0; i<viewData.departments.length;i++){
            if(viewData.departments[i].departmentId==viewData.employee.department){
                viewData.departments[i].selected=true;
            }
        }
    }).catch(()=>{
        viewData.departments=[];
    }).then(()=>{
        if(viewData.employee==null){
            res.status(404).send("Employee Not Found");
        }
        else{
            res.render("employee",{viewData:viewData});
        }
    });
})

app.get("/employees/add", ensureLogin, (req,res)=>{
    data.getDepartments().then((data)=>{
        if (data.length > 0){
            res.render("addEmployee",{departments:data})
        }
        else{
            res.render("addEmployee",{departments: []})
        }
        }).catch((err)=>{
            console.error(err);
            res.render("error on addEmployee route")
        })
    });

app.post("/employees/add", ensureLogin, (req,res)=>{
        data.addEmployee(req.body).then(()=>{
            res.redirect("/employees");
        })
});

app.post("/employee/update", ensureLogin, (req, res) => {
    data.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    });
});

app.get("/employees/delete/:empNum", ensureLogin, (req,res)=>{
    data.deleteEmployeeByNum(req.params.empNum).then(()=>{
        res.redirect("/employees")
    }).catch((err)=>{
            res.status(500).send("Unable to Remove Employee!");
        });
})

app.get("/departments",ensureLogin, (req,res)=>{
    data.getDepartments().then((data)=>{
        if(data.length >0){
            res.render("departments", {departments: data});
        }
        else {
            res.render("departments", {message: "no results for Department table"});
        }
    }).catch((err)=>{
        console.error(err);
        res.render({message:"error on departments route"});
    })
});


app.get("/department/:depId",ensureLogin, (req,res)=>{
    data.getDepartmentById(req.params.depId).then((data)=>{

        if (data.length > 0) {
            res.render("department", {department: data[0]});
        }
        else {
            
            res.status(404).send("Department Not Found");
        }
    }).catch((err)=>{
        console.error(err);
        res.status(404).send("Error on getDepartmentByID route");
    });
})


app.get("/departments/add",ensureLogin, (req,res)=>{
    res.render("addDepartment");
});

app.post("/departments/add", ensureLogin, (req,res)=>{
        data.addDepartment(req.body).then(()=>{
            res.redirect("/departments");
        })
});

app.post("/department/update", ensureLogin, (req, res) => {
    data.updateDepartment(req.body).then(()=>{
        res.redirect("/departments");
    });
});

app.get("/departments/delete/:depId",ensureLogin, (req,res)=>{
    data.deleteDepartmentById(req.params.depId).then(()=>{
        res.redirect("/departments")
    }).catch((err)=>{
            res.status(500).send("Unable to Remove Department!");
        });
})

app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

data.initialize()
.then(dataServiceAuth.initialize)
.then(function(){
    app.listen(HTTP_PORT,function(){
        console.log("app listening on:" + HTTP_PORT)
    });
}).catch(function(err){
    console.log("Unable to start server: " + err);
});

