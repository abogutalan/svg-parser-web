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
      'validateSVGimage': [ 'int', [ 'pointer', 'string' ] ],
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
      'setTitleAndDesc': [ 'void', [ 'pointer', 'string', 'string', 'string' ] ],  
      'addRect': [ 'void', [ 'pointer', 'string', 'string', 'string', 'string', 'string', 'string' ] ],      
      'addCircle': [ 'void', [ 'pointer', 'string', 'string', 'string', 'string', 'string' ] ],     
      'addPath': [ 'void', [ 'pointer', 'string', 'string' ] ],
      'editAttributes': [ 'string', [ 'pointer', 'string', 'int', 'string', 'string', 'string' ] ],
      'scaleRectangle': [ 'string', [ 'pointer', 'string', 'int' ] ],
      'scaleCircle': [ 'string', [ 'pointer', 'string', 'int' ] ]      
      
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

app.post('/editAttr', function(req, res) {
  var output = {};
  var path;
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    /* attr name */
    let nameStr = output.attrName.toString();
    let nameWords = nameStr.split('+');
    let name = "";
    for ( let i = 0; i < nameWords.length; i++){
      name += nameWords[i];
    }
    /* attr value */
    let valueStr = output.attrValue.toString();
    let valueWords = valueStr.split('+');
    let value = "";
    for ( let i = 0; i < valueWords.length; i++){
      value += valueWords[i];
    }
    /* elem_type & index */
    let selectedShape = output.selectedShape.toString();
    let words = selectedShape.split('+');
    let elem_type, index;
    elem_type = words[0].trim();
    index = parseInt(words[1]) - +1;
    // console.log("elem_type : "+elem_type+ " - index: "+ index);

    let filename = output.filename.toString();
    path = "./uploads/"+ filename.toString();
    let filesize = getFileSize(path);

    if(filename.length != 0) {
      let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
      let isEditedAttribute = sharedLib.editAttributes(img, elem_type, index, name, value, path);
      console.log(isEditedAttribute);

      /* check validation */
      let retVal = sharedLib.validateSVGimage(img, "parser/validation/svg.xsd");
      if(retVal == 0) {
        console.log("SVG is invalid after setting attributes!");
        fs.unlinkSync(path);
      } else {
        /* insert record into the IMG_CHANGE table if the svg is still valid */
        trackChanges_EditAttributes(filename, elem_type, index, name, value, filesize);
      }


    }
    else console.log("File name is empty!");

  })
    
  res.redirect('/');

});

function trackChanges_EditAttributes(filename, elem_type, index, name, value, filesize){

  let changeType = "edit attribute";
  let description = "edit " + name + "=" + value + " for " + elem_type + " " + index + " of " + filename ;
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = "INSERT INTO IMG_CHANGE (change_type, change_summary, change_time, svg_id)\
     VALUES ('"+ changeType + "', '"+ description + "', '" + date + "', (SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";
    
    let updateFileSize = "UPDATE FILE SET file_size="+filesize+" WHERE FILE.file_name = '"+filename+"'";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(query);
            await connection.execute(updateFileSize);
            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
}

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

    path = "./uploads/"+ filename.toString();
    // console.log("testing path: "+ path);

    if(filename.length != 0) {
      let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
      sharedLib.setTitleAndDesc(img, title, description, path);
      
      trackChanges_EditTitleAndDesc(filename, title, description);
    }
    else console.log("File name is empty!");

  })
    
  res.redirect('/');

});

function trackChanges_EditTitleAndDesc(filename, title, desc){

  let changeType = "edit title and description";
  let description = "edit "+ filename + " as title=" + title + " & description=" + desc ;
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = "INSERT INTO IMG_CHANGE (change_type, change_summary, change_time, svg_id)\
     VALUES ('"+ changeType + "', '"+ description + "', '" + date + "', (SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(query);
            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
}

app.post('/newSVG', function(req, res) {
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
      insertIntoFileTable(filename);
      trackChanges_CreateNewSVG(filename);
    }
    else console.log("Invalid extension or empty file name ERROR !");
  })
  
  // console.log(output); //empty 
  
  res.redirect('/');

});

function trackChanges_CreateNewSVG(filename){

  let changeType = "create new svg";
  let description = filename + " is created";
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = "INSERT INTO IMG_CHANGE (change_type, change_summary, change_time, svg_id)\
     VALUES ('"+ changeType + "', '"+ description + "', '" + date + "', (SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(query);
            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
}


app.post('/addRectangle', function(req, res) {
  var output = {};
  var path;
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    /* rect->x */
    let x = output.x;

    /* rect->y */
    let y = output.y;

    /* rect->height */
    let height = output.height;

    /* rect->width */
    let width = output.width;

    /* rect->units */
    let unit = output.units.toString().trim();

    let filename = output.fileName.toString();
    
    path = "./uploads/"+ filename.toString();
    // console.log("filePath: "+ path + " x: "+x + "y: "+y +"height: "+height +"width: "+width+"units: "+units);
    let filesize = getFileSize(path);

    if(filename.length != 0) {
      let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
      sharedLib.addRect(img, path, x, y, height, width, unit);
      trackChanges_AddRect(filename, x, y, height, width, filesize);
    }
    else console.log("File name is empty!");

  })
    
  res.redirect('/');

});

function trackChanges_AddRect(filename, x, y, height, width, filesize){

  let changeType = "add rect";
  let description = "add rect at "+x+","+y+" with height "+height+" and width "+width+" to "+filename;
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = "INSERT INTO IMG_CHANGE (change_type, change_summary, change_time, svg_id)\
     VALUES ('"+ changeType + "', '"+ description + "', '" + date + "', (SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";

    let updateFileSize = "UPDATE FILE SET file_size="+filesize+" WHERE FILE.file_name = '"+filename+"'";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(query);
            await connection.execute(updateFileSize);

            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
}

app.post('/addCircle', function(req, res) {
  var output = {};
  var path;
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    /* circle->cx */
    let cx = output.cx;

    /* circle->cy */
    let cy = output.cy;

    /* circle->r */
    let r = output.r;
    
    /* circle->units */
    let unit = output.units.toString().trim();
    
    let filename = output.fileName.toString();
    
    path = "./uploads/"+ filename.toString();
    // console.log("filePath: "+ path + " x: "+cx + "y: "+cy +"radius: "+r+"units: "+units);
    let filesize = getFileSize(path);

    if(filename.length != 0) {
      let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
      sharedLib.addCircle(img, path, cx, cy, r, unit);
      trackChanges_AddCirc(filename, cx, cy, r, filesize);
    }
    else console.log("File name is empty!");

  })
    
  res.redirect('/');

});

function trackChanges_AddCirc(filename, cx, cy, r, filesize){

  let changeType = "add circle";
  let description = "add circle at "+cx+","+cy+" with radius "+r+" to "+filename;
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = "INSERT INTO IMG_CHANGE (change_type, change_summary, change_time, svg_id)\
     VALUES ('"+ changeType + "', '"+ description + "', '" + date + "', (SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";
    
     let updateFileSize = "UPDATE FILE SET file_size="+filesize+" WHERE FILE.file_name = '"+filename+"'";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(query);
            await connection.execute(updateFileSize);

            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
}


app.post('/addPath', function(req, res) {
  var output = {};
  var path;
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    /* circle->cx */
    let d_Str = output.d.toString();
    let dWords = d_Str.split('+');
    let d = "";
    for ( let i = 0; i < dWords.length; i++){
      d += dWords[i] + " ";
    }
    
    let filename = output.fileName.toString();
    
    path = "./uploads/"+ filename.toString();
    // console.log("filePath: "+ path + " d: "+d);
    let filesize = getFileSize(path);

    if(filename.length != 0) {
      let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
      sharedLib.addPath(img, path, d);
      trackChanges_AddPath(filename, d, filesize);
    }
    else console.log("File name is empty!");

  })
    
  res.redirect('/');

});

function trackChanges_AddPath(filename, d, filesize){

  let changeType = "add path";
  let description = "add path d="+d+" to "+filename;
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = "INSERT INTO IMG_CHANGE (change_type, change_summary, change_time, svg_id)\
     VALUES ('"+ changeType + "', '"+ description + "', '" + date + "', (SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";

    let updateFileSize = "UPDATE FILE SET file_size="+filesize+" WHERE FILE.file_name = '"+filename+"'";
    

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(query);
            await connection.execute(updateFileSize);
            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
}

app.post('/scaleRectangle', function(req, res) {
  var output = {};
  var path;
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }

    let scaleFactor = parseInt(output.rectFactor);
    
    let filename = output.fileName.toString();
    
    path = "./uploads/"+ filename.toString();
    let filesize = getFileSize(path);

    if(filename.length != 0) {
      let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
      let retScaleRect = sharedLib.scaleRectangle(img, path, scaleFactor);
      //console.log(retScaleRect);
      trackChanges_ScaleRect(filename, scaleFactor, filesize)
    }
    else console.log("File name is empty!");

  })
    
  res.redirect('/');

});

function trackChanges_ScaleRect(filename, scaleFactor, filesize){

  let changeType = "scale rect";
  let description = "rects of "+filename+" is scaled by "+scaleFactor;
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = "INSERT INTO IMG_CHANGE (change_type, change_summary, change_time, svg_id)\
     VALUES ('"+ changeType + "', '"+ description + "', '" + date + "', (SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";
    
     let updateFileSize = "UPDATE FILE SET file_size="+filesize+" WHERE FILE.file_name = '"+filename+"'";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(query);
            await connection.execute(updateFileSize);

            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
}

app.post('/scaleCircle', function(req, res) {
  var output = {};
  var path;
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    
    let scaleFactor = parseInt(output.circleFactor);
    
    let filename = output.fileName.toString();
    
    path = "./uploads/"+ filename.toString();

    let filesize = getFileSize(path);

    if(filename.length != 0) {
      let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
      let retScaleCirc = sharedLib.scaleCircle(img, path, scaleFactor);
      console.log(retScaleCirc);
      trackChanges_ScaleCircle(filename, scaleFactor, filesize);
    }
    else console.log("File name is empty!");

  })
    
  res.redirect('/');

});

function trackChanges_ScaleCircle(filename, scaleFactor, filesize){

  let changeType = "scale circle";
  let description = "circles of "+filename+" is scaled by "+scaleFactor;
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = "INSERT INTO IMG_CHANGE (change_type, change_summary, change_time, svg_id)\
     VALUES ('"+ changeType + "', '"+ description + "', '" + date + "', (SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";

    let updateFileSize = "UPDATE FILE SET file_size="+filesize+" WHERE FILE.file_name = '"+filename+"'";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(query);
            await connection.execute(updateFileSize);
            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
}



//Sample endpoint
app.get('/someendpoint', function(req , res){
  let retStr = req.query.name1 + " " + req.query.name2;
  res.send({
    foo: retStr
  });
});

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);


//******************** A4 code starts here ******************** 

// global data base conection variable
let dbConnection;

app.post('/db_logIn', function(req, res) {
  var output = {};
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }

    dbConnection = {
      host     : 'dursley.socs.uoguelph.ca',
      user     : output.username,
      password : output.password,
      database : output.dbName
    };

    /* Creating Tables */
    let fileQuery = "CREATE TABLE IF NOT EXISTS FILE (\
      svg_id INT AUTO_INCREMENT,\
      file_name VARCHAR(60) NOT NULL,\
      file_title VARCHAR(256),\
      file_description VARCHAR(256),\
      n_rect INT NOT NULL,\
      n_circ INT NOT NULL,\
      n_path INT NOT NULL,\
      n_group INT NOT NULL,\
      creation_time DATETIME NOT NULL,\
      file_size INT NOT NULL, \
      PRIMARY KEY (svg_id))";

    let changeQuery = "CREATE TABLE IF NOT EXISTS IMG_CHANGE (\
      change_id INT AUTO_INCREMENT,\
      change_type VARCHAR(256) NOT NULL,\
      change_summary VARCHAR(256) NOT NULL,\
      change_time DATETIME NOT NULL,\
      svg_id INT NOT NULL,\
      PRIMARY KEY (change_id),\
      FOREIGN KEY(svg_id) REFERENCES FILE(svg_id) ON DELETE CASCADE)";

    let downloadQuery = "CREATE TABLE IF NOT EXISTS DOWNLOAD (\
      download_id INT AUTO_INCREMENT,\
      d_descr VARCHAR(256),\
      svg_id INT NOT NULL,\
      PRIMARY KEY (download_id),\
      FOREIGN KEY(svg_id) REFERENCES FILE(svg_id) ON DELETE CASCADE)";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
        
        let connection;
    
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection)

            //Populate the table
            await connection.execute(fileQuery);
            await connection.execute(changeQuery);
            await connection.execute(downloadQuery);
    
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }        
      }    
    main();

  })
  
  // console.log(output); //empty 
  
  res.redirect('/');

});

function getFileSize(path){
  let stats = fs.statSync(path);
  let fileSizeInBytes = stats["size"];
  let fileSizeKB = fileSizeInBytes / 1024;
  let roundedNum = Math.round(fileSizeKB);
  let fileSizeStr = roundedNum.toString(8);
  let fileSize = parseInt(fileSizeStr);
  return fileSize;
}

app.post('/storeFiles', function(req, res) {
  var output = {};
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    
    let filename = output.filename.toString().trim();

    insertIntoFileTable(filename);
  })
    
  res.redirect('/');

});

function insertIntoFileTable(filename) {

  let path = "./uploads/"+ filename;
  let img = sharedLib.createValidSVGimage(path, "parser/validation/svg.xsd");
  /* title */
  let svgTitle = sharedLib.getSVGTitle(img);
  /* description */
  let svgDesc = sharedLib.getSVGDescription(img);
  /* num shapes */
  let svgJson = sharedLib.SVGtoJSON(img);
  svgJson = JSON.parse(svgJson);
  /* date time */
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  //.toJSON().slice(0,10).replace(/-/g,'/');
  
  /* get file size */
  let fileSize = getFileSize(path);

  let flag = "SELECT file_name FROM FILE WHERE file_name LIKE \"%" + filename + "%\" LIMIT 1;";   

  let storeFilesQuery = "INSERT INTO FILE (\
    file_name,file_title,file_description,n_rect,n_circ,n_path,n_group,creation_time,file_size)\
     VALUES ('"+ filename + "','"+ svgTitle + "','"+svgDesc + "',"+svgJson.numRect + ","+svgJson.numCirc + "\
     ,"+svgJson.numPaths + ","+ svgJson.numGroups + ",'" + date + "'," +fileSize + ")";

    async function main() {
      // get the client
      const mysql = require('mysql2/promise');
  
      let connection;
      
      try{
          // create the connection
          connection = await mysql.createConnection(dbConnection);
          //Populate the table
          const [row] = await connection.execute(flag);
          let rows_num = row.length;
          if(rows_num === 0) await connection.execute(storeFilesQuery);
          
          
      }catch(e){
          console.log("Query error: "+e);
      }finally {
          if (connection && connection.end) connection.end();
      }
      
    }
    main();
}

app.post('/trackDownloads', function(req, res) {
  var output = {};
  
  req.on('data', function(data) {
    data = data.toString();
    data = data.split('&');
    for (let i = 0; i < data.length; i++) {
        var tokenizedData = data[i].split("=");
        output[tokenizedData[0]] = tokenizedData[1];
    }
    
    let filename = output.filename.toString().trim();
    let description = filename + " is downloaded";

    let trackDownloadsQuery = "INSERT INTO DOWNLOAD (d_descr, svg_id) VALUES ('"+ description + "',(SELECT svg_id FROM FILE WHERE file_name='"+ filename + "'))";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(trackDownloadsQuery);
            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
  })
    
  res.redirect('/');

});

app.post('/db_clear', function(req, res) {
  
  req.on('data', function(data) {
    
    let trackDownloadsQuery = "delete from FILE";

      async function main() {
        // get the client
        const mysql = require('mysql2/promise');
    
        let connection;
        
        try{
            // create the connection
            connection = await mysql.createConnection(dbConnection);
            //Populate the table
            await connection.execute(trackDownloadsQuery);
            
        }catch(e){
            console.log("Query error: "+e);
        }finally {
            if (connection && connection.end) connection.end();
        }
        
      }
      main();
  })
    
  res.redirect('/');

});

app.get('/db_display', function(req, res) {

  let fileQuery = "SELECT svg_id FROM FILE";   
  let changeQuery = "SELECT change_id FROM IMG_CHANGE";   
  let downloadQuery = "SELECT download_id FROM DOWNLOAD";   

  let filesNum, changesNum, donwloadsNum;

  async function main() {
    // get the client
    const mysql = require('mysql2/promise');

    let connection;
    
    try{
        // create the connection
        connection = await mysql.createConnection(dbConnection);
        //Populate the table
        const [file] = await connection.execute(fileQuery);
        const [change] = await connection.execute(changeQuery);
        const [download] = await connection.execute(downloadQuery);
        filesNum = file.length;
        changesNum = change.length;
        donwloadsNum = download.length;

        var myJson = {
          filesNum: filesNum,
          changesNum: changesNum,
          donwloadsNum: donwloadsNum
        };  
         
        res.send(myJson);

    }catch(e){
        console.log("Query error: "+e);
    }finally {
        if (connection && connection.end) connection.end();
    }
    
  }
  main();
  
});

/* display all files on QUERY TABLE */
app.get('/queryDisplayFiles', function(req, res) {

  let fileQuery = "SELECT * FROM FILE";  
 
  executeQuery(fileQuery, res);
  
});
/* sort all files on QUERY TABLE by name */
app.get('/querySortByName', function(req, res) {

  let fileQuery = "SELECT * FROM FILE ORDER BY file_name";  
 
  executeQuery(fileQuery, res);
  
});
/* sort all files on QUERY TABLE by name */
app.get('/querySortBySize', function(req, res) {

  let fileQuery = "SELECT * FROM FILE ORDER BY file_size";  
 
  executeQuery(fileQuery, res);
  
});

/* display files between spesific dates */
app.get('/queryDisplayBetweenDates', function(req, res) {

  let startDate = req.query.first_date;
  let endDate = req.query.second_date;

  let fileQuery = "SELECT * FROM FILE WHERE creation_time BETWEEN '" + startDate + "' AND '" + endDate + "'";  
 
  executeQuery(fileQuery, res);
  
});
/* sort files between spesific dates by names*/
app.get('/queryDisplayByNames', function(req, res) {

  let startDate = req.query.first_date;
  let endDate = req.query.second_date;

  let fileQuery = "SELECT * FROM FILE WHERE creation_time BETWEEN '" + startDate + "' AND '" + endDate + "' ORDER BY file_name";  
 
  executeQuery(fileQuery, res);
  
});
/* sort files between spesific dates by size*/
app.get('/queryDisplayBySize', function(req, res) {

  let startDate = req.query.first_date;
  let endDate = req.query.second_date;

  let fileQuery = "SELECT * FROM FILE WHERE creation_time BETWEEN '" + startDate + "' AND '" + endDate + "' ORDER BY file_size";  
 
  executeQuery(fileQuery, res);
  
});
/* sort files between spesific dates by date*/
app.get('/queryDisplayByDate', function(req, res) {

  let startDate = req.query.first_date;
  let endDate = req.query.second_date;

  let fileQuery = "SELECT * FROM FILE WHERE creation_time BETWEEN '" + startDate + "' AND '" + endDate + "' ORDER BY creation_time";  
 
  executeQuery(fileQuery, res);
  
});

async function executeQuery(fileQuery, res) {
  // get the client
  const mysql = require('mysql2/promise');

  let connection;
  
  try{
      // create the connection
      connection = await mysql.createConnection(dbConnection);
      //Populate the table
      
      const [files] = await connection.execute(fileQuery);

      var myStack = [];

      for (var i in files) {

          let file_name = files[i].file_name;
          let file_title = files[i].file_title;
          let file_description = files[i].file_description;
          let n_rect = files[i].n_rect;
          let n_circ = files[i].n_circ;
          let n_path = files[i].n_path;
          let n_group = files[i].n_group;
          let creation_time = files[i].creation_time;
          creation_time = creation_time.toISOString().slice(0, 19).replace('T', ' ');
          let file_size = files[i].file_size;
          
          var myJson = {
            file_name: file_name,
            file_title: file_title,
            file_description: file_description,
            n_rect: n_rect,
            n_circ: n_circ,
            n_path: n_path,
            n_group: n_group,
            creation_time: creation_time,
            file_size: file_size
          };  
      
          myStack.push(myJson);         
    
      }       
      
      res.send(myStack);
  
  }catch(e){
      console.log("Query error: "+e);
  }finally {
      if (connection && connection.end) connection.end();
  }
  
}

/* display files between spesific dates */
app.get('/queryDisplayBetweenModifiedDates', function(req, res) {

  let startDate = req.query.first_date;
  let endDate = req.query.second_date;
  let sortType = req.query.sortType;

  // getting file names
  let modifiedFiles = "select a.svg_id, a.file_name, a.file_size, MAX(b.change_time) as maxTime, COUNT(b.svg_id) as changeNum \
  from FILE a INNER JOIN IMG_CHANGE b \
    WHERE (SELECT max(b.change_time) From IMG_CHANGE \
      WHERE (a.svg_id = b.svg_id) AND (change_time BETWEEN '"+ startDate +"' AND '"+ endDate+"')) \
        GROUP BY b.svg_id ";

  let sortByFileName = "ORDER BY file_name";
  let sortBySize = "ORDER BY file_size";
  let sortByDate = "ORDER BY maxTime DESC";

  if(sortType == "sortByName") modifiedFiles = modifiedFiles + sortByFileName;
  else if(sortType == "sortBySize") modifiedFiles = modifiedFiles + sortBySize;
  else if(sortType == "sortByDate") modifiedFiles = modifiedFiles + sortByDate;


  executeQueryForModifiedFileTable(modifiedFiles,  res);
  
});

async function executeQueryForModifiedFileTable(modifiedFiles, res) {
  // get the client
  const mysql = require('mysql2/promise');

  let connection;
  
  try{
      // create the connection
      connection = await mysql.createConnection(dbConnection);

      
      //Populate the table      
      const [files] = await connection.execute(modifiedFiles);


      var myStack = [];

      for (var i in files) {

          // file_name
          let file_name = files[i].file_name;
         
          // num_of_changes
          let num_of_changes = files[i].changeNum;
          
          // recent date          
          let latest_date = files[i].maxTime.toISOString().slice(0, 11).replace('T', ' ') + files[i].maxTime.toString().slice(16, 24);

          // file size
          let file_size = files[i].file_size;
          
          var myJson = {
            file_name: file_name,
            num_of_changes: num_of_changes,
            most_recent_modification_date: latest_date,
            file_size: file_size
          };  

          myStack.push(myJson);         
      
        }   
      res.send(myStack);
  
  }catch(e){
      console.log("Query error: "+e);
  }finally {
      if (connection && connection.end) connection.end();
  }
  
}


app.get('/shapeCounts', function(req, res){
  let shapeType = req.query.shapeType;
  let sortType = req.query.sortType;
  let firstRange = req.query.firstRange;
  let secondRange = req.query.secondRange;
  
  var fileQuery = "";   

  if(shapeType == "rectangles") fileQuery = "SELECT * FROM FILE WHERE n_rect BETWEEN "+firstRange+" AND "+secondRange;
  else if(shapeType == "circles") fileQuery = "SELECT * FROM FILE WHERE n_circ BETWEEN "+firstRange+" AND "+secondRange;
  else if(shapeType == "paths") fileQuery = "SELECT * FROM FILE WHERE n_path BETWEEN "+firstRange+" AND "+secondRange;
  else if(shapeType == "groups") fileQuery = "SELECT * FROM FILE WHERE n_group BETWEEN "+firstRange+" AND "+secondRange;
  
  if(sortType == "sortByName") fileQuery = fileQuery + " ORDER BY file_name";
  else if(sortType == "sortBySize") fileQuery = fileQuery + " ORDER BY file_size";
  else if(sortType == "sortByShapeCount") {
    if(shapeType == "rectangles") fileQuery = fileQuery = fileQuery + " ORDER BY n_rect";
    else if(shapeType == "circles") fileQuery = fileQuery + " ORDER BY n_circ";
    else if(shapeType == "paths") fileQuery = fileQuery + " ORDER BY n_path";
    else if(shapeType == "groups") fileQuery = fileQuery + " ORDER BY n_group";
  }

  async function main() {
    // get the client
    const mysql = require('mysql2/promise');

    let connection;
    
    try{
        // create the connection
        connection = await mysql.createConnection(dbConnection);
        //Populate the table
        const [files] = await connection.execute(fileQuery);

        let stack = [];
        for (var i in files) {
          let file_name = files[i].file_name;
          let file_title = files[i].file_title;
          let file_description = files[i].file_description;
          let n_rect = files[i].n_rect;
          let n_circ = files[i].n_circ;
          let n_path = files[i].n_path;
          let n_group = files[i].n_group;
          let creation_time = files[i].creation_time;
          creation_time = creation_time.toISOString().slice(0, 19).replace('T', ' ');
          let file_size = files[i].file_size;

          let shape_count = 0;
          if(shapeType == "rectangles") shape_count = files[i].n_rect;
          else if(shapeType == "circles") shape_count = files[i].n_circ;
          else if(shapeType == "paths") shape_count = files[i].n_path;
          else if(shapeType == "groups") shape_count = files[i].n_group;
          
          var myJson = {
            file_name: file_name,
            file_title: file_title,
            file_description: file_description,
            n_rect: n_rect,
            n_circ: n_circ,
            n_path: n_path,
            n_group: n_group,
            creation_time: creation_time,
            file_size: file_size,
            shapeCounts: shape_count
          };  
            stack.push(myJson);
          }
      
        res.send(stack);

    }catch(e){
        console.log("Query error: "+e);
    }finally {
        if (connection && connection.end) connection.end();
    }
    
  }
  // providing selected shape is defined
  if((shapeType != "") && (shapeType != "None")) main();

  

});

/* Query 5 */
app.get('/queryDisplayDownloadsFiles', function(req, res) {

  let N_number = req.query.N_number;

  let fileQuery = " SELECT a.file_name, b.d_descr, COUNT(b.svg_id) as count, b.svg_id \
   FROM FILE a INNER JOIN DOWNLOAD b WHERE (a.svg_id = b.svg_id) GROUP BY svg_id ORDER BY count DESC LIMIT " + N_number;   
  
  let file_name, summary, count;

  async function main() {
    // get the client
    const mysql = require('mysql2/promise');

    let connection;
    
    try{
        // create the connection
        connection = await mysql.createConnection(dbConnection);
        //Populate the table
        const [files] = await connection.execute(fileQuery);
        
        let stack = [];
        for (var i in files) {
          file_name = files[i].file_name;
          summary = files[i].d_descr;
          count = files[i].count;

        var myJson = {
          file_name: file_name,
            summary: summary,
            count: count
        };  
         
        stack.push(myJson);
      }
  
    res.send(stack);

    }catch(e){
        console.log("Query error: "+e);
    }finally {
        if (connection && connection.end) connection.end();
    }    
  }
  main();
  
});

app.get('/querySortDownloadsByName', function(req, res) {

  let N_number = req.query.N_number;

  let fileQuery = " SELECT a.file_name, b.d_descr, COUNT(b.svg_id) as count, b.svg_id \
   FROM FILE a INNER JOIN DOWNLOAD b WHERE (a.svg_id = b.svg_id) GROUP BY svg_id ORDER BY count DESC LIMIT " + N_number;
   
  let sortByNameQuery = " SELECT a.file_name, b.d_descr, COUNT(b.svg_id) as count, b.svg_id \
   FROM FILE a INNER JOIN DOWNLOAD b WHERE (a.svg_id = b.svg_id) GROUP BY svg_id ORDER BY file_name";
  
  let file_name = "", summary = "", count = 0, svg_id = "";
  let svg_id_list = "";

  async function main() {
    // get the client
    const mysql = require('mysql2/promise');

    let connection;
    
    try{
        // create the connection
        connection = await mysql.createConnection(dbConnection);
        //Populate the table
        const [files] = await connection.execute(fileQuery);
        const [sortedFiles] = await connection.execute(sortByNameQuery);
        
        let stack = [];
        for (var i in files)
          svg_id_list = svg_id_list + files[i].svg_id + " ";
        
        for (var i in sortedFiles) {

          file_name = sortedFiles[i].file_name;
          summary = sortedFiles[i].d_descr;
          count = sortedFiles[i].count;
          svg_id = sortedFiles[i].svg_id;

        var myJson = {
          file_name: file_name,
            summary: summary,
            count: count
        };  
        if(svg_id_list.includes(svg_id))
        stack.push(myJson);
      }
      //console.log("list: "+ svg_id_list);
    res.send(stack);

    }catch(e){
        console.log("Query error: "+e);
    }finally {
        if (connection && connection.end) connection.end();
    }    
  }
  main();  
});

let dbConf = {
	host     : 'dursley.socs.uoguelph.ca',
	user     : 'aogutala',
	password : '1109732',
	database : 'aogutala'
};
let createTable = "CREATE TABLE IF NOT EXISTS student (\
last_name CHAR(30), first_name CHAR(30), mark CHAR(10))";

let insRec = "INSERT INTO student (last_name, first_name, mark) VALUES ('Hugo','Victor','B+'),('Rudin','Walter','A-'),('Stevens','Richard','C')";

async function main() {
    // get the client
    const mysql = require('mysql2/promise');

    let connection;
    
    try{
        // create the connection
        connection = await mysql.createConnection(dbConf)
        //Populate the table
	      //await connection.execute(createTable);
        //await connection.execute(insRec);

        //Run select query, wait for results
        const [rows1, fields1] = await connection.execute('SELECT * from `student` ORDER BY `last_name`');

        console.log("\nSorted by last name:");
        for (let row of rows1){
            console.log("ID: "+row.id+" Last name: "+row.last_name+" First name: "+row.first_name+" mark: "+row.mark );
        }

        //Run select query, wait for results
        console.log("\nSorted by first name:");
        const [rows2, fields2] = await connection.execute('SELECT * from `student` ORDER BY `first_name`');
        for (let row of rows2){
            console.log("ID: "+row.id+" Last name: "+row.last_name+" First name: "+row.first_name+" mark: "+row.mark );
        }

        await connection.execute("DELETE FROM student");  // to do : comment this out to clear student table
    }catch(e){
        console.log("Query error: "+e);
    }finally {
        if (connection && connection.end) connection.end();
    }
    
  }

//main();


/*

  store all files, clear all files, display db status, and execute queries -> needs button

*/