
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
 Displays all the required details in table format, as specified in Module 1

• Show attributes (10 marks)
 This is done for a specific element
 Displays all the required details, as specified in Module 1
 The text is formatted for human readability

• Edit title/description (8 marks)
 This is done for a specific SVG image
 Validates user input and does not allow a user to create an invalid SVGimage struct due to length of
strong exceeding max title/description length in SVGParser.h.
 When a .svg file is updated, the summary for that image in SVG View Panel is reflecting the change.

• Create SVG (10 marks)
 Creating a new SVG object, pass it to the parser, saving it to the .svg file
 User enters all details using forms
 Validates user input and does not allow a user to create an invalid SVG image
 When a new .svg file is created, the File Log Panel and all the file lists are updated to include it.
