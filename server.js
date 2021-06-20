var express = require ("express");
var app = express();
var path = require("path");
var multer = require("multer");
const data = require ("./data-service.js");
app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;


function onHTTPStart(){
    console.log("Express http server listening on PORT: " + HTTP_PORT);
}

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "/views/home.html"))
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get("/employees",(req,res)=>{
    data.getAllEmployees().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err)
    });
});

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
    res.sendFile(path.join(_dirname,"/views/addEmployee.html"))
});

app.get("/images/add",(req,res)=>{
    res.sendFile(path.join(_dirname,"/views/addImages.html"))
});

app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

data.initialize().then(function(){
    app.listen(HTTP_PORT, onHTTPStart);
}).catch(function(err){
    console.log("Unable to start server: " + err);
});
