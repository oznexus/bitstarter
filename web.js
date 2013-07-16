
var express = require('express');

var fs = require('fs');

var app = express.createServer(express.logger());

// This is no good if we want immediate feedback in the browser
//var myHtml = fs.readFileSync("index.html", "utf8");



app.get('/', function(request, response) {
  // Grab any changes I may have made to html
  var contents = fs.readFileSync('index.html');
  response.send(contents);

  //response.send(myHtml);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
