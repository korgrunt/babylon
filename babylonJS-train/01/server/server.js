var express = require('express');
var mailer = require('express-mailer');
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser');

var app = express();

/* ALLOW ALL ORIGIN FOR XHR */
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });
/* ALLOW ORIGIN FOR XHR */

//app.use(logger({path: "/path/to/logfile.txt"}));
// app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '../../01')));
app.use(express.static(path.join(__dirname, '../js')));
app.use(express.static(path.join(__dirname, '../myFrameWork')));
app.use(express.static(path.join(__dirname, '../assets')));



app.engine('html', swig.renderFile);

app.set('view engine', 'html');

app.get('/*', function(req,res){
 res.render('index');
});

app.listen(3000);
console.log("app is running on port 3000");
