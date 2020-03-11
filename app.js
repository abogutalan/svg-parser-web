'use strict'

// C library API
const ffi = require('ffi-napi');

// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.static(path.join(__dirname+'/uploads')));

// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});

//Respond to POST requests that upload files to uploads/ directory
app.post('/upload', function(req, res) {
  if(!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  let uploadFile = req.files.uploadFile;
 
  // Use the mv() method to place the file somewhere on your server
  uploadFile.mv('uploads/' + uploadFile.name, function(err) {
    if(err) {
      return res.status(500).send(err);
    }

    res.redirect('/');
  });
});

//Respond to GET requests for files in the uploads/ directory
app.get('/uploads/:name', function(req , res){
  fs.stat('uploads/' + req.params.name, function(err, stat) {
    if(err == null) {
      res.sendFile(path.join(__dirname+'/uploads/' + req.params.name));
    } else {
      console.log('Error in file downloading route: '+err);
      res.send('');
    }
  });
});

//******************** Your code goes here ******************** 

let sharedLib = ffi.Library('parser/bin/libsvgparse', {
      'createValidSVGimage': [ 'pointer', [ 'string', 'string' ] ],
      'SVGtoJSON': [ 'string', [ 'pointer' ] ],
      'getSVGTitle': [ 'string', [ 'pointer' ] ],
      'getSVGDescription': [ 'string', [ 'pointer' ] ],
      'mySVGToRectJSON': [ 'string', [ 'pointer' ] ],
      'mySVGToCircJSON': [ 'string', [ 'pointer' ] ],
      'mySVGToPathJSON': [ 'string', [ 'pointer' ] ],
      'mySVGToGroupJSON': [ 'string', [ 'pointer' ] ],
      

});

/* file log table */
app.get('/uploadedFiles', function(req, res) {


  var myStack = [];
  let path;
  var fs = require('fs');
  var files = fs.readdirSync("./uploads/");

  for (var i in files) {

    path = "./uploads/"+ files[i];

    /* get file size */
    var stats = fs.statSync(path);
    var fileSizeInBytes = stats["size"];
    let fileSizeKB = fileSizeInBytes / 1024;
    var roundedNum = Math.round(fileSizeKB);
    var fileSize = roundedNum.toString(8) + "KB";

    /* converting SVG image to JSON string */
    var SVGimage = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
    var svgJson = sharedLib.SVGtoJSON(SVGimage);
    svgJson = JSON.parse(svgJson);

    var myJson = {
      fileName: files[i],
      fileSize: fileSize,
      numRect: svgJson.numRect,
      numCirc: svgJson.numCirc,
      numPath: svgJson.numPaths,
      numGroups: svgJson.numGroups
    };

    myStack.push(myJson);

  }

  
  // console.log("The data being sent is : ");
  // console.log(myStack);

  res.send(myStack);
});

/* svg view panel */
app.get('/svgView', function(req, res){

  // var fN = req.query.fileName;  // -> getting file name from index.js
  // console.log("++++file name :::: "+fN);

  


  let stack = [];
  let path;
  var fs = require('fs');
  var files = fs.readdirSync("./uploads/");

  for (var i in files) {

    path = "./uploads/"+ files[i];

    var panelSVGimage = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");

    var svgTitle = sharedLib.getSVGTitle(panelSVGimage);
    var svgDesc = sharedLib.getSVGDescription(panelSVGimage);

    let rects = sharedLib.mySVGToRectJSON(panelSVGimage);
    let circles = sharedLib.mySVGToCircJSON(panelSVGimage);
    let paths = sharedLib.mySVGToPathJSON(panelSVGimage);
    let groups = sharedLib.mySVGToGroupJSON(panelSVGimage);

    rects = JSON.parse(rects);
    circles = JSON.parse(circles);
    paths = JSON.parse(paths);
    groups = JSON.parse(groups);


    let svgViewJSON = {
      fileName: files[i],
      desc: svgDesc.toString(),
      title: svgTitle.toString(),
      rects: rects,
      circles: circles,
      paths: paths,
      groups: groups
    };
    stack.push(svgViewJSON);
  }

  console.log("JSON to svg view panel is: ");
 // console.log(stack); 

  res.send(stack);

});

//Sample endpoint
app.get('/someendpoint', function(req , res){
  let retStr = req.query.name1 + " " + req.query.name2;
  res.send({
    foo: retStr
  });
});

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);
