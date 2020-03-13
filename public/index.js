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
            fileName: "",
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
                    // img.download = "./uploads/"+data[k].fileName;
                    // img.click();
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
                    link.download = data[k].fileName;
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
            fileName: "",
            desc: "description",
            title: "title",
            rects: "rects",
            circles: "circles",
            paths: "paths",
            groups: "groups",
            otherAttrOfRects: "",
            otherAttrOfCircs: "",
            otherAttrOfPaths: "",
            otherAttrOfGroups: ""
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
        let imgPath = "./uploads/" + data.fileName;
    
        /* Getting svg view panel */
        var svgPanel = document.getElementById("svgViewPanel");
        svgPanel.className = 'svgView';
    
        /* Creating svg view panel */
        let table = document.createElement('table');
        table.id = 'svgViewerTable';
        table.className = 'svgViewer';
        
        let tableHead = table.createTHead();
        
        /* Creating rows of the panel. */
        let tr_fileName = document.createElement('tr');
        let tr_firstRow = document.createElement('tr');
        let tr_secondRow = document.createElement('tr');
    
        /* Creating section names of the panel */
        let imageTitle = document.createElement('th');
        
        let panelTitle = document.createElement('th');
        let panelDescription = document.createElement('th');
        
        let panelComponent = document.createElement('th');
        let panelSummary = document.createElement('th');
        let panelOtherAttr = document.createElement('th');
    
        /* Creating text of sections */
        let imageView = document.createElement('a');
        imageView.innerHTML = data.fileName;
        imageView.href = data.fileName;

        let titleSection = document.createTextNode('Title');
        let descriptionHead = document.createTextNode('Description');
    
        let componentSection = document.createTextNode('Component');
        let summarySection = document.createTextNode('Summary');
        let otherAttrSection = document.createTextNode('Other Attributes');
        
        
        /* setting section names */
        imageTitle.appendChild(imageView);
        
        panelTitle.appendChild(titleSection);
        panelDescription.appendChild(descriptionHead);
        
        panelComponent.appendChild(componentSection);
        panelSummary.appendChild(summarySection);
        panelOtherAttr.appendChild(otherAttrSection);
    
    
        /* Setting sections to rows */
        tr_fileName.appendChild(imageTitle);
        
        tr_firstRow.appendChild(panelTitle);
        tr_firstRow.appendChild(panelDescription);
        
        tr_secondRow.appendChild(panelComponent);
        tr_secondRow.appendChild(panelSummary);
        tr_secondRow.appendChild(panelOtherAttr);
        
        /* Setting rows to the table head */
        tableHead.appendChild(tr_fileName);
        tableHead.appendChild(tr_firstRow);
        tableHead.appendChild(tr_secondRow);
        
        /* Appending to the panel */
        table.appendChild(tableHead);
        
        /* Hiding default table */
        let defaultTable = document.getElementById("defaultTable")
        defaultTable.style.visibility = "hidden"
        
        /* Replacing child of panel with a new dynamic panel created. Adding it only if none exist. */
        svgPanel.replaceChild(table, svgPanel.childNodes[0]);
        
        
        /* Populating added svg view panel with the json data provided */       
    
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
        addCircles(table, data);   
        addPaths(table, data);
        addGroups(table, data);

       
        
    }

    function addRects(table, data) { // selected data from drop down list

        for ( var i in data.rects) {
            var row = table.insertRow(table.rows.length);

        /* component */
            let firstColumn = row.insertCell(0);
            let firstElement = document.createElement('p');
            let firstText = document.createTextNode("Rectangle " + (+i + 1));
            firstElement.appendChild(firstText);
            firstElement.id = "componentID";
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
            /* showing the attributes of selected elements in other attributes columns */
            thirdElement.style.backgroundColor = "orange";
            thirdElement.addEventListener("click", function(){
                
                let showAttrtable=document.getElementById("otherAttrTable");
                //console.log("this content: "  + this.textContent);
                console.log("Showing the attributes of "  + firstText.data);

                /* getting the ordinal number */
                let componentTextContent = firstText.data;
                let len = componentTextContent.length - +1;
                let orderNum = parseInt(componentTextContent.charAt(len));
                let index = orderNum - +1;

                for ( var j in data.otherAttrOfRects[index]) {
                    let row = showAttrtable.insertRow(showAttrtable.rows.length);    

                    let cellAttr = row.insertCell(0);                        
                    cellAttr.innerHTML="Other Attributes of : " + componentTextContent + " { name: " + data.otherAttrOfRects[index][j].name + ", value: " + data.otherAttrOfRects[index][j].value + " } ";        

                }
                
            });
            thirdCell.appendChild(thirdElement);
            
        }        
    }

    function addCircles(table, data) {

        for ( var i in data.circles) {
            var row = table.insertRow(table.rows.length);

        /* component */
            let firstColumn = row.insertCell(0);
            let firstElement = document.createElement('p');
            let firstText = document.createTextNode("Circle " + (+i + 1));
            firstElement.appendChild(firstText);
            firstColumn.appendChild(firstElement);
        /* summary */
            let secondCell =  row.insertCell(1);
            let secondElement = document.createElement('p');
            let secondText = document.createTextNode("Centre: x = " + data.circles[i].cx + data.circles[i].units+ 
            ", y = " + data.circles[i].cy + data.circles[i].units + ", radius = " + data.circles[i].r + data.circles[i].units);
            secondElement.appendChild(secondText);
            secondCell.appendChild(secondElement);
        /* other attribute */
            let thirdCell = row.insertCell(2);
            let thirdElement = document.createElement('p');
            let thirdText = document.createTextNode(data.circles[i].numAttr);
            thirdElement.appendChild(thirdText);
            /* showing attributes of circles */
            thirdElement.style.backgroundColor = "orange";
            thirdElement.addEventListener("click", function(){

                let showAttrtable=document.getElementById("otherAttrTable");
                //console.log("this content: "  + this.textContent);
                console.log("Showing the attributes of "  + firstText.data);

                /* getting the ordinal number */
                let componentTextContent = firstText.data;
                let len = componentTextContent.length - +1;
                let orderNum = parseInt(componentTextContent.charAt(len));
                let index = orderNum - +1;

                for ( var j in data.otherAttrOfCircs[index]) {
                    let row = showAttrtable.insertRow(showAttrtable.rows.length);    

                    let cellAttr = row.insertCell(0);                        
                    cellAttr.innerHTML="Other Attributes of : " + componentTextContent + " { name: " + data.otherAttrOfCircs[index][j].name + ", value: " + data.otherAttrOfCircs[index][j].value + " } ";        

                }
                
            });
            thirdCell.appendChild(thirdElement);
            
        }        
    }

    function addPaths(table, data) {

        for ( var i in data.paths) {
            var row = table.insertRow(table.rows.length);

        /* component */
            let firstColumn = row.insertCell(0);
            let firstElement = document.createElement('p');
            let firstText = document.createTextNode("Path " + (+i + 1));
            firstElement.appendChild(firstText);
            firstColumn.appendChild(firstElement);
        /* summary */
            let secondCell =  row.insertCell(1);
            let secondElement = document.createElement('p');
            let secondText = document.createTextNode("path data = " + data.paths[i].d );
            secondElement.appendChild(secondText);
            secondCell.appendChild(secondElement);
        /* other attribute */
            let thirdCell = row.insertCell(2);
            let thirdElement = document.createElement('p');
            let thirdText = document.createTextNode(data.paths[i].numAttr);
            thirdElement.appendChild(thirdText);
            thirdElement.style.backgroundColor = "orange";
            thirdElement.addEventListener("click", function(){

                alert("Show attributes for paths does not work properly !");

                let showAttrtable=document.getElementById("otherAttrTable");
                //console.log("this content: "  + this.textContent);
                console.log("Can not show the attributes of "  + firstText.data);

                /* getting the ordinal number */
                let componentTextContent = firstText.data;
                let len = componentTextContent.length - +1;
                let orderNum = parseInt(componentTextContent.charAt(len));
                let index = orderNum - +1;

                for ( var j in data.otherAttrOfPaths[index]) {
                    let row = showAttrtable.insertRow(showAttrtable.rows.length);    

                    let cellAttr = row.insertCell(0);                        
                    cellAttr.innerHTML= "Other Attributes of : " + componentTextContent + " { name: " + data.otherAttrOfPaths[index][j].name + ", value: " + data.otherAttrOfPaths[index][j].value + " } ";        

                }
                
            });
            thirdCell.appendChild(thirdElement);
            
        }        
    }

    function addGroups(table, data) {

        for ( var i in data.groups) {
            var row = table.insertRow(table.rows.length);

        /* component */
            let firstColumn = row.insertCell(0);
            let firstElement = document.createElement('p');
            let firstText = document.createTextNode("Group " + (+i + 1));
            firstElement.appendChild(firstText);
            firstColumn.appendChild(firstElement);
        /* summary */
            let secondCell =  row.insertCell(1);
            let secondElement = document.createElement('p');
            let secondText = document.createTextNode(data.groups[i].children + " child elements" );
            secondElement.appendChild(secondText);
            secondCell.appendChild(secondElement);
        /* other attribute */
            let thirdCell = row.insertCell(2);
            let thirdElement = document.createElement('p');
            let thirdText = document.createTextNode(data.groups[i].numAttr);
            thirdElement.appendChild(thirdText);
            thirdElement.style.backgroundColor = "orange";
            thirdElement.addEventListener("click", function(){

                let showAttrtable=document.getElementById("otherAttrTable");
                //console.log("this content: "  + this.textContent);
                console.log("Showing the attributes of "  + firstText.data);

                /* getting the ordinal number */
                let componentTextContent = firstText.data;
                let len = componentTextContent.length - +1;
                let orderNum = parseInt(componentTextContent.charAt(len));
                console.log(orderNum);
                let index = orderNum - +1;

                for ( var j in data.otherAttrOfGroups[index]) {
                    let row = showAttrtable.insertRow(showAttrtable.rows.length);    

                    let cellAttr = row.insertCell(0);                        
                    cellAttr.innerHTML= "Other Attributes of : " + componentTextContent + " { name: " + data.otherAttrOfGroups[index][j].name + ", value: " + data.otherAttrOfGroups[index][j].value + " } ";        

                }
                
            });
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
       console.log("submiting uploaded file");       
  
    });

    $('#editAttrVal').submit(function(e){
        $('#editName').html("Edit Attr name: "+$('#nameBox').val());
        $('#editValue').html("Edit Attr value: "+$('#valueBox').val());
        console.log("Edit Attribute element ==> name: " + $('#nameBox').val() + " - value: " + $('#valueBox').val());
        e.preventDefault();
        //Pass data to the Ajax call, so it gets passed to the server
        $.ajax({
            //Create an object for connecting to another waypoint
            
        });
    });

    
    $('#newSVGForm').submit(function(e){
        
        console.log("Newly created SVG ==> filename: " + $('#filenameBox').val() + " - title: " + $('#titleBox').val() + " - description: " + $('#descBox').val());
        e.preventDefault();
        //Pass data to the Ajax call, so it gets passed to the server
        $.ajax({
            //Create an object for connecting to another waypoint
            type: 'post',
            dataType: 'json',
            url: '/edit',
            data: { 
                title: $('#titleBox').val(),
                description: $('#descBox').val(),
                fileName: $('#filenameBox').val()    
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error editing!");
                console.log(error);
            }
        });
    });
});