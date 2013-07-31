
var express = require('express');

var fs = require('fs');
// It seems that this is depreciated
//var app = express.createServer(express.logger());
var app = express();


// This is no good if we want immediate feedback in the browser
//var myHtml = fs.readFileSync("index.html", "utf8");



app.get('/', function(request, response) {
  // Grab any changes I may have made to html
  var contents = fs.readFileSync('index.html', "utf8");
  response.send(contents);

  //response.send(myHtml);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
