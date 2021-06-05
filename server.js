var express = require ("express");
var app = express();
var path = require("path");
const data = require ("./data-service.js");
app.use(express.static('public'));

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

app.get("/employees",(req,res){
    data.getAllEmployees().then(data)=>{
        res.json(data);
    }.catch((err)=>{
        res.json(err);
    });
});

app.get("/managers",(req,res){
    data.getManagers().then(data)=>{
        res.json(data);
    }.catch((err)=>{
        res.json(err);
    });
});

app.get("/departments",(req,res){
    data.getDepartments().then(data)=>{
        res.json(data);
    }.catch((err)=>{
        res.json(err);
    });
});

app.use((req,res)=>{
    res.status(404).send("Pages does not exist");
});

data.initialize().then(function(){
    app.listen(HTTP_PORT, onHTTPStart);
}).catch(function(err){
    console.log("Unable to start server: " + err);
});
