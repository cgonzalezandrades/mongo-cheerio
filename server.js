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
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//app.set('views',path.join(__dirname,'views'));

app.use(express.static(process.cwd() + '/public'));



// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));


// Database configuration with mongoose
mongoose.connect('mongodb://localhost/newYokTimesArticles');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function () {
  console.log('Mongoose connection successful.');
});


var Note = require('./model/note');
var Article = require('./model/article');

var todaysPaper = "http://www.nytimes.com/pages/todayspaper/index.html?action=Click&module=HPMiniNav&region=TopBar&WT.nav=page&contentCollection=TodaysPaper&pgtype=Homepage";


app.get("/", function (req, res) {

  var articles = Article.find({}, function (err, doc) {

    console.log(doc);
    res.render('index', {
      doc: doc
    });

  })

});




app.get('/scrape', function (err, res) {

//  var myArticle = [];

  request(todaysPaper, function (error, response, html) {

    var $ = cheerio.load(html);

    $('.story').each(function (i, element) {

      var result = {};

      result.title = $(this).children('h3').text();
      result.articleNote = $(this).find('p').text();
      result.text = $(this).children('p').text();
      result.link = $(this).find('a').attr('href');
      result.image = $(this).find('img').attr('src');
//      result.image = $(this).find('img').text();


//      myArticle.push({
//        title: $(this).children('h3').text(),
//        text: $(this).children('p').text(),
//        link: $(this).find('a').attr('href')
//      });

      // console.log($(this).find('img').attr('src'));
      
      var entry = new Article(result);

      entry.save(function (err, doc) {
//        console.log(doc);

      })

    });



//    console.log(myArticle);
//    res.json(res);



  });

  res.send("scrape completed");
  
});

app.get('/articles', function (req, res) {
  // grab every doc in the Articles array
  Article.find({}, function (err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    }
    // or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});









app.listen(3001, function () {
  console.log("app running on port 3001");
});