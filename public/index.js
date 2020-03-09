// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {
    // On page-load AJAX Example
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/someendpoint',   //The server endpoint we are connecting to
        data: {
            name1: "Value 1",
            name2: "Value 2"
        },
        success: function (data) {
            /*  Do something with returned object
                Note that what we get is an object, not a string, 
                so we do not need to parse it on the server.
                JavaScript really does handle JSONs seamlessly
            */
            $('#blah').html("On page load, received string '"+data.foo+"' from server");
            //We write the object to the console to show that the request was successful
            console.log(data); 

        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        }
    });

    /* *** File Log Panel *** */
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/uploadedFiles',
        data: {
            fileName: "rects.svg",
            fileSize: "0KB",
            numRect: "0",
            numCirc: "0",
            numPath: "0",
            numGroups: "0"
        },
        success: function(data) { 
            console.log("data size: "+data.length);                     

        for(let k = 0; k < data.length; k++){ 

            var table=document.getElementById("fileLogTable");
            let len = table.rows.length;
            var row = table.insertRow(len);

            /* filling File Log Panel in */
            for (let i = 0; i <= 6; i++) {
                
                if(i == 0) {
                    let cell0 = row.insertCell(0);
                    let img = document.createElement('img');
                    img.src = "./uploads/"+data[k].fileName;
                    img.height = 100;
                    img.width = 100;
                    cell0.appendChild(img);
                }
                else if(i == 1) {
                    let cell1 = row.insertCell(1);
                    let link = document.createElement('a');
                    let linkText = document.createTextNode(data[k].fileName);
                    link.appendChild(linkText);
                    link.href = data[k].fileName;
                    cell1.appendChild(link);
                }
                else if(i == 2) {
                    let cell2 = row.insertCell(2);
                    cell2.innerHTML=data[k].fileSize;
                }
                else if(i == 3) {
                    let cell3 = row.insertCell(3);
                    cell3.innerHTML=data[k].numRect;
                }
                else if(i == 4) {
                    let cell4 = row.insertCell(4);
                    cell4.innerHTML=data[k].numCirc;
                }
                else if(i == 5) {
                    let cell5 = row.insertCell(5);
                    cell5.innerHTML=data[k].numPath;
                }
                else if(i == 6) {
                    let cell6 = row.insertCell(6);
                    cell6.innerHTML=data[k].numGroups;
                }
            }
        }

        },
        fail: function (error) {
            $('#blah').html("File Upload Error!");
            console.log("File Upload Error!");
            console.log(error);
        }
    });

    /* *** SVG View Panel *** */
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/svgView',
        data: {
            fileName: "rects.svg",
            desc: "description",
            title: "title",
            paths: "paths",
            rescts: "rects",
            groups: "groups",
            circles: "circles"
        },
        success: function (data) {

            

        },
        fail: function(error) {
            console.log("ERROR in SVG view panel process!");
            console.log(error);
        }
    });


    // Event listener form example , we can use this instead explicitly listening for events
    // No redirects if possible
    $('#someform').submit(function(e){
        $('#blah').html("Form has data: "+$('#entryBox').val());
        e.preventDefault();
        //Pass data to the Ajax call, so it gets passed to the server
        $.ajax({
            //Create an object for connecting to another waypoint
        });
    });

    
    $("#submitUploadFile").click(function() {
        //listener
       console.log("test");

       
  
      });
});