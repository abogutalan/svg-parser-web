/*
*   Abdullah Ogutalan
*   1109732     A3
*/
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
    
    var isLoggedIn = 0; // to do



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
                    let a = document.createElement('a');
                    let img = document.createElement('img');
                    img.src = "uploads/"+data[k].fileName;
                    a.appendChild(img);                    
                    a.href = "uploads/"+data[k].fileName;
                    a.download = data[k].fileName;

                    //a.click();
                    a.addEventListener("click", function(){
                        trackDownloads(data[k].fileName);
                       
                    });
                    
                    img.height = 100;
                    img.width = 100;
                    cell0.appendChild(a);
                }
                else if(i == 1) {
                    let cell1 = row.insertCell(1);
                    let a = document.createElement('a');
                    let fileN = document.createTextNode(data[k].fileName);
                    a.appendChild(fileN);
                    a.href = data[k].fileName;
                    a.download = data[k].fileName;
                    a.addEventListener("click", function(){
                        trackDownloads(data[k].fileName);
                       
                    });
                    cell1.appendChild(a);
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


    var fileNameToEditAttr = "";

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

            /* drop down for edit title and description */ 
            var editDropDown = document.getElementById("editTitleAndDesc");

            /* drop down for adding shape to svg */ 
            var addShapeDropDown = document.getElementById("addShape");

            /* drop down for scaling Shape */ 
            var scaleShapeDropDown = document.getElementById("scaleShape");


            for (var i in data) {
                let option = document.createElement("option");
                option.value = data[i].fileName;
                option.text = data[i].fileName;
                dropDownContent.add(option);
            }

                /* add to edit drop down to edit title & description later*/
            for (var i in data) {
                let option = document.createElement("option");
                option.value = data[i].fileName;
                option.text = data[i].fileName;
                editDropDown.add(option);
            }

            /* adding to addShape drop down to add component to svg later*/
            for (var i in data) {
                let option = document.createElement("option");
                option.value = data[i].fileName;
                option.text = data[i].fileName;
                addShapeDropDown.add(option);
            }

            /* adding to scaleShape drop down to add component to svg later*/
            for (var i in data) {
                let option = document.createElement("option");
                option.value = data[i].fileName;
                option.text = data[i].fileName;
                scaleShapeDropDown.add(option);
            }


            document.getElementById('mySelect').addEventListener('change', update, true);
            let curVal;
            function update(dropDownList) {
                curVal = dropDownList.currentTarget.value;
                console.log("selected item : "+curVal); 

                /* edit attr drop down must be empty whenever the svg view panel is being populated again */
                clearDropDown("editAttr");
                fileNameToEditAttr = curVal;

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

    /* drop down for edit attributes */ 
    var editAttrDropDown = document.getElementById("editAttr");

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
                showAttrtable.innerHTML = "";
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

            /* populate edit attribute drop down */
            populate_edit_attr_drop_down(firstText);
            
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
                showAttrtable.innerHTML = "";

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

            /* populate edit attribute drop down */
            populate_edit_attr_drop_down(firstText);
            
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

                //alert("Show attributes for paths does not work properly !");

                let showAttrtable=document.getElementById("otherAttrTable");
                showAttrtable.innerHTML = "";

                //console.log("this content: "  + this.textContent);
                // console.log("Can not show the attributes of "  + firstText.data);

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

            /* populate edit attribute drop down */
            populate_edit_attr_drop_down(firstText);
            
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
                showAttrtable.innerHTML = "";

                //console.log("this content: "  + this.textContent);
                console.log("Showing the attributes of "  + firstText.data);

                /* getting the ordinal number */
                let componentTextContent = firstText.data;
                let len = componentTextContent.length - +1;
                let orderNum = parseInt(componentTextContent.charAt(len));
                //console.log(orderNum);
                let index = orderNum - +1;

                for ( var j in data.otherAttrOfGroups[index]) {
                    let row = showAttrtable.insertRow(showAttrtable.rows.length);    

                    let cellAttr = row.insertCell(0);                        
                    cellAttr.innerHTML= "Other Attributes of : " + componentTextContent + " { name: " + data.otherAttrOfGroups[index][j].name + ", value: " + data.otherAttrOfGroups[index][j].value + " } ";        

                }
                
            });
            thirdCell.appendChild(thirdElement);

            /* populate edit attribute drop down */
            populate_edit_attr_drop_down(firstText);
            
        }        
    }

    /* to clear any drop down */
    function clearDropDown(dropDown_id) {

        var select = document.getElementById(dropDown_id);
        var length = select.options.length;
        for (i = length-1; i >= 1; i--) {
            select.options[i] = null;
        }
    }

    function populate_edit_attr_drop_down(firstText) {

        let option = document.createElement("option");
        option.value = firstText.data;
        option.text = firstText.data;
        editAttrDropDown.add(option);
    }


    // Event listener form example , we can use this instead explicitly listening for events
    // No redirects if possible
    // $('#someform').submit(function(e){
    //     $('#blah').html("Form has data: "+$('#entryBox').val());
    //     e.preventDefault();
    //     //Pass data to the Ajax call, so it gets passed to the server
    //     $.ajax({
    //         //Create an object for connecting to another waypoint
    //     });
    // });

    
    $("#submitUploadFile").click(function() {
        //listener
       console.log("submiting uploaded file");       
  
    });


    var selected_shape_of_edit_attr = "";
    document.getElementById('editAttr').addEventListener('change', updateAttribute, true);

    function updateAttribute(drpdwn) {
                
        selected_shape_of_edit_attr = drpdwn.currentTarget.value;
        console.log("Selected item : "+selected_shape_of_edit_attr);
        
        let bttn=document.getElementById("editAttrBttn");
        bttn.innerHTML = selected_shape_of_edit_attr;
        
    }

    $('#editAttrVal').submit(function(e){
        $('#editName').html("Edit Attr name: "+$('#nameBox').val());
        $('#editValue').html("Edit Attr value: "+$('#valueBox').val());
        console.log("Edit Attribute button clicked!");
        e.preventDefault();
        //Pass data to the Ajax call, so it gets passed to the server
        $.ajax({
            //Create an object for connecting to another waypoint
            type: 'post',
            dataType: 'json',
            url: '/editAttr',
            data: { 
                attrName: $('#nameBox').val(),
                attrValue: $('#valueBox').val(),
                selectedShape: selected_shape_of_edit_attr,
                filename: fileNameToEditAttr
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error editing attribute!");
                console.log(error);
            }
            
        });
        location.reload(true);

    });


    var globalCurVal = "";
    document.getElementById('editTitleAndDesc').addEventListener('change', update2, true);

    function update2(drpdwn) {
                
        globalCurVal = drpdwn.currentTarget.value;
        console.log("Selected item : "+globalCurVal);
        
        let bttn=document.getElementById("editTitle&DescBttn");
        bttn.innerHTML = globalCurVal;
        
    }

    $('#editTitleDescForm').submit(function(e){      

        console.log("Editing Title and Desc of "+globalCurVal); 
        e.preventDefault();
        $.ajax({

            type: 'post',
            dataType: 'json',
            url: '/editTitleAndDescription',
            data: { 
                title: $('#editTitleBox').val(),
                description: $('#editDescBox').val(),
                fileName: globalCurVal   
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error editing title and description!");
                console.log(error);
            }
            
        });
        location.reload(true);
    });

    $('#newSVGForm').submit(function(e){
        
        console.log("Create SVG button clicked!");
        e.preventDefault();
        //Pass data to the Ajax call, so it gets passed to the server
        $.ajax({
            //Create an object for connecting to another waypoint
            type: 'post',
            dataType: 'json',
            url: '/newSVG',
            data: { 
                title: $('#titleBox').val(),
                description: $('#descBox').val(),
                fileName: $('#filenameBox').val()    
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error creating new SVG image!");
                console.log(error);
            }
        });
        
        location.reload(true); 
        
    });


    var selectedSVGtoAddShape = "";
    document.getElementById('addShape').addEventListener('change', update3, true);

    function update3(drpdwn) {
                
        selectedSVGtoAddShape = drpdwn.currentTarget.value;
        console.log("Selected item : "+selectedSVGtoAddShape);
        
        let shape_bttn=document.getElementById("addShapeBttn");
        shape_bttn.innerHTML = selectedSVGtoAddShape;
        
    }

    $('#shapeFormRect').submit(function(e){      
        console.log("add Rect button clicked!");

        let val_X = $('#rectX').val();
     
        e.preventDefault();
        $.ajax({

            type: 'post',
            dataType: 'json',
            url: '/addRectangle',
            data: { 
                fileName: selectedSVGtoAddShape,
                x: val_X,
                y: $('#rectY').val(),
                height: $('#rect_H').val(),
                width: $('#rect_W').val(),
                units: $('#rect_unit').val()
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error adding component!");
                console.log(error);
            }
            
        });
        location.reload(true);
    });

    $('#shapeFormCircle').submit(function(e){      
        console.log("add Circle button clicked!");

        let val_X = $('#circleX').val();
     
        e.preventDefault();
        $.ajax({

            type: 'post',
            dataType: 'json',
            url: '/addCircle',
            data: { 
                fileName: selectedSVGtoAddShape,
                cx: val_X,
                cy: $('#circleY').val(),
                r: $('#circle_R').val(),
                units: $('#circle_unit').val()
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error adding component!");
                console.log(error);
            }
            
        });
        location.reload(true);
    });

    $('#shapeFormPath').submit(function(e){      
        console.log("add Path button clicked!");
                
        e.preventDefault();
        $.ajax({

            type: 'post',
            dataType: 'json',
            url: '/addPath',
            data: { 
                fileName: selectedSVGtoAddShape,
                d: $('#path_d').val(),
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error adding component!");
                console.log(error);
            }
            
        });
        location.reload(true);
    });


    /* scale shape */

    var selectedSVGtoScaleShape = "";
    document.getElementById('scaleShape').addEventListener('change', scaling, true);

    function scaling(drpdwn) {
                
        selectedSVGtoScaleShape = drpdwn.currentTarget.value;
        console.log("Selected item : "+selectedSVGtoScaleShape);
        
        let shape_bttn=document.getElementById("scaleShapeBttn");
        shape_bttn.innerHTML = selectedSVGtoScaleShape;
        
    }

    $('#scaleRectForm').submit(function(e){      
        console.log("shape Rect button clicked!");
                
        e.preventDefault();
        $.ajax({

            type: 'post',
            dataType: 'json',
            url: '/scaleRectangle',
            data: { 
                fileName: selectedSVGtoScaleShape,
                rectFactor: $('#scaleRect').val(),
                
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error scaling Shape!");
                console.log(error);
            }
            
        });
        // location.reload(true);
    });

    $('#scaleCircleForm').submit(function(e){      
        console.log("shape Circle button clicked!");
                
        e.preventDefault();
        $.ajax({

            type: 'post',
            dataType: 'json',
            url: '/scaleCircle',
            data: { 
                fileName: selectedSVGtoScaleShape,
                circleFactor: $('#scaleCirc').val(),
                
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error scaling Shape!");
                console.log(error);
            }
            
        });
        // location.reload(true);
    });




    // A4 codes
    $('#logInForm').submit(function(e){
        

        console.log("Logged In!");
        e.preventDefault();

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/db_logIn',
            data: { 
                username: $('#usernameBox').val(),
                password: $('#passwordBox').val(),
                dbName: $('#dbNameBox').val()    
            },
            success: function (data) {
                console.log(data.retVal);
                let retVal = data.retVal;
                if(retVal == "FAILS") {
                    alert("Please enter valid datbase credentials!");
                    location.reload(true);
                }
            },
            fail: function(error) {
                console.log("Error  logging in!");
                console.log(error);
            }
        });

    });
    // inserting all files displayed in the File Log Panel into the database
    $('#storeFiles').click(function(e){

        console.log("Storing all Files from uploads directory!");

        e.preventDefault();
        
        passAllSVGfilesToDatabase();       
    });

    function passAllSVGfilesToDatabase() {
        var files = document.getElementById('mySelect');
        console.log("len: "+ files.length);
        if(files.length < 2) alert("No files in File Log!");
   
        for(var i = 1; i < files.length; i++) {
            
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/storeFiles',
                data: { 
                    filename: files[i].value    
                },
                success: function (data) {
                    console.log(data);
                },
                fail: function(error) {
                    console.log("Error storing files!");
                    console.log(error);
                }
            });
        }
    }

    $('#clearFiles').click(function(e){

        console.log("Clearing all data!");
        e.preventDefault();

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/db_clear',
            data: { 
                table: "FILE"   
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error clearing data!");
                console.log(error);
            }
        });
    });

    $('#displayStatus').click(function(e){

        console.log("Displaying all data!");
        e.preventDefault();

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/db_display',
            data: { 
                filesNum: "0",
                changesNum: "0",
                donwloadsNum: "0"   
            },
            success: function (data) {
                console.log(data);
                alert("Database has "+ data.filesNum + " files, "+ data.changesNum + " changes, and " + data.donwloadsNum + " downloads.");
            },
            fail: function(error) {
                console.log("Error clearing data!");
                console.log(error);
            }
        });
    });  

    // inserting a record into the DOWNLOAD table
    function trackDownloads(filename) {

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/trackDownloads',
            data: { 
                filename: filename    
            },
            success: function (data) {
                console.log(data);
            },
            fail: function(error) {
                console.log("Error tracking downloads!");
                console.log(error);
            }
        });

    }

function populateExecuteQueryTable(myURL, string){

    let firstDate="";
    let secondDate="";
    if(string != "") {

        let tmp = string.split("+");        
        firstDate = tmp[0].trim();
        secondDate = tmp[1].trim();
    }
    
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: myURL,
        data: {
            file_name: "",
            file_title: "",
            file_description: "",
            n_rect: "0",
            n_circ: "0",
            n_path: "0",
            n_group: "0",
            creation_time: "0",
            file_size: "0",
            first_date: firstDate,
            second_date: secondDate
        },
        success: function(data) { 

            /* Creating Query Table */
            var table=document.getElementById("queryTable");
            table.innerHTML = "";            
            
            createQueryTable(table);

        for(let k = 0; k < data.length; k++){     
            
            let len = table.rows.length;
            var row = table.insertRow(len);
    
            /* filling Execute Query Table in */
            for (let i = 0; i <= 8; i++) {
                if(i == 0) {
                    let cell0 = row.insertCell(0);
                    cell0.innerHTML=data[k].file_name;
                }
                else if(i == 1) {
                    let cell1 = row.insertCell(1);
                    cell1.innerHTML=data[k].file_title;
                    
                }
                else if(i == 2) {
                    let cell2 = row.insertCell(2);
                    cell2.innerHTML=data[k].file_description;
                }
                else if(i == 3) {
                    let cell3 = row.insertCell(3);
                    cell3.innerHTML=data[k].n_rect;
                }
                else if(i == 4) {
                    let cell4 = row.insertCell(4);
                    cell4.innerHTML=data[k].n_circ;
                }
                else if(i == 5) {
                    let cell5 = row.insertCell(5);
                    cell5.innerHTML=data[k].n_path;
                }
                else if(i == 6) {
                    let cell6 = row.insertCell(6);
                    cell6.innerHTML=data[k].n_group;
                }
                else if(i == 7) {
                    let cell7 = row.insertCell(7);
                    cell7.innerHTML=data[k].creation_time;
                }
                else if(i == 8) {
                    let cell8 = row.insertCell(8);
                    cell8.innerHTML=data[k].file_size;
                }
            }
        }
    
        },
        fail: function (error) {
            console.log("queryDisplayFiles Error!");
            console.log(error);
        }
    });
}

/* EXECUTE QUERY TABLE */
$('#displayFiles').click(function(e){

    console.log("Displaying all files on Query Table!");
    e.preventDefault();
    myURL = '/queryDisplayFiles';
    populateExecuteQueryTable(myURL, "");
    
}); 
/* SORTING QUERY TABLE by NAME */
$('#sortByName').click(function(e){

    console.log("Sorting by Name!");
    e.preventDefault();
    myURL = '/querySortByName';
    populateExecuteQueryTable(myURL, "");
    
}); 
/* SORTING QUERY TABLE by SIZE */
$('#sortBySize').click(function(e){

    console.log("Sorting by Size!");
    e.preventDefault();
    myURL = '/querySortBySize';
    populateExecuteQueryTable(myURL, "");
    
}); 

/* ************ Query 2 ************ */

/* showing time all the time */
var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
$('#currentTime').html("Current Time: " + date);

/* display files between spesific dates */
$('#displayBetweenDates').click(function(e){

    console.log("Displaying between spesific dates!");
    let firstDate = $('#firstDateBox').val();
    let secondDate = $('#secondDateBox').val();
    let dates = firstDate + "+" + secondDate;
    e.preventDefault();
    myURL = '/queryDisplayBetweenDates';
    if(firstDate == "" || secondDate == "") alert("Please enter dates!");
    else if (isDateValid(firstDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(secondDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    } 
    else populateExecuteQueryTable(myURL, dates);    
});
/* display files by name */
$('#displayByName').click(function(e){

    console.log("Displaying by names!");
    let firstDate = $('#firstDateBox').val();
    let secondDate = $('#secondDateBox').val();
    let dates = firstDate + "+" + secondDate;
    e.preventDefault();
    myURL = '/queryDisplayByNames';
    if(firstDate == "" || secondDate == "") alert("Please enter dates!");
    else if (isDateValid(firstDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(secondDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    } 
    else populateExecuteQueryTable(myURL, dates);    
});
/* display files by size */
$('#displayBySize').click(function(e){

    console.log("Displaying by size!");
    let firstDate = $('#firstDateBox').val();
    let secondDate = $('#secondDateBox').val();
    let dates = firstDate + "+" + secondDate;
    e.preventDefault();
    myURL = '/queryDisplayBySize';
    if(firstDate == "" || secondDate == "") alert("Please enter dates!");
    else if (isDateValid(firstDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(secondDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    } 
    else populateExecuteQueryTable(myURL, dates);
    
}); 
/* display files by creation date */
$('#displayByCreationDate').click(function(e){

    console.log("Displaying by date!");
    let firstDate = $('#firstDateBox').val();
    let secondDate = $('#secondDateBox').val();
    let dates = firstDate + "+" + secondDate;
    e.preventDefault();
    myURL = '/queryDisplayByDate';
    if(firstDate == "" || secondDate == "") alert("Please enter dates!");
    else if (isDateValid(firstDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(secondDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    } 
    else populateExecuteQueryTable(myURL, dates);
    
}); 

/* ************ Query 3 ************ */
function populateModifiedFilesTable(myURL, dates, sortType){

    let firstDate="";
    let secondDate="";
    if(dates != "") {

        let tmp = dates.split("+");        
        firstDate = tmp[0].trim();
        secondDate = tmp[1].trim();
    }
    
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: myURL,
        data: {
            file_name: "",            
            num_of_changes: "0",
            most_recent_modification_date: "0",
            file_size: "0",
            first_date: firstDate,
            second_date: secondDate,
            sortType: sortType
        },
        success: function(data) { 

            /* Creating Query Table */
            var table=document.getElementById("queryTable");
            table.innerHTML = "";            
            
            createModifiedFileTable(table);

        for(let k = 0; k < data.length; k++){     
            
            let len = table.rows.length;
            var row = table.insertRow(len);
    
            /* filling Modified File Table in */
            for (let i = 0; i <= 3; i++) {
                if(i == 0) {
                    let cell0 = row.insertCell(0);
                    cell0.innerHTML=data[k].file_name;
                }
                else if(i == 1) {
                    let cell1 = row.insertCell(1);
                    cell1.innerHTML=data[k].num_of_changes;
                    
                }
                else if(i == 2) {
                    let cell2 = row.insertCell(2);
                    cell2.innerHTML=data[k].most_recent_modification_date;
                }
                else if(i == 3) {
                    let cell3 = row.insertCell(3);
                    cell3.innerHTML=data[k].file_size;
                }
            }
        }    
        },
        fail: function (error) {
            console.log("queryDisplayFiles Error!");
            console.log(error);
        }
    });
}

/* display files between spesific dates */
$('#displayBetweenModifiedDates').click(function(e){

    console.log("Displaying between modified dates!");
    let firstDate = $('#modifiedStartDate').val();
    let secondDate = $('#modifiedEndDate').val();
    let dates = firstDate + "+" + secondDate;
    e.preventDefault();
    myURL = '/queryDisplayBetweenModifiedDates';

    if(firstDate == "" || secondDate == "") alert("Please enter dates!");
    else if (isDateValid(firstDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(secondDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    } 
    else populateModifiedFilesTable(myURL, dates);    
});
/* display files by NAME */
$('#displayByModifiedName').click(function(e){

    console.log("Displaying by modified names!");
    let firstDate = $('#modifiedStartDate').val();
    let secondDate = $('#modifiedEndDate').val();
    let dates = firstDate + "+" + secondDate;
    e.preventDefault();
    myURL = '/queryDisplayBetweenModifiedDates';
    if(firstDate == "" || secondDate == "") alert("Please enter dates!");
    else if (isDateValid(firstDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(secondDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    } 
    else populateModifiedFilesTable(myURL, dates, "sortByName");    
});
/* display files by SIZE */
$('#displayByModifiedSize').click(function(e){

    console.log("Displaying by modified size!");
    let firstDate = $('#modifiedStartDate').val();
    let secondDate = $('#modifiedEndDate').val();
    let dates = firstDate + "+" + secondDate;
    e.preventDefault();
    myURL = '/queryDisplayBetweenModifiedDates';
    if(firstDate == "" || secondDate == "") alert("Please enter dates!");
    else if (isDateValid(firstDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(secondDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    } 
    else populateModifiedFilesTable(myURL, dates, "sortBySize");
    
}); 
/* display files by MOST RECENT date */
$('#displayByMostRecentDate').click(function(e){

    console.log("Displaying by most recent date!");
    let firstDate = $('#modifiedStartDate').val();
    let secondDate = $('#modifiedEndDate').val();
    let dates = firstDate + "+" + secondDate;
    e.preventDefault();
    myURL = '/queryDisplayBetweenModifiedDates';
    if(firstDate == "" || secondDate == "") alert("Please enter dates!");
    else if (isDateValid(firstDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(secondDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    } 
    else populateModifiedFilesTable(myURL, dates, "sortByDate");
    
}); 

/* ************ Query 4 ************ */
var selected_item = "";
    document.getElementById('displayShape').addEventListener('change', shapeCounts, true);

    function shapeCounts(drpdwn) {
                
        selected_item = drpdwn.currentTarget.value;
        
        let shape_bttn=document.getElementById("displayShapeCountsBttn");
        shape_bttn.innerHTML = selected_item;
        
    }
$('#shapeCountsForm').submit(function(e){      
    console.log("Displaying files with shape counts in range!");
    if((selected_item == "") || (selected_item == "None")) alert("Please spesify the shape!");
            
    let firstRange = $('#firstRange').val();
    let secondRange = $('#secondRange').val();

    e.preventDefault();
    $.ajax({

        type: 'get',
        dataType: 'json',
        url: '/shapeCounts',
        data: { 
            file_name: "",
            file_title: "",
            file_description: "",
            n_rect: "0",
            n_circ: "0",
            n_path: "0",
            n_group: "0",
            creation_time: "0",
            file_size: "0",
            shapeCounts: "0",
            shapeType: selected_item,
            firstRange: firstRange,
            secondRange: secondRange,
            sortType: ""
        },
        success: function (data) {
            console.log(data);
            /* Creating Query Table */
            var table=document.getElementById("queryTable");
            table.innerHTML = "";            
            
            createShapeCountsTable(table);
            populateShapeCountsTable(data, table);
        },
        fail: function(error) {
            console.log("Error adding component!");
            console.log(error);
        }
        
    });
});

$('#shapeCountSortByName').click(function(e){      
    console.log("Displaying files with shape counts in range!");
    let firstRange = $('#firstRange').val();
    let secondRange = $('#secondRange').val();
    if((selected_item == "") || (selected_item == "None")) alert("Please spesify the shape!");             
    else if( (firstRange == "") || (secondRange == "")) alert("Please enter range number!");
    else {
    e.preventDefault();
    $.ajax({

        type: 'get',
        dataType: 'json',
        url: '/shapeCounts',
        data: { 
            file_name: "",
            file_title: "",
            file_description: "",
            n_rect: "0",
            n_circ: "0",
            n_path: "0",
            n_group: "0",
            creation_time: "0",
            file_size: "0",
            shapeCounts: "0",
            shapeType: selected_item,
            firstRange: firstRange,
            secondRange: secondRange,
            sortType: "sortByName"
        },
        success: function (data) {
            console.log(data);
            /* Creating Query Table */
            var table=document.getElementById("queryTable");
            table.innerHTML = "";            
            
            createShapeCountsTable(table);
            populateShapeCountsTable(data, table);
        },
        fail: function(error) {
            console.log("Error adding component!");
            console.log(error);
        }
        
    });
}
});

$('#shapeCountSortBySize').click(function(e){      
    console.log("Displaying files with shape counts in range!");
    let firstRange = $('#firstRange').val();
    let secondRange = $('#secondRange').val();
    if((selected_item == "") || (selected_item == "None")) alert("Please spesify the shape!");             
    else if( (firstRange == "") || (secondRange == "")) alert("Please enter range number!");
    else {
    e.preventDefault();
    $.ajax({

        type: 'get',
        dataType: 'json',
        url: '/shapeCounts',
        data: { 
            file_name: "",
            file_title: "",
            file_description: "",
            n_rect: "0",
            n_circ: "0",
            n_path: "0",
            n_group: "0",
            creation_time: "0",
            file_size: "0",
            shapeCounts: "0",
            shapeType: selected_item,
            firstRange: firstRange,
            secondRange: secondRange,
            sortType: "sortBySize"
        },
        success: function (data) {
            console.log(data);
            /* Creating Query Table */
            var table=document.getElementById("queryTable");
            table.innerHTML = "";            
            
            createShapeCountsTable(table);
            populateShapeCountsTable(data, table);
        },
        fail: function(error) {
            console.log("Error adding component!");
            console.log(error);
        }
        
    });
}
});

$('#sortByShapeCount').click(function(e){      
    console.log("Displaying files with shape counts in range!");
    let firstRange = $('#firstRange').val();
    let secondRange = $('#secondRange').val();
    if((selected_item == "") || (selected_item == "None")) alert("Please spesify the shape!");             
    else if( (firstRange == "") || (secondRange == "")) alert("Please enter range number!");
    else {
    e.preventDefault();
    $.ajax({

        type: 'get',
        dataType: 'json',
        url: '/shapeCounts',
        data: { 
            file_name: "",
            file_title: "",
            file_description: "",
            n_rect: "0",
            n_circ: "0",
            n_path: "0",
            n_group: "0",
            creation_time: "0",
            file_size: "0",
            shapeCounts: "0",
            shapeType: selected_item,
            firstRange: firstRange,
            secondRange: secondRange,
            sortType: "sortByShapeCount"
        },
        success: function (data) {
            console.log(data);
            /* Creating Query Table */
            var table=document.getElementById("queryTable");
            table.innerHTML = "";            
            
            createShapeCountsTable(table);
            populateShapeCountsTable(data, table);
        },
        fail: function(error) {
            console.log("Error adding component!");
            console.log(error);
        }
        
    });
}
});

function populateShapeCountsTable(data, table) {
    
    for(let k = 0; k < data.length; k++){     
            
        let len = table.rows.length;
        var row = table.insertRow(len);

        /* filling Execute Query Table in */
        for (let i = 0; i <= 9; i++) {
            if(i == 0) {
                let cell0 = row.insertCell(0);
                cell0.innerHTML=data[k].file_name;
            }
            else if(i == 1) {
                let cell1 = row.insertCell(1);
                cell1.innerHTML=data[k].file_title;
                
            }
            else if(i == 2) {
                let cell2 = row.insertCell(2);
                cell2.innerHTML=data[k].file_description;
            }
            else if(i == 3) {
                let cell3 = row.insertCell(3);
                cell3.innerHTML=data[k].n_rect;
            }
            else if(i == 4) {
                let cell4 = row.insertCell(4);
                cell4.innerHTML=data[k].n_circ;
            }
            else if(i == 5) {
                let cell5 = row.insertCell(5);
                cell5.innerHTML=data[k].n_path;
            }
            else if(i == 6) {
                let cell6 = row.insertCell(6);
                cell6.innerHTML=data[k].n_group;
            }
            else if(i == 7) {
                let cell7 = row.insertCell(7);
                cell7.innerHTML=data[k].creation_time;
            }
            else if(i == 8) {
                let cell8 = row.insertCell(8);
                cell8.innerHTML=data[k].file_size;
            }
            else if(i == 9) {
                let cell9 = row.insertCell(9);
                cell9.innerHTML=data[k].shapeCounts;
            }
        }
    }
}

/* ************ Query 5 ************ */

function populateExecuteDownloadsTable(myURL){
    let N_num = $('#n_value').val();

    if ( N_num == "") alert("Please enter N value!");
    else{
    
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: myURL,
        data: {
            file_name: "",
            summary: "",
            count: "0",
            N_number: N_num
        },
        success: function(data) { 

            /* Creating Query Table */
            var table=document.getElementById("queryTable");
            table.innerHTML = "";            
            
            create_N_FrequentlyDownloadedTable(table);

        for(let k = 0; k < data.length; k++){     
            
            let len = table.rows.length;
            var row = table.insertRow(len);
    
            /* filling Execute Query Table in */
            for (let i = 0; i <= 8; i++) {
                if(i == 0) {
                    let cell0 = row.insertCell(0);
                    cell0.innerHTML=data[k].file_name;
                }
                else if(i == 1) {
                    let cell1 = row.insertCell(1);
                    cell1.innerHTML=data[k].summary;
                    
                }
                else if(i == 2) {
                    let cell2 = row.insertCell(2);
                    cell2.innerHTML=data[k].count;
                }
                
            }
        }
    
        },
        fail: function (error) {
            console.log("queryDisplayFiles Error!");
            console.log(error);
        }
    });
}
}

/* EXECUTE Download TABLE */
$('#frequentlyDownloadsForm').submit(function(e){

    console.log("Displaying most frequently downlaod files!");
    e.preventDefault();
    myURL = '/queryDisplayDownloadsFiles';
    populateExecuteDownloadsTable(myURL);
    
}); 
/* SORTING Download TABLE by NAME */
$('#sortDownloadsByName').click(function(e){

    console.log("Sorting by Name!");
    e.preventDefault();
    myURL = '/querySortDownloadsByName';
    populateExecuteDownloadsTable(myURL);
    
}); 
/* SORTING Download TABLE by Count */
$('#sortByCount').click(function(e){

    console.log("Sorting by Count!");
    e.preventDefault();
    myURL = '/queryDisplayDownloadsFiles';
    populateExecuteDownloadsTable(myURL);
    
}); 

/* ************ Query 5 ************ */
/* drop down for file names */
var changesListDropDown = document.getElementById("changesListNames");
var changeTypeDropDown = document.getElementById("changesType");

var selected_file_name = "";
var selected_change_type = "";

changesListDropDown.addEventListener('change', fileNameUpdate, true);
    function fileNameUpdate(drpdwn) {                
        selected_file_name = drpdwn.currentTarget.value;        
        let name_bttn=document.getElementById("changesListNamesBttn");
        name_bttn.innerHTML = selected_file_name;        
    }
changeTypeDropDown.addEventListener('change', changeTypeUpdate, true);
    function changeTypeUpdate(drpdwn) {                
        selected_change_type = drpdwn.currentTarget.value;        
        let change_type_bttn=document.getElementById("changesTypeBttn");
        change_type_bttn.innerHTML = selected_change_type;        
    }



$('#changesForm').submit(function(e){

    console.log("Displaying all changes of a specific type to a specific file between specific dates!");
    e.preventDefault();

    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let command = getRadioButtonValue('command');

    if((selected_file_name == "") || (selected_file_name == "None")) alert("Please select a file name!");
    else if((selected_change_type == "") || (selected_change_type == "None")) alert("Please select a change type!");
    else if (isDateValid(startDate) == 0) {
        alert("Start Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (isDateValid(endDate) == 0) {
        alert("End Date format must be YYYY-MM-DD hh:mm:ss");
    }
    else if (command == "") {
        alert("Please select a command via Radio Button!");
    } 
    else queryDisplayChanges(startDate, endDate, command);
    
    
}); 

function queryDisplayChanges(startDate, endDate, command){
    myURL = '/queryDisplayChanges';
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: myURL,
        data: {
            file_name: selected_file_name,            
            change_type: selected_change_type,
            change_summary: "",
            change_time: "",
            first_date: startDate,
            second_date: endDate,
            command: command
        },
        success: function(data) { 

            // Creating Query Table //
            var table=document.getElementById("queryTable");
            table.innerHTML = "";            
            
            createChangesTable(table);

        for(let k = 0; k < data.length; k++){     
            
            let len = table.rows.length;
            var row = table.insertRow(len);
    
            // filling Modified File Table in //
            for (let i = 0; i <= 3; i++) {
                if(i == 0) {
                    let cell0 = row.insertCell(0);
                    cell0.innerHTML=data[k].file_name;
                }
                else if(i == 1) {
                    let cell1 = row.insertCell(1);
                    cell1.innerHTML=data[k].change_type;
                    
                }
                else if(i == 2) {
                    let cell2 = row.insertCell(2);
                    cell2.innerHTML=data[k].change_summary;
                }
                else if(i == 3) {
                    let cell3 = row.insertCell(3);
                    cell3.innerHTML=data[k].change_time;
                }
            }
        }    
        },
        fail: function (error) {
            console.log("queryDisplayFiles Error!");
            console.log(error);
        }
    });
}

$('#changesListNamesBttn').click(function(e){
    e.preventDefault();
    $.ajax({

        type: 'get',
        dataType: 'json',
        url: '/getFileNames',
        data: { 
            file_name: ""            
        },
        success: function (data) {
            console.log(data);
            
            /* populating changes list drop down for query 6*/
            for (var i in data) {
                let option = document.createElement("option");
                option.value = data[i].file_name;
                option.text = data[i].file_name;
                changesListDropDown.add(option);
            }
            
        },
        fail: function(error) {
            console.log("Error adding component!");
            console.log(error);
        }
        
    });
});

$('#changesTypeBttn').click(function(e){
    e.preventDefault();

    if ( selected_file_name == "") alert("Please select a file name first!");
    else{
    
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/getChangeType',
        data: { 
            change_type: "",
            filename: selected_file_name           
        },
        success: function (data) {
            console.log(data);
            
            /* populating changes list drop down for query 6*/
            for (var i in data) {
                let option = document.createElement("option");
                option.value = data[i].change_type;
                option.text = data[i].change_type;
                changeTypeDropDown.add(option);
            }
            
        },
        fail: function(error) {
            console.log("Error adding component!");
            console.log(error);
        }
        
    });
}
});

    
function createQueryTable(table) {
    let tableHead = table.createTHead();
            
    /* Creating rows of the panel. */
    let firstRow = document.createElement('tr');

    /* Creating section names of the table */
    let file_name = document.createElement('th');            
    let file_title = document.createElement('th');
    let file_description = document.createElement('th');            
    let n_rect = document.createElement('th');
    let n_circ = document.createElement('th');
    let n_path = document.createElement('th');
    let n_group = document.createElement('th');
    let creation_time = document.createElement('th');
    let file_size = document.createElement('th');

    /* Creating text of sections */            
    let firstColumn = document.createTextNode('file_name');
    let secondColumn = document.createTextNode('file_title');            
    let thirdColumn = document.createTextNode('file_description');
    let fifthColumn = document.createTextNode('n_rect');
    let sixthColumn = document.createTextNode('n_circ');
    let seventhColumn = document.createTextNode('n_path');
    let eighthColumn = document.createTextNode('n_group');
    let ninthColumn = document.createTextNode('creation_time');
    let tenthColumn = document.createTextNode('file_size');

    /* setting section names */
    file_name.appendChild(firstColumn);            
    file_title.appendChild(secondColumn);
    file_description.appendChild(thirdColumn);            
    n_rect.appendChild(fifthColumn);
    n_circ.appendChild(sixthColumn);
    n_path.appendChild(seventhColumn);
    n_group.appendChild(eighthColumn);
    creation_time.appendChild(ninthColumn);
    file_size.appendChild(tenthColumn);

    /* Setting sections to rows */
    firstRow.appendChild(file_name);
    firstRow.appendChild(file_title);
    firstRow.appendChild(file_description);
    firstRow.appendChild(n_rect);
    firstRow.appendChild(n_circ);
    firstRow.appendChild(n_path);
    firstRow.appendChild(n_group);
    firstRow.appendChild(creation_time);
    firstRow.appendChild(file_size);

    /* Setting rows to the table head */
    tableHead.appendChild(firstRow);
            
    /* Appending to the panel */
    table.appendChild(tableHead);
}

/* Display all files modified between specific dates */

function createModifiedFileTable(table) {
    let tableHead = table.createTHead();
            
    /* Creating rows of the panel. */
    let firstRow = document.createElement('tr');

    /* Creating section names of the table */
    let file_name = document.createElement('th');            
    let num_of_changes = document.createElement('th');
    let most_recent_modification_date = document.createElement('th');
    let file_size = document.createElement('th');

    /* Creating text of sections */            
    let firstColumn = document.createTextNode('file_name');
    let secondColumn = document.createTextNode('num_of_changes');
    let thirdColumn = document.createTextNode('most_recent_modification_date');
    let fourthColumn = document.createTextNode('file_size');

    /* setting section names */
    file_name.appendChild(firstColumn);            
    num_of_changes.appendChild(secondColumn);
    most_recent_modification_date.appendChild(thirdColumn);
    file_size.appendChild(fourthColumn);

    /* Setting sections to rows */
    firstRow.appendChild(file_name);
    firstRow.appendChild(num_of_changes);
    firstRow.appendChild(most_recent_modification_date);
    firstRow.appendChild(file_size);

    /* Setting rows to the table head */
    tableHead.appendChild(firstRow);
            
    /* Appending to the panel */
    table.appendChild(tableHead);
}

function createShapeCountsTable(table) {
    let tableHead = table.createTHead();
            
    /* Creating rows of the panel. */
    let firstRow = document.createElement('tr');

    /* Creating section names of the table */
    let file_name = document.createElement('th');            
    let file_title = document.createElement('th');
    let file_description = document.createElement('th');            
    let n_rect = document.createElement('th');
    let n_circ = document.createElement('th');
    let n_path = document.createElement('th');
    let n_group = document.createElement('th');
    let creation_time = document.createElement('th');
    let file_size = document.createElement('th');
    let shape_counts = document.createElement('th');

    /* Creating text of sections */            
    let firstColumn = document.createTextNode('file_name');
    let secondColumn = document.createTextNode('file_title');            
    let thirdColumn = document.createTextNode('file_description');
    let fifthColumn = document.createTextNode('n_rect');
    let sixthColumn = document.createTextNode('n_circ');
    let seventhColumn = document.createTextNode('n_path');
    let eighthColumn = document.createTextNode('n_group');
    let ninthColumn = document.createTextNode('creation_time');
    let tenthColumn = document.createTextNode('file_size');
    let eleventhColumn = document.createTextNode('shape_counts');

    /* setting section names */
    file_name.appendChild(firstColumn);            
    file_title.appendChild(secondColumn);
    file_description.appendChild(thirdColumn);            
    n_rect.appendChild(fifthColumn);
    n_circ.appendChild(sixthColumn);
    n_path.appendChild(seventhColumn);
    n_group.appendChild(eighthColumn);
    creation_time.appendChild(ninthColumn);
    file_size.appendChild(tenthColumn);
    shape_counts.appendChild(eleventhColumn);

    /* Setting sections to rows */
    firstRow.appendChild(file_name);
    firstRow.appendChild(file_title);
    firstRow.appendChild(file_description);
    firstRow.appendChild(n_rect);
    firstRow.appendChild(n_circ);
    firstRow.appendChild(n_path);
    firstRow.appendChild(n_group);
    firstRow.appendChild(creation_time);
    firstRow.appendChild(file_size);
    firstRow.appendChild(shape_counts);

    /* Setting rows to the table head */
    tableHead.appendChild(firstRow);
            
    /* Appending to the panel */
    table.appendChild(tableHead);
}

function create_N_FrequentlyDownloadedTable(table) {
    let tableHead = table.createTHead();
            
    /* Creating rows of the panel. */
    let firstRow = document.createElement('tr');

    /* Creating section names of the table */
    let file_name = document.createElement('th');            
    let num_of_changes = document.createElement('th');
    let most_recent_modification_date = document.createElement('th');

    /* Creating text of sections */            
    let firstColumn = document.createTextNode('file_name');
    let secondColumn = document.createTextNode('summary');
    let thirdColumn = document.createTextNode('download_counts');

    /* setting section names */
    file_name.appendChild(firstColumn);            
    num_of_changes.appendChild(secondColumn);
    most_recent_modification_date.appendChild(thirdColumn);

    /* Setting sections to rows */
    firstRow.appendChild(file_name);
    firstRow.appendChild(num_of_changes);
    firstRow.appendChild(most_recent_modification_date);

    /* Setting rows to the table head */
    tableHead.appendChild(firstRow);
            
    /* Appending to the panel */
    table.appendChild(tableHead);
}

function createChangesTable(table) {
    let tableHead = table.createTHead();
            
    /* Creating rows of the panel. */
    let firstRow = document.createElement('tr');

    /* Creating section names of the table */
    let file_name = document.createElement('th');            
    let change_type = document.createElement('th');
    let change_summary = document.createElement('th');
    let change_time = document.createElement('th');
    
    /* Creating text of sections */            
    let firstColumn = document.createTextNode('file_name');
    let secondColumn = document.createTextNode('change_type');
    let thirdColumn = document.createTextNode('change_summary');
    let fourthColumn = document.createTextNode('change_time');

    /* setting section names */
    file_name.appendChild(firstColumn);            
    change_type.appendChild(secondColumn);
    change_summary.appendChild(thirdColumn);
    change_time.appendChild(fourthColumn);

    /* Setting sections to rows */
    firstRow.appendChild(file_name);
    firstRow.appendChild(change_type);
    firstRow.appendChild(change_summary);
    firstRow.appendChild(change_time);

    /* Setting rows to the table head */
    tableHead.appendChild(firstRow);
            
    /* Appending to the panel */
    table.appendChild(tableHead);
}

function isDateValid(date){

    let val = date.trim();
   
    if(val.charAt(4) != '-') return 0;
    else if(val.charAt(7) != '-') return 0;
    else if(val.charAt(10) != ' ') return 0;
    else if(val.charAt(13) != ':') return 0;
    else if(val.charAt(16) != ':') return 0;
    else return 1;
}

function getRadioButtonValue(name){
    var ele = document.getElementsByName(name); 
    let selectedVal = "";         
    for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked) 
            selectedVal = ele[i].value; 
    } 
    return selectedVal;
}

});