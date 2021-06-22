var express = require ("express");
var app = express();
var path = require("path");
const multer = require("multer");
const fs = require ("fs");
const data = require ("./data-service.js");
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


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

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "/views/home.html"))
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname, "/views/about.html"))
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
            data.getEmployeesByStatus(req.query.department).then((data)=>{
                res.json(data)
            }).catch((err)=>{
                res.json({message:"no results"});
            })
        }
        else
        if(req.query.employees){
            data.getEmployeesByStatus(req.query.employees).then((data)=>{
                res.json(data)
            }).catch((err)=>{
                res.json({message:"no results"});
            })
        }
        else {
            data.getAllEmployees().then((data)=>{
                res.json(data);
            }).catch((err)=>{
                res.json({message:"no results"});
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
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"))
});

app.get("/images/add",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addImage.html"))
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
