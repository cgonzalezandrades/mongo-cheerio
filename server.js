/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Notice: Our scraping tools are prepared, too
var request = require('request'); 
var cheerio = require('cheerio');
var path = require('path');


var exphbs = require('express-handlebars');

//app.set('views',path.join(__dirname,'views'));

app.use(express.static(process.cwd() + '/public'));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));


// Database configuration with mongoose
mongoose.connect('mongodb://localhost/week18day3mongoose');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


var Note = require('./model/note');
var Article = require('./model/article');


app.get("/", function(req, res){
  res.render('./layouts/main');
  
});

app.listen(3000, function(){
  console.log("app running on port 3000");
});
