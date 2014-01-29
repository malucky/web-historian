var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpRequest = require('http-request');
var url = require("url");

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};


var getRequest = function(pathname, response){
  serveAssets(response, pathname, 200);
};
var postRequest = function(pathname, response) {
  //look in archive to see if it is in list.
  archive.readListOfUrls(pathname, function(fileList, url){
    var found = archive.isUrlInList(fileList, url);
    if (found === true) {
      console.log('found');
    }
  });
  sendResponse(response, 201, null);

};
var corsRequest = function(pathname, response) {
  console.log('cors request');
  sendResponse(response, 200, null);
};

var methods = {
  GET: getRequest,
  POST: postRequest,
  OPTIONS: corsRequest
};

exports.serveAssets = serveAssets = function(response, asset, statusCode) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  var fileName;
  var contentType;
  if (asset === '/') {
    fileName = '/index.html'
    contentType = 'text/html'; 
  } else if (asset === '/styles.css') {
    fileName = '/' + asset;
    contentType = 'text/css';
  } 
  else {
    fileName = '/' + asset;
    contentType = 'text/html'
  }
  fs.readFile(archive.paths.siteAssets+fileName, 'utf-8', function(err, data){
    if (err) throw err;
    sendResponse(response, statusCode, data, contentType);
  });
};

// As you progress, keep thinking about what helper functions you can put here!
exports.route =  route = function(request, response) {
  var method = request.method;
  var pathname = url.parse(request.url).pathname;
  if (methods[method]) {
    methods[method](pathname, response);
  } else {
    sendResponse(response, 404, null);
  }
};

exports.sendResponse = sendResponse = function(response, statusCode, data, contentType) {
  headers['Content-Type'] = contentType;
  response.writeHead(statusCode, headers);
  response.end(data);
};
