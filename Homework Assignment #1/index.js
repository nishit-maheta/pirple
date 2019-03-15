
// Homework assignment #!

// Import Dependences 
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Create the server
var server = http.createServer(function(req,res){

  var parseURL = url.parse(req.url, true);
  var path = parseURL.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');
  var queryStringObject = parseURL.query;
  var method = req.method.toLowerCase();
  var headers = req.headers;
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  //  decoder data
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
 
  // Request ends event
  req.on('end', function() {
      buffer += decoder.end();
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      chosenHandler(data,function(statusCode,payload){
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        var payloadString = typeof(payload) == 'string'? payload : '';
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode,payloadString);
      });
	});
});

server.listen(3000,function(){
  console.log('The server is up and running now');
});

var handlers = {};

handlers.hello = function(data,callback){
    callback(200,"Welcome to the API");
};

handlers.notFound = function(data,callback){
  callback(404);
};

var router = {
  'hello' : handlers.hello
};