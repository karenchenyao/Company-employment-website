var express = require ("express");
var app = express();
var path = require("path");
const multer = require("multer");
const fs = require ("fs");
const data = require ("./data-service.js");
const bodyParse = require('body-parser');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

var upload = multer({storage:storage});

var HTTP_PORT = process.env.PORT || 8080;


function onHTTPStart(){
    console.log("Express http server listening on PORT: " + HTTP_PORT);
}

var storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req,file,cb){
        cb(null,Date.now() + path.extname(file.originalname))    
    }

});


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

app.get("/images", (req,res)=>{
    var path = "./public/image/uploaded";
    fs.readdir(path, (err,items)=>{
        for (var i=0; i<items.length;i++){
            var images="images" + ':'+ items[i];
        }
        res.json(images);
    })

})
app.post("/images/add", (req,res) => {
    upload.single("imageFile").then(() => {
        res.redirect("/images");
    });
});

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
