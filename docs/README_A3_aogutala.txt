
*********** WORKING SPECIFICATIONS ***********

• File Log Panel (15 marks)
 Correctly updating when a file is uploaded or created
 Displays all the required details in table format, as specified in Module 1
 Includes a downloadable link for every valid file on the server
 Does not display invalid files

• Upload a file (10 marks)
 Contains the file selection window and a button.

• SVG View Panel (15 marks)
 Drop-down list contains all valid files on the server
 Displays all the required details in table format when an item is selected from DropDown

• Show attributes (10 marks)
 This is done for a specific element
 Displays all the required details, as specified in Module 1
 It shows attribute if the user clicks any item in OtherAttribute column

• Edit Attribute (12 marks) - ("Select an SVG to view" drop down must be clicked before)
 This is done for a specific element of an SVG image, or the SVG image itself
 User enters all details using forms
 Validates user input and does not allow a user to create an invalid SVG file
 When a .svg file is updated, the File Log Panel is being updated and reflect the change. The change
is also visible in the image itself, as shown in the File and SVG panels.

• Edit title/description (8 marks) - ("Select an SVG to view" drop down must be clicked before)
 This is done for a specific SVG image
 Validates user input and does not allow a user to create an invalid SVGimage struct due to length of
strong exceeding max title/description length in SVGParser.h.
 When a .svg file is updated, the summary for that image in SVG View Panel is reflecting the change.

• Create SVG (10 marks)
 Creating a new SVG object, pass it to the parser, saving it to the .svg file
 User enters all details using forms
 Validates user input and does not allow a user to create an invalid SVG image
 When a new .svg file is created, the File Log Panel and all the file lists are updated to include it.
 Default values are assigned for convenience

• Add Shape (10 marks) - ("Select an SVG to view" drop down must be clicked before)
 Adds a circle or rectangle to a specific file, as described in Module 1
 Drop-down list contains all valid files on the server
 User enters all details using forms
 Validates user input and do not allow a user to create an invalid shape or image
 The new shape is visible in the image, and the File view panel entry for that file is
updated accordingly.
 If the user requests the details for the updated .svg file, the new route shows up in the SVG View Panel.

• Scale Shapes (10 marks) - ("Select an SVG to view" drop down must be clicked before)
 Scales all circles or rectangles in a specific file, as described in Module 1
 User can select what shape to scale whether it is rectangle or circle
 Drop-down list contains all valid files on the server
 User enters all details using forms
 Validates user input and do not allow a user to create an invalid shape or image
 The changes to the shape is visible in the image, the File view panel entry for that file is
updated accordingly, and the shape appears in the summary in SVG View panel
 If the user requests the details for the updated .svg file, the new route shows up in the SVG View
Panel


*Extra Note:
Error messages are provided either on the client side or on the server side 
