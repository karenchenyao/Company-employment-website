var express = require ("express");
var app = express();
var path = require("path");

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

app.listen(HTTP_PORT, onHTTPStart);