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
            console.log("data size of file log table: "+data.length);      
            
            //$("#tableID").append("<tr>" data "")

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
                    link.download;
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
            rects: "rects",
            circles: "circles",
            paths: "paths",
            groups: "groups"
        },
        success: function (data) {
            console.log("data size of svg view panel: "+data.length);                     


            var dropDownContent = document.getElementById("mySelect");

            for (var i in data) {
                var option = document.createElement("option");
                option.value = data[i].fileName;
                option.text = data[i].fileName;
                dropDownContent.add(option);
            }

            
            document.getElementById('mySelect').addEventListener('change', update, true);
            var curVal;
            function update(dropDownList) {
                
                curVal = dropDownList.currentTarget.value;
                console.log("selected item : "+curVal); 

                for ( var j in data ) {
    
                    if(data[j].fileName == curVal) {
                        console.log("item being populated: ", curVal);
                        populateSvgViewPanel(data[j]);
                    }
                }              

            }

            

	        
        },
        fail: function(error) {
            console.log("ERROR in SVG view panel process!");
            console.log(error);
        }
    });

    function populateSvgViewPanel(data) {
        console.log("to test: "+ data.fileName);
        let imgPath = "./uploads/" + data.fileName;
    
        /* Get the main table. */
        var svgPanel = document.getElementById("svgViewPanel");
        svgPanel.className = 'svgView';
    
        /* Creates a new dynamic table */
        let table = document.createElement('table');
        table.id = 'svgViewerTable';
        table.className = 'svgViewer';
        
        let tableHead = table.createTHead();
        
        /* Creates the rows for the table headers. */
        let tr1 = document.createElement('tr');
        let tr2 = document.createElement('tr');
        let tr3 = document.createElement('tr');
    
        /* Creates the headers for the table */
        let imageTitle = document.createElement('th');
        
        let panelTitle = document.createElement('th');
        let panelDescription = document.createElement('th');
        
        let panelComponent = document.createElement('th');
        let panelSummary = document.createElement('th');
        let panelOtherAttr = document.createElement('th');
    
        /* Creates the text for table heads */
        let imageHead = document.createTextNode('Image View');
        
        let titleHead = document.createTextNode('Title');
        let descriptionHead = document.createTextNode('Description');
    
        let componentHead = document.createTextNode('Component');
        let summaryHead = document.createTextNode('Summary');
        let othrAttrHead = document.createTextNode('Other Attributes');
        
        
        /* Adds the header texts to headers. */
        imageTitle.appendChild(imageHead);
        
        panelTitle.appendChild(titleHead);
        panelDescription.appendChild(descriptionHead);
        
        panelComponent.appendChild(componentHead);
        panelSummary.appendChild(summaryHead);
        panelOtherAttr.appendChild(othrAttrHead);
    
    
        /* Adds the headers to header rows */
        tr1.appendChild(imageTitle);
        
        tr2.appendChild(panelTitle);
        tr2.appendChild(panelDescription);
        
        tr3.appendChild(panelComponent);
        tr3.appendChild(panelSummary);
        tr3.appendChild(panelOtherAttr);
        
        /* Adds the head rows to table head */
        tableHead.appendChild(tr1);
        tableHead.appendChild(tr2);
        tableHead.appendChild(tr3);
        
        /* Adds the table head to the table */
        table.appendChild(tableHead);
        
        /* Hides the default table */
        let defaultTable = document.getElementById("defaultTable")
        defaultTable.style.visibility = "hidden"
        
        /* Replaces the child of the main table with the new dynamic table created. Adds it if none exist. */
        svgPanel.replaceChild(table, svgPanel.childNodes[0]);
        
        /* Populates the table added with the json data provided */     
        console.log("Row lenght is : " + table.rows.length);
    
    
        let row1 = table.insertRow(table.rows.length-2);
        let row2 = table.insertRow(table.rows.length-1);
        
    
        let imgCell = row1.insertCell(0);
        
        let titleCell = row2.insertCell(0);
        let descCell = row2.insertCell(1);
    
        var img = document.createElement('img');
        img.src = imgPath;
        img.height = 200;
        img.width = 200;
        img.className = 'logo';
        imgCell.appendChild(img);
    
    
        /* panel title */
        let titleElement = document.createElement('p');
        let titleText = document.createTextNode(data.title);
        titleElement.appendChild(titleText);
        titleCell.appendChild(titleElement);
    
        /* panel description */
        let descElement = document.createElement('p');
        let descText = document.createTextNode(data.desc);
        descElement.appendChild(descText);
        descCell.appendChild(descElement);

        addRects(table, data);
        // addCircles(table, data);   
        // addPaths(table, data);
        // addGroups(table, data);

       
        
    }

    function addRects(table, data) {

        for ( var i in data.rects) {
            var row = table.insertRow(table.rows.length);

        /* component */
            let firstColumn = row.insertCell(0);
            let firstElement = document.createElement('p');
            let firstText = document.createTextNode("Rectangle " + (i));
            firstElement.appendChild(firstText);
            firstColumn.appendChild(firstElement);
        /* summary */
            let secondCell =  row.insertCell(1);
            let secondElement = document.createElement('p');
            let secondText = document.createTextNode("Upper left corner: x= " + data.rects[i].x + data.rects[i].units+ 
            "  y= " + data.rects[i].y + data.rects[i].units + "   width: " + data.rects[i].w + "  height: " + data.rects[i].h);
            secondElement.appendChild(secondText);
            secondCell.appendChild(secondElement);
        /* other attribute */
            let thirdCell = row.insertCell(2);
            let thirdElement = document.createElement('p');
            let thirdText = document.createTextNode(data.rects[i].numAttr);
            thirdElement.appendChild(thirdText);
            thirdCell.appendChild(thirdElement);

            
        }
    
       
        
    }


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