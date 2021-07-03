/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: __Yao Chen________ Student ID: ____134082197_________ Date: ____June 23 2021_______
*
* Online (Heroku) Link: ______https://ychen-569.herokuapp.com/___________________
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


function onHTTPStart(){
    console.log("Express http server listening on PORT: " + HTTP_PORT);
}

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
   

app.get("/", function(req,res){
    res.render("home");
});

app.get("/about", function(req,res){
    res.render("about")
});

app.get("/employees",(req,res)=>{
        if (req.query.status){
            data.getEmployeesByStatus(req.query.status).then((data)=>{
                res.json(data)
            }).catch((err)=>{
                res.json({message:"no results"});
            })
            
        }
        else
        if (req.query.department){
            data.getEmployeesByDepartment(req.query.department).then((data)=>{
                res.json(data)
            }).catch((err)=>{
                res.json({message:"no results"});
            })
        }
        else
        if(req.query.employees){
            data.getEmployeesByManager(req.query.employees).then((data)=>{
                res.json(data)
            }).catch((err)=>{
                res.json({message:"no results"});
            })
        }
        else {
            data.getAllEmployees().then((data)=>{
                res.json(data);
            }).catch((err)=>{
                res.json({message:"wrong message"});
            })
        }
});

app.get("/employee/:empNum",(req,res)=>{
    data.getEmployeeByNum(req.params.empNum).then((data)=>{
        res.json(data)
    }).catch((err)=>{
        res.json({message:"no results"})
    });
})

app.get("/managers",(req,res)=>{
    data.getManagers().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err)
    });
});

app.get("/departments",(req,res)=>{
    data.getDepartments().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err)
    });
});

app.get("/employees/add",(req,res)=>{
    res.render("addEmployee");
});

app.get("/images/add",(req,res)=>{
    res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), (req,res) => {
        res.redirect("/images");
});

app.get("/images", (req,res)=>{
    fs.readdir("./public/images/uploaded", (err,items)=>{
        res.render("images",{images:items});
    })

})

app.post("/employees/add", (req,res)=>{
    data.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    });
});




app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

data.initialize().then(function(){
    app.listen(HTTP_PORT, onHTTPStart);
}).catch(function(err){
    console.log("Unable to start server: " + err);
});
