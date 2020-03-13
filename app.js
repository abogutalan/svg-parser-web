'use strict'

/*
*   Abdullah Ogutalan
*   1109732     A3
*/
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

let sharedLib = ffi.Library('./libsvgparse', {
      'createValidSVGimage': [ 'pointer', [ 'string', 'string' ] ],
      'SVGtoJSON': [ 'string', [ 'pointer' ] ],
      'getSVGTitle': [ 'string', [ 'pointer' ] ],
      'getSVGDescription': [ 'string', [ 'pointer' ] ],
      'mySVGToRectJSON': [ 'string', [ 'pointer' ] ],
      'mySVGToCircJSON': [ 'string', [ 'pointer' ] ],
      'mySVGToPathJSON': [ 'string', [ 'pointer' ] ],
      'mySVGToGroupJSON': [ 'string', [ 'pointer' ] ],
      'showRectAttributes': [ 'string', [ 'pointer' ] ],      
      'showCircAttributes': [ 'string', [ 'pointer' ] ],     
      'showPathAttributes': [ 'string', [ 'pointer' ] ],     
      'showGroupAttributes': [ 'string', [ 'pointer' ] ],      
      'createNewSVGobject': [ 'void', [ 'string', 'string', 'string' ] ],      
      'setTitleAndDesc': [ 'void', [ 'pointer', 'string', 'string', 'string' ] ]      

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

    /* checking if the svg is valid */
    if ( svgJson !== "invalid SVG!") {
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
    else fs.unlinkSync(path);

  }
  
  // console.log("The data being sent is : ");
  // console.log(myStack);

  res.send(myStack);
});

app.post('/edit', function(req, res) {
  var output = {};
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    /* title */
    let titleStr = output.title.toString();
    let titleWords = titleStr.split('+');
    let title = "";
    for ( let i = 0; i < titleWords.length; i++){
      title += titleWords[i] + " ";
    }
    /* decription */
    let descStr = output.description.toString();
    let descWords = descStr.split('+');
    let description = "";
    for ( let i = 0; i < descWords.length; i++){
      description += descWords[i] + " ";
    }
    /* filename */
    let filename = output.fileName.toString();

    /* check if file name has .svg extension */
    let extension = filename.substring(filename.length - +4, filename.length);

    /* creating new valid SVG */
    if((".svg" === extension) && (filename.length != 0)) {
      sharedLib.createNewSVGobject("./uploads/" + filename, title, description);
    }
    else console.log("Invalid extension or empty file name ERROR !");
  })
  
  // console.log(output); //empty 
  
  res.redirect('/');

});

app.post('/editTitleAndDescription', function(req, res) {
  var output = {};
  var path;
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    // console.log("posted data:");
    /* title */
    let titleStr = output.title.toString();
    let titleWords = titleStr.split('+');
    let title = "";
    for ( let i = 0; i < titleWords.length; i++){
      title += titleWords[i] + " ";
    }
    // console.log("title : "+title);
    /* decription */
    let descStr = output.description.toString();
    let descWords = descStr.split('+');
    let description = "";
    for ( let i = 0; i < descWords.length; i++){
      description += descWords[i] + " ";
    }
    // console.log("description : " + description);
    /* filename */
    let filename = output.fileName.toString();
    // console.log("filename : " + filename);

    /* check if file name has .svg extension */
    let extension = filename.substring(filename.length - +4, filename.length);
    // console.log("Extension of SVG :", extension);

    path = "./uploads/"+ filename.toString();
    // console.log("testing path: "+ path);

    if(filename.length != 0) {
      let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
      sharedLib.setTitleAndDesc(img, title, description, path);
    }
    else console.log("File name is empty!");

    

    /* creating new valid SVG */
    // if(".svg" === extension) {
    //   sharedLib.createNewSVGobject("./uploads/" + filename, title, description);
    // }
  })
  
  // console.log(output); //empty 
  
  res.redirect('/');

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

    /* if it is a valid SVG */
    if ( svgTitle !== "Invalid SVG!") {
      var svgDesc = sharedLib.getSVGDescription(panelSVGimage);


      let rects = sharedLib.mySVGToRectJSON(panelSVGimage);      
      let circles = sharedLib.mySVGToCircJSON(panelSVGimage);
      let paths = sharedLib.mySVGToPathJSON(panelSVGimage);
      let groups = sharedLib.mySVGToGroupJSON(panelSVGimage);
      
    let rectAttr = sharedLib.showRectAttributes(panelSVGimage);
    let circleAttr = sharedLib.showCircAttributes(panelSVGimage);  
    let pathAttr = sharedLib.showPathAttributes(panelSVGimage);  
    let groupAttr = sharedLib.showGroupAttributes(panelSVGimage);  
    rectAttr = JSON.parse(rectAttr);
    circleAttr = JSON.parse(circleAttr);
    pathAttr = JSON.parse(pathAttr);
    groupAttr = JSON.parse(groupAttr);

    // console.log(pathAttr);
  
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
        groups: groups,
        otherAttrOfRects: rectAttr,
        otherAttrOfCircs: circleAttr,
        otherAttrOfPaths: pathAttr,
        otherAttrOfGroups: groupAttr
      };
      stack.push(svgViewJSON);
    }

    
  }

  // console.log("JSON to svg view panel is: ");
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
