/*
* CIS 2750 - Software Systems Development and Integration
* Name : Abdullah Ogutalan
* Student Number : 1109732
* Email : aogutala@uoguelph.ca
*/

// Don't forget to delete .git files if you use github. It slows downloading assignments down while automatic testing.

#include "SVGParser.h"          // Everything in my SVGParser.h is included in SVGParser.c thanks to this line

#include <math.h>
#include <ctype.h> // to get rid of implicit declaration warning for isdigit()

// validate xml
#define LIBXML_SCHEMAS_ENABLED
#include <libxml/xmlschemastypes.h>


//A1
void printSVG(List* list, char* shape){
    void* elem;
	
	//Create an iterator - again, the iterator is allocated on the stack
	ListIterator iter = createIterator(list);

	/*
	Traverse the list using an iterator.  
	nextElement() returns NULL ones we reach the end of the list
	*/
    char* str;
	while ((elem = nextElement(&iter)) != NULL){

		str = NULL;

		if(strcmp((char*)shape, "Attribute")==0) {
		Attribute* tmpAttr;
		tmpAttr = (Attribute*)elem;
		str = list->printData(tmpAttr);
		}
		else if(strcmp((char*)shape, "Rectangle")==0) {
		Rectangle* tempRect;
		tempRect = (Rectangle*)elem;
		str = list->printData(tempRect);
		}
		else if(strcmp((char*)shape, "Circle")==0) {
		Circle* tempCircle;
		tempCircle = (Circle*)elem;
		str = list->printData(tempCircle);
		}
		else if(strcmp((char*)shape, "Path")==0) {
		Path* tempPath;
		tempPath = (Path*)elem;
		str = list->printData(tempPath);
		}
		else if(strcmp((char*)shape, "Group")==0) {
		Group* tempGroup;
		tempGroup = (Group*)elem;
		str = list->printData(tempGroup);
		}
		else {
			//printf("!!! Hiç bir printe gitmedi !!!");
		}
		
		printf("%s\n", str);
		
		//Since list.printData dynamically allocates the string, we must free it
        free(str);
		
	}
}

bool isUnitValid(char *units) {
    char possibleUnits[23][6] = {"cm", "", "mm", "in", "mm", "px", "pt", "pc", "em", "ex", "ch", "rem", "vw", "vh", "rad", "grad", "deg","turn","s","ms","min","h"};
    for (int i = 0; i < 21; i++)
    {
        if (strcmp(possibleUnits[i], units) == 0)
        {
            return true;
        }
    }
    return false;
}

char* getUnit(char* value){
            
    char tmpStr[50];
    int i, j = 0, size = 0, number = 0;

	
	size = strlen(value);
	//printf("size: %d\n", size);
    for(i=0;i<size;i++)
    {
		if( isdigit(value[i]) ) {
			number = value[i] - '7';
		}
		if( number == 0 ) { 
            if ( (value[i] != '-') && (value[i] != '.')){
                tmpStr[j] = value[i];
			    j++;
            }
			
		}			
		
		//printf("number %d: %d\n", i, number);
        number = 0;
    }
	tmpStr[j] = '\0';
	//printf("String: %s\n", tmpStr);
	strcpy(value, (char*)tmpStr);
    // to get rid of units error for circles (cx="24.")
    if ( strcmp(value, ".") == 0) strcpy( value, "\0");
    if ( strcmp(value, "-") == 0) strcpy( value, "\0");

    return value;
}

List* populateRectangle(xmlNode* cur_node, List** rectList) {   

    // Iterate through every attribute of the current node
        xmlAttr *attr;
        Rectangle * rectNode = (Rectangle *)malloc(sizeof(Rectangle));
        rectNode->x = 0;
        rectNode->y = 0;
        rectNode->width = 0;
        rectNode->height = 0;
        List * rectOtherAttrList = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);
        for (attr = cur_node->properties; attr != NULL; attr = attr->next)
        {
            xmlNode *value = attr->children;
            char *attrName = (char *)attr->name;
            char *cont = (char *)(value->content);
            //printf("\tattribute name: %s, attribute value = %s\n", attrName, cont);                        
            
            if( strcmp(attrName, "x")==0 ) {
                rectNode->x = atof(cont);
                char * tmp = NULL;          // to get rid of cont value being changed
                tmp = malloc(sizeof(char) * strlen(cont) + 1 );
                strcpy(tmp, cont);
                strcpy(rectNode->units, getUnit((char*)tmp));
                free(tmp);
            }
            else if( strcmp(attrName, "y")==0 ) rectNode->y = atof((char*)cont);
            else if( strcmp(attrName, "width")==0 ) rectNode->width = atof((char*)cont);
            else if( strcmp(attrName, "height")==0 ) rectNode->height = atof((char*)cont);
            else {
                if ( attrName != NULL ){
                Attribute * otherAttrNode_Rectangle = (Attribute *)malloc(sizeof(Attribute));    // creating Attribute struct LIKE Attribute attr = new Attribute(); in java
            
                otherAttrNode_Rectangle->name = malloc(sizeof(char) * (strlen(attrName) + 1));
                otherAttrNode_Rectangle->value = malloc(sizeof(char) * (strlen(cont) + 1));

                strcpy(otherAttrNode_Rectangle->name, attrName);
                strcpy(otherAttrNode_Rectangle->value, cont);
            
                insertBack(rectOtherAttrList, (Attribute*)otherAttrNode_Rectangle);
                }
            }
            
            
        }
        rectNode->otherAttributes = rectOtherAttrList;
        insertBack(*rectList, (void*)rectNode);

return *rectList;
}

List* populateCircle(xmlNode* cur_node, List** circleList) { 

    // Iterate through every attribute of the current node
        xmlAttr *attr;
        Circle * circleNode = (Circle *)malloc(sizeof(Circle)); 
        circleNode->cx = 0;
        circleNode->cy = 0;
        circleNode->r = 0;
        List * circleOtherAttrList = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);  
        for (attr = cur_node->properties; attr != NULL; attr = attr->next)
        {
            xmlNode *value = attr->children;
            char *attrName = (char *)attr->name;
            char *cont = (char *)(value->content);
            //printf("\tattribute name: %s, attribute value = %s\n", attrName, cont);                   
            if( strcmp(attrName, "cx")==0 ) {
                circleNode->cx = atof(cont);
                char * tmp = NULL;          // to get rid of cont value being changed
                tmp = malloc(sizeof(char) * strlen(cont) + 1 );
                strcpy(tmp, cont);
                if ( tmp != NULL ) strcpy(circleNode->units, getUnit((char*)tmp));
                free(tmp);
            }
            else if( strcmp(attrName, "cy")==0 ) circleNode->cy = atof((char*)cont);
            else if( strcmp(attrName, "r")==0 ) circleNode->r = atof((char*)cont);
            else {
                if ( attrName != NULL ){
                Attribute * otherAttrNode_Circle = (Attribute *)malloc(sizeof(Attribute));    // creating Attribute struct LIKE Attribute attr = new Attribute(); in java
            
                otherAttrNode_Circle->name = malloc(sizeof(char) * (strlen(attrName) + 1));
                otherAttrNode_Circle->value = malloc(sizeof(char) * (strlen(cont) + 1));

                strcpy(otherAttrNode_Circle->name, attrName);
                strcpy(otherAttrNode_Circle->value, cont);
            
                insertBack(circleOtherAttrList, (Attribute*)otherAttrNode_Circle);
                }
            }
        
        }
        circleNode->otherAttributes = circleOtherAttrList;
        insertBack(*circleList, (void*)circleNode);  

return *circleList;
}

List* populatePath(xmlNode* cur_node, List** pathList) { 

    xmlAttr *attr;
        Path * pathNode = (Path *)malloc(sizeof(Path)); 
        pathNode->data = "";
        List * pathOtherAttrList = initializeList(&attributeToString, &deleteAttribute, &compareAttributes); 
        for (attr = cur_node->properties; attr != NULL; attr = attr->next)
            {
            xmlNode *value = attr->children;
            char *attrName = (char *)attr->name;
            char *cont = (char *)(value->content);
            //printf("\tattribute name: %s, attribute value = %s\n", attrName, cont);                        
            
            
            if( strcmp(attrName, "d")==0 ) {
                pathNode->data = malloc(sizeof(char) * (strlen(cont) + 1));
                strcpy(pathNode->data, (char*)cont);
            }
            else {
                if ( attrName != NULL ){
                Attribute * otherAttrNode_Path = (Attribute *)malloc(sizeof(Attribute));    // creating Attribute struct LIKE Attribute attr = new Attribute(); in java
            
                otherAttrNode_Path->name = malloc(sizeof(char) * (strlen(attrName) + 1));
                otherAttrNode_Path->value = malloc(sizeof(char) * (strlen(cont) + 1));

                strcpy(otherAttrNode_Path->name, attrName);
                strcpy(otherAttrNode_Path->value, cont);
            
                insertBack(pathOtherAttrList, (Attribute*)otherAttrNode_Path);
                }
            }
            /*
            *   <path d="M200,300 Q400,50 600,300 T1000,300"
            *           stroke="red" stroke-width="5"  />
            * cur_node->name = path     attr->name = d      attr->children->content = M200,300 Q400,50 600,300 T1000,300
            */
            }
            pathNode->otherAttributes = pathOtherAttrList;
            insertBack(*pathList, (void*)pathNode);

return *pathList;
}

List* populateAttribute(xmlNode* cur_node, List** otherAttrListOfSVG) { 

    xmlAttr *attr;

        for (attr = cur_node->properties; attr != NULL; attr = attr->next)
        {
            xmlNode *value = attr->children;
            char *attrName = (char *)attr->name;
            char *cont = (char *)(value->content);
            //printf("\tattribute name: %s, attribute value = %s\n", attrName, cont);                        
            
            Attribute * otherAttrNode = (Attribute *)malloc(sizeof(Attribute));    // creating Attribute struct LIKE Attribute attr = new Attribute(); in java
            
            otherAttrNode->name = malloc(sizeof(char) * (strlen(attrName) + 10));
            otherAttrNode->value = malloc(sizeof(char) * (strlen(cont) + 10));

            strcpy(otherAttrNode->name, attrName);
            strcpy(otherAttrNode->value, cont);
            
            insertBack(*otherAttrListOfSVG, (void*)otherAttrNode);
        }

return *otherAttrListOfSVG;
}

Group * popGroup (xmlNode * a_node) {   // cur_node gönderince cur_node->children alarak loop a girmeli!

    xmlNode *cur_node = a_node;
    

    Group * g = (Group*)malloc(sizeof(Group));
    List * otherAttrListOf_Group = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);
    List * rectList_Group = initializeList(&rectangleToString, &deleteRectangle, &compareRectangles);
    List * circleList_Group = initializeList(&circleToString, &deleteCircle, &compareCircles);
    List * pathList_Group = initializeList(&pathToString, &deletePath, &comparePaths);
    List * groupList_Group = initializeList(&groupToString, &deleteGroup, compareGroups);
    
    otherAttrListOf_Group = populateAttribute(cur_node, &otherAttrListOf_Group);
    g->otherAttributes = otherAttrListOf_Group;


    //xmlAttr *attr;
    // attr = a_node->properties;
    // printf("hadi amk: %s\n", attr->name);

    for ( cur_node = a_node->children; cur_node != NULL; cur_node = cur_node->next) {       

        if (strcmp((char*)cur_node->name, "rect")==0) {
            rectList_Group = populateRectangle(cur_node, &rectList_Group);
        }
        else if (strcmp((char*)cur_node->name, "circle")==0) {
            circleList_Group = populateCircle(cur_node, &circleList_Group);
        }
        else if (strcmp((char*)cur_node->name, "path")==0) {
            pathList_Group = populatePath(cur_node, &pathList_Group);
        }
        else if (strcmp((char*)cur_node->name, "g")==0) {
            Group * inner_group = popGroup(cur_node);
            insertBack(groupList_Group, (void*)inner_group);
        }
        
    }
            

            g->rectangles = rectList_Group;
            g->circles = circleList_Group;
            g->paths = pathList_Group;
            g->groups = groupList_Group;


    return g;
}

/* Public API - main */         
xmlNode* myGetRootElement(char* str, xmlDoc **doc) {
    
    xmlNode *root_element = NULL;

    LIBXML_TEST_VERSION

    *doc = xmlReadFile(str, NULL, 0);

    if (*doc == NULL) {
        //printf("error: could not parse file %s\n", str);
        return NULL;
    }

    root_element = xmlDocGetRootElement(*doc);

    xmlCleanupParser();

    
    return root_element;
}

void populateMySVG(xmlNode *a_node, SVGimage** populatedSVGimage, List** otherAttrListOfSVG, List** rectList, List** circleList, List** pathList, List** groupList){
    
    xmlNode *cur_node = NULL;
    
    for (cur_node = a_node; cur_node != NULL; cur_node = cur_node->next) {

        if (cur_node->type == XML_ELEMENT_NODE) {
            //printf("node type: Element, name: %s\n", (char*)cur_node->name);

            if(strcmp((char*)cur_node->name, "svg")==0) {
                if(cur_node->ns != NULL) {
                    xmlNs *ns = cur_node->ns;
                    strcpy((char *)(*populatedSVGimage)->namespace, (char*) ns->href);
                }

                // Populating Other Attributes List of SVG image
                *otherAttrListOfSVG = populateAttribute(cur_node,otherAttrListOfSVG);     
                
            }
            
        }//if(cur_node->type == XML_ELEMENT_NODE)
        

    if (strcmp((char*)cur_node->name, "title")==0){ 
            //printf("  content: %s\n", cur_node->content);                       /     *The title of SVGimage*/
            if(cur_node->children != NULL) {
                //printf("PARENT OF <<< title >>> THAT IS OUT OF THE GROUP, %s\n", cur_node->parent->name);
                if (cur_node->children->content != NULL) {
                xmlChar *content_title = cur_node->children->content;
                strncpy((char *)(*populatedSVGimage)->title, (char*) content_title, 255);
                (*populatedSVGimage)->title[255] = '\0';
               
                }
            }
            
    }

    else if (strcmp((char*)cur_node->name, "desc")==0){                             /*The description of SVGimage*/
            if(cur_node->children != NULL) {
                //printf("PARENT OF <<< desc >>> THAT IS OUT OF THE GROUP, %s\n", cur_node->parent->name);
                if (cur_node->children->content != NULL) {
                xmlChar *content = cur_node->children->content;
                strncpy((char *)(*populatedSVGimage)->description, (char*) content, 255);
                (*populatedSVGimage)->description[255] = '\0';                
                }
            }
            
    }

    else if(strcmp((char*)cur_node->name, "rect")==0) {                                     /*    RECT    */

        if (strcmp((char*)cur_node->parent->name, "g") != 0 ) {       // out of the group
            //printf("PARENT OF <<< rect >>> THAT IS out OF THE GROUP, %s\n", cur_node->parent->name);
            *rectList = populateRectangle(cur_node,rectList);
        }      
    }
        

    else if(strcmp((char*)cur_node->name, "circle")==0) {                                     /*  CIRCLE  */

       if (strcmp((char*)cur_node->parent->name, "g") != 0 ) {
            //printf("PARENT OF <<< circle >>> THAT IS out OF THE GROUP, %s\n", cur_node->parent->name);
            *circleList = populateCircle(cur_node,circleList);
        } 
    }
         

    else if(strcmp((char*)cur_node->name, "path")==0) {                                      /*   PATH   */
        
        if (strcmp((char*)cur_node->parent->name, "g") != 0 ) {
            //printf("PARENT OF <<< path >>> THAT IS out OF THE GROUP, %s\n", cur_node->parent->name);
            *pathList = populatePath(cur_node,pathList);
        }
    }
        

        /* *********************************** GROUP ****************************************** */
    else if(strcmp((char*)cur_node->name, "g")==0) {
            
            
            if (strcmp((char*)cur_node->parent->name, "g") != 0 ) {
            
            Group * new_group = popGroup(cur_node);
            insertBack(*groupList, new_group);
         
            }
         

    }
        /* *********************************************************************************** */

            //printf("------------------------------------------------\n");


        populateMySVG(cur_node->children, populatedSVGimage, otherAttrListOfSVG, rectList, circleList, pathList, groupList);
    }

}
/** Function to create an SVG object based on the contents of an SVG file.
 *@pre File name cannot be an empty string or NULL.
       File represented by this name must exist and must be readable.
 *@post Either:
        A valid SVGimage has been created and its address was returned
		or 
		An error occurred, and NULL was returned
 *@return the pinter to the new struct or NULL
 *@param fileName - a string containing the name of the SVG file
**/
SVGimage* createSVGimage(char* fileName) {
    SVGimage* mySVGimage = NULL;

    xmlNode * root = NULL;
    xmlDoc * doc = NULL;

    if((root = myGetRootElement(fileName, &doc)) == NULL) {
        if (doc != NULL){
            xmlFreeDoc(doc);
        }
        return NULL;
    }


    mySVGimage = (SVGimage*)malloc(sizeof(SVGimage));

    // Creating Lists of my SVG image
    List * otherAttrListOfSVG = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);
    List * rectList = initializeList(&rectangleToString, &deleteRectangle, &compareRectangles);
    List * circleList = initializeList(&circleToString, &deleteCircle, &compareCircles);
    List * pathList = initializeList(&pathToString, &deletePath, &comparePaths);
    List * groupList = initializeList(&groupToString, &deleteGroup, compareGroups);
 
    (mySVGimage)->otherAttributes = otherAttrListOfSVG;
    (mySVGimage)->rectangles = rectList;           
    (mySVGimage)->circles = circleList;
    (mySVGimage)->paths = pathList;
    (mySVGimage)->groups = groupList;

    (mySVGimage->namespace)[0] = '\0';

    (mySVGimage->description)[0] = '\0';
    (mySVGimage->title)[0] = '\0';

    populateMySVG(root, &mySVGimage, &otherAttrListOfSVG, &rectList, &circleList, &pathList, &groupList);

    xmlFreeDoc(doc);    


    return mySVGimage;    
    
}



/** Function to create a string representation of an SVG object.
 *@pre SVGimgage exists, is not null, and is valid
 *@post SVGimgage has not been modified in any way, and a string representing the SVG contents has been created
 *@return a string contaning a humanly readable representation of an SVG object
 *@param obj - a pointer to an SVG struct
**/
char* SVGimageToString(SVGimage* img){
    char * string_representation = NULL;
    string_representation = (char *)malloc(sizeof(char) * (30 * 256) );
    snprintf(string_representation, sizeof(string_representation) * 30 * 256,"Namespace: %s\nTitle: %s\nDescription: %s\n", img->namespace, img->title, img->description);
    //printf("////////////////-*/-*/-*/*-/-*/-*/-*/-*/-*/-*/*-/-*/-*/-*/-*/-*/*- printttttt\n");

    /* *********************** Print Lists ************************************* */ 
	printf("\n");
    printSVG(img->otherAttributes, "Attribute");
	printf("\n");
	printSVG(img->rectangles, "Rectangle");
	printf("\n");
	printSVG(img->circles, "Circle");
	printf("\n");
	 printSVG(img->paths, "Path");
	printf("\n");
	 printSVG(img->groups, "Group");
	printf("\n");

    //printf("////////////////-*/-*/-*/*-/-*/-*/-*/-*/-*/-*/*-/-*/-*/-*/-*/-*/*- print SVG return\n");

    
    return string_representation;

}

/** Function to delete image content and free all the memory.
 *@pre SVGimgage  exists, is not null, and has not been freed
 *@post SVSVGimgageG  had been freed
 *@return none
 *@param obj - a pointer to an SVG struct
**/
void deleteSVGimage(SVGimage* img) {

    if( img != NULL){
        //printf("DELETE SVG IMAGE E GIRDI!!\n");
        // free List* rectangles, circles, paths, groups, otherAttributes;

        freeList(img->rectangles);   /* getLength(img->rectangles) > 0 */
        freeList(img->circles);
        freeList(img->paths);
        freeList(img->groups);
        freeList(img->otherAttributes);

        //printf("////////////////////////////////////// SEG KONTROL DELETE SVG  \n");

        free(img);
        //printf("////////////////////////////////////// SEG KONTROL DELETE SVG ENDS \n");

    }
}

/* For the four "get..." functions below, make sure you return a list of opinters to the existing structs 
 - do not allocate new structs.  They all share the same format, and only differ in the contents of the lists 
 they return.
 
 *@pre SVGimgage exists, is not null, and has not been freed
 *@post SVGimgage has not been modified in any way
 *@return a newly allocated List of components.  While the List struct itself is new, the components in it are just pointers
  to the ones in the image.

 The list must me empty if the element is not found - do not return NULL

 *@param obj - a pointer to an SVG struct
 */

// MODULE 2

void getterFree(List * list) {
    if (list == NULL) {
        return;
    }

    if (list->head == NULL && list->tail == NULL){
		    free(list);
        return;
	}

    Node * tmp;
    Node * tmp2;

    while (list->head != NULL) {
        tmp = list->head;
        tmp2 = tmp;
        list->head = list->head->next;
        free(tmp2);
    }

    free(list);
}

// Function that returns a list of all rectangles in the image.  
List* getRects(SVGimage* img) {
    List* rectPointers = NULL;
	ListIterator rectIterator;
	rectPointers = initializeList(&rectangleToString, &deleteRectangle, &compareRectangles);
    
    if (img != NULL)
    {
        rectIterator = createIterator(img->rectangles);
        
	    void * rectNext = nextElement(&rectIterator);
	    while (rectNext != NULL)
	    {	
	    	insertBack(rectPointers, rectNext);
	    	rectNext = nextElement(&rectIterator);
	    }

        List * listOfGroups = getGroups(img);

        if (getLength(listOfGroups) < 1 ) {
            getterFree(listOfGroups);
            return rectPointers;
        }
        else{   // groups of circles
            rectIterator = createIterator(listOfGroups);
            Group * rectNext2 = nextElement(&rectIterator);

            while (rectNext2 != NULL)
	        {	
                if (getLength(rectNext2->rectangles) > 0) {
                ListIterator iter2 = createIterator(rectNext2->rectangles);
                void * rectangles_In_Group;
                while ((rectangles_In_Group = nextElement(&iter2)) != NULL) {

                    Rectangle * tmpRectangle = (Rectangle *)rectangles_In_Group;
                    //printf("////////////////////////// ::: %s\n", circleToString(tmpCircle));
                    insertBack(rectPointers, (void *)tmpRectangle);

                }
                }
                rectNext2 = nextElement(&rectIterator);

            }
        }
        getterFree(listOfGroups);

	    return rectPointers;
	}
	else 
        return rectPointers;
}
// Function that returns a list of all circles in the image.  
List* getCircles(SVGimage* img) {
    List* circlePointers = NULL;
	ListIterator circleIterator;
	circlePointers = initializeList(&circleToString, &deleteCircle, &compareCircles);
    
    if (img != NULL)
    {
        circleIterator = createIterator(img->circles);
        
	    void * circleNext = nextElement(&circleIterator);
	    while (circleNext != NULL)
	    {	
	    	insertBack(circlePointers, circleNext);
	    	circleNext = nextElement(&circleIterator);
	    }


        List * listOfGroups = getGroups(img);

        if (getLength(listOfGroups) < 1 ) {
            getterFree(listOfGroups);
            return circlePointers;
        }
        else{   // groups of circles
            circleIterator = createIterator(listOfGroups);
            Group * circleNext2 = nextElement(&circleIterator);

            while (circleNext2 != NULL)
	        {	
                if (getLength(circleNext2->circles) > 0) {
                ListIterator iter2 = createIterator(circleNext2->circles);
                void * circles_In_Group;
                while ((circles_In_Group = nextElement(&iter2)) != NULL) {

                    Circle * tmpCircle = (Circle *)circles_In_Group;
                    //printf("////////////////////////// ::: %s\n", circleToString(tmpCircle));
                    insertBack(circlePointers, (void *)tmpCircle);

                }
                }
                circleNext2 = nextElement(&circleIterator);

            }
        }
        getterFree(listOfGroups);

	    return circlePointers;
	}
	else 
        return circlePointers;
}

void recursiveGetGroups(List * toTraverse, List * allGroups) {
	ListIterator groupIterator;
    
        // circleIterator = createIterator(img->groups); Eski hata burda img->GROUP değil
        groupIterator = createIterator(toTraverse);
        
	    void * groupNext = nextElement(&groupIterator);
	    while (groupNext != NULL)
	    {	
	    	insertBack(allGroups, (Group *)groupNext);

            if (getLength(((Group *)groupNext)->groups)  > 0)  recursiveGetGroups(((Group *)groupNext)->groups, allGroups);
            
            groupNext = nextElement(&groupIterator);
        }    
}

// Function that returns a list of all groups in the image.  
List* getGroups(SVGimage* img) {
    List * allGroups = initializeList(&groupToString, &deleteGroup, &compareGroups);
    if (img == NULL) {
        return allGroups;
    }
    
    recursiveGetGroups(img->groups, allGroups);
    
    return allGroups;
}


// Function that returns a list of all paths in the image.  
List* getPaths(SVGimage* img) {
    List* pathPointers = NULL;
	ListIterator pathIterator;
	pathPointers = initializeList(&pathToString, &deletePath, &comparePaths);
    
    if (img != NULL)
    {
        pathIterator = createIterator(img->paths);
        
	    void * pathNext = nextElement(&pathIterator);
	    while (pathNext != NULL)
	    {	
	    	insertBack(pathPointers, pathNext);
	    	pathNext = nextElement(&pathIterator);
	    }


        List * listOfGroups = getGroups(img);

        if (getLength(listOfGroups) < 1 ) {
            getterFree(listOfGroups);
            return pathPointers;
        }
        else{   // groups of circles
            pathIterator = createIterator(listOfGroups);
            Group * pathNext2 = nextElement(&pathIterator);

            while (pathNext2 != NULL)
	        {	
                if (getLength(pathNext2->paths) > 0) {
                ListIterator iter2 = createIterator(pathNext2->paths);
                void * paths_In_Group;
                while ((paths_In_Group = nextElement(&iter2)) != NULL) {

                    Path * tmpPath = (Path *)paths_In_Group;
                    //printf("////////////////////////// ::: %s\n", circleToString(tmpCircle));
                    insertBack(pathPointers, (void *)tmpPath);

                }
                }
                pathNext2 = nextElement(&pathIterator);

            }
        }
        getterFree(listOfGroups);

	    return pathPointers;
	}
	else 
        return pathPointers;
}


/* For the four "num..." functions below, you need to search the SVG image for components  that match the search 
  criterion.  You may wish to write some sort of a generic searcher fucntion that accepts an image, a predicate function,
  and a dummy search record as arguments.  We will discuss such search functions in class

 NOTE: For consistency, use the ceil() function to round the floats up to the nearest integer once you have computed 
 the number you need.  See A1 Module 2 for details.

 *@pre SVGimgage exists, is not null, and has not been freed.  The search criterion is valid
 *@post SVGimgage has not been modified in any way
 *@return an int indicating how many objects matching the criterion are contained in the image
 *@param obj - a pointer to an SVG struct
 *@param 2nd - the second param depends on the function.  See details below
 */   

// Function that returns the number of all rectangles with the specified area
int numRectsWithArea(SVGimage* img, float area) {
    if ((img == NULL) || (area < 0)) {
        return 0;
    }

    int rectNum;
    rectNum = 0;

    List * rects = getRects(img);

    ListIterator iterator;
    void * tmp;

    iterator = createIterator(rects);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Rectangle * tmpRect = (Rectangle *)tmp;
        if ( ceil( (tmpRect->height) * (tmpRect->width) ) == ceil(area) ) {
            rectNum++;
        }
        tmp = nextElement(&iterator);
    }

    getterFree(rects);

    return rectNum;
}
// Function that returns the number of all circles with the specified area
int numCirclesWithArea(SVGimage* img, float area) {
    int counter = 0;
	//Creating Iterator For Circles List
	List * c  = getCircles(img); // buranın açılıp c nin createIterator içine konmalı
    //printf("/*/-/*-/*-/ %s\n", toString(c));

    ListIterator iterator = createIterator(c);


	Circle * myCircle = nextElement(&iterator);
    
	while (myCircle != NULL)
	{	
		float myArea = (3.14159265) * (myCircle->r) * (myCircle->r);
		//Checking The Condition
		if(ceil(myArea) == ceil(area))  
			counter += 1;	
		myCircle = nextElement(&iterator);
	}	
	return counter;
}
// Function that returns the number of all paths with the specified data - i.e. Path.data field
int numPathsWithdata(SVGimage* img, char* data) {
    if ((img == NULL) || (data == 0)) {
        return 0;
    }

    int counter = 0;

    List * pathList = getPaths(img);

    ListIterator iter;
    void * elem;

    iter = createIterator(pathList);
    elem = nextElement(&iter);
    while (elem != NULL) {
        Path * tmpPath = (Path *)elem;
        if ( strcmp(tmpPath->data, data) == 0 ){
            counter++;
        }
        elem = nextElement(&iter);
    }

    getterFree(pathList);

    return counter;
}
// Function that returns the number of all groups with the specified length - see A1 Module 2 for details
int numGroupsWithLen(SVGimage* img, int len) {
    if ((img == NULL) || (len < 0)) {
        return 0;
    }

    int counter = 0;

    ListIterator iterator;
    void * tmp;

    iterator = createIterator(img->groups);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Group * tmpGroup = (Group *)tmp;
        int rects_amount = getLength(tmpGroup->rectangles);
        int circles_amount = getLength(tmpGroup->circles);
        int paths_amount = getLength(tmpGroup->paths);
        int group_amount = getLength(tmpGroup->groups);              //to do : Grubun grubu için aç
        if ( (rects_amount + circles_amount + paths_amount + group_amount) == len) {
             counter++;
        }
    tmp = nextElement(&iterator);
    }

    return counter;
}

/*  Function that returns the total number of Attribute structs in the SVGimage - i.e. the number of Attributes
    contained in all otherAttributes lists in the structs making up the SVGimage
    *@pre SVGimgage  exists, is not null, and has not been freed.  
    *@post SVGimage has not been modified in any way
    *@return the total length of all attribute structs in the SVGimage
    *@param obj - a pointer to an SVG struct
*/
int numAttr(SVGimage* img) {
    if (img == NULL) {
        return 0;
    }
    int counter = 0;


    counter = counter + getLength(img->otherAttributes);

    ListIterator iterator;
    void * val;

    List * rects = getRects(img);
    iterator = createIterator(rects);
    val = nextElement(&iterator);
    while (val != NULL) {
        Rectangle * tmpRect = (Rectangle *)val;
        counter = counter + getLength(tmpRect->otherAttributes);
        val = nextElement(&iterator);
    }
    getterFree(rects);

    List * circles = getCircles(img);
    iterator = createIterator(circles);
    val = nextElement(&iterator);
    while (val != NULL) {
        Circle * tmpCircle = (Circle *)val;
        counter = counter + getLength(tmpCircle->otherAttributes);
        val = nextElement(&iterator);
    }
    getterFree(circles);

    List * paths = getPaths(img);
    iterator = createIterator(paths);
    val = nextElement(&iterator);
    while (val != NULL) {
        Path * tmpPath = (Path *)val;
        counter = counter + getLength(tmpPath->otherAttributes);
        val = nextElement(&iterator);
    }
    getterFree(paths);


    List * groups = getGroups(img);
    iterator = createIterator(groups);
    val = nextElement(&iterator);
    while (val != NULL) {
        Group * tmpGroup = (Group *)val;
        counter = counter + getLength(tmpGroup->otherAttributes);
        val = nextElement(&iterator);
    }
    getterFree(groups);


    return counter;
}

//sizeof = ne kadar memory allocate ettiysen byte sayısını verir
//strlen(char sayısını verir ex: strlen("dört") = 4 )
//atoi("5") -> string i integera çeviriyor
//atof("4.0")    -> string i floata çeviriyor

/* ******************************* List helper functions  - MUST be implemented *************************** MODULE 1 */

void deleteAttribute( void* data) {

    Attribute* myAtt;

    if (data == NULL) {
        return;
    }

    myAtt = (Attribute*)data;


    if ( myAtt->name != NULL ) free(myAtt->name);
    if ( myAtt->value != NULL ) free(myAtt->value);

    
    free(myAtt);
}

char* attributeToString( void* data) {
    
    char* str;
    Attribute* myAtt;
    int len;

    if (data == NULL){
        return NULL;
    }

    myAtt = (Attribute*)data;

    /*
    Length of the string is:
        length of the first and last names+5 spaces+1 character for '\0'
    */

    len = strlen(myAtt->name)+strlen(myAtt->value)+5000;
    str = (char*)malloc(sizeof(char)*len);

    sprintf(str, " Attribute name = %s\n Attribute value = %s\n", myAtt->name, myAtt->value);

    return str;

}
int compareAttributes(const void *first, const void *second) {
    return 0;
}
void deleteRectangle(void* data) {

    Rectangle* myRect;

    if ( data == NULL ){
        return;
    }

    myRect = (Rectangle*)data;

    freeList(myRect->otherAttributes);
    free(myRect);    
}

char* rectangleToString(void* data) {
    
    char* str;
    char* tmp;
    Rectangle* myRect;
    int len;

    if (data == NULL){
        return NULL;
    }

    myRect = (Rectangle*)data;

    /*
    Length of the string is:
        length of the first and last names+5 spaces+1 character for '\0'
    */

    len = sizeof(myRect->x)+sizeof(myRect->y)+sizeof(myRect->width) + sizeof(myRect->height) + strlen(myRect->units) + 1000; // (sizeof(Attribute)* getLength(myRect->otherAttributes)) SEG FAULT VERDI
    str = (char*)malloc(sizeof(char)*len);

    if(myRect->otherAttributes != NULL) tmp = toString(myRect->otherAttributes);
    else tmp = (char*)malloc(sizeof(char)*3000);


    sprintf(str, " Rectangle x = %f\n Rectangle y = %f\n Rectangle width = %f\n Rectangle height %f\n Rectangle units: %s\n <<< OtherAttributes_Rect >>> %s\n", myRect->x, myRect->y, myRect->width, myRect->height, myRect->units, tmp);
    free(tmp);

    return str;
}

int compareRectangles(const void *first, const void *second) {
    return 0;
}

void deleteCircle(void* data) {

    Circle* myCircle;

    if ( data == NULL ){
        return;
    }

    myCircle = (Circle*)data;

    freeList(myCircle->otherAttributes);
    free(myCircle);    
}

char* circleToString(void* data) {

    char* str;
    char* tmp;
    Circle* myCircle;
    int len;

    if (data == NULL){
        return NULL;
    }

    myCircle = (Circle*)data;

    /*
    Length of the string is:
        length of the first and last names+5 spaces+1 character for '\0'
    */

    len = sizeof(myCircle->cx) + sizeof(myCircle->cy) + sizeof(myCircle->r) + strlen(myCircle->units) + 1000; // (sizeof(Attribute)* getLength(myRect->otherAttributes)) SEG FAULT VERDI
    
    str = (char*)malloc(sizeof(char)*len);

    if (myCircle->otherAttributes != NULL) tmp = toString(myCircle->otherAttributes);
    else tmp = (char*)malloc(sizeof(char)*3000);
    
    sprintf(str, " Cirlce cx = %f\n Cirlce cy = %f\n Cirlce r = %f\n Circle units: %s\n <<< OtherAttributes_Circle >>> %s\n", myCircle->cx, myCircle->cy, myCircle->r, myCircle->units, tmp);
    free(tmp);
    return str;
}

int compareCircles(const void *first, const void *second) {
    return 0;
}

void deletePath(void* data) {

    Path* myPath;

    if ( data == NULL ){
        return;
    }

    myPath = (Path*)data;

    // if ( myPath->data != NULL )     free(myPath->data);
    if ( myPath->data != NULL ) free(myPath->data);

    freeList(myPath->otherAttributes);

    free(myPath);    
}
char* pathToString(void* data) {
    
    char* str;
    char* tmp;
    Path* myPath;
    int len;

    if (data == NULL){
        return NULL;
    }

    myPath = (Path*)data;

    /*
    Length of the string is:
        length of the first and last names+5 spaces+1 character for '\0'
    */

    len = strlen(myPath->data)+3000;
    str = (char*)malloc(sizeof(char)*len);

    if(myPath->otherAttributes != NULL) tmp = toString(myPath->otherAttributes);
    else tmp = (char*)malloc(sizeof(char)*3000);

    sprintf(str, "Path data = %s\n <<< OtherAttributes_Path >>> %s\n", (char*)myPath->data, tmp);
    free(tmp);

    return str;
}
int comparePaths(const void *first, const void *second) {
    return 0;
}
void deleteGroup(void* data) {
    Group* myGroup;

    if ( data == NULL ){
        return;
    }

    myGroup = (Group*)data;

    freeList(myGroup->otherAttributes);

    freeList(myGroup->rectangles);
    freeList(myGroup->circles);
    freeList(myGroup->paths);
    freeList(myGroup->groups);

    free(myGroup);    
}
char* groupToString( void* data) {

    char* str;
    Group* myGroup;
    int len;

    if (data == NULL){
        return NULL;
    }

    myGroup = (Group*)data;

    len = 5000;
    str = (char*)malloc(sizeof(char)*len);

    char * data1;
	//Putting Group Data in String Array
	strcpy(str, "{\n");

    if(getLength(myGroup->rectangles) > 0) {

	 strcat(str, "Rectangles [\n");
     data1 = toString(myGroup->rectangles);
     strcat(str, data1);
	 free(data1);
	 strcat(str, " \n]");
    }	
	
	if(getLength(myGroup->circles) > 0) {

     strcat(str, "\nCircles [");
     data1 = toString(myGroup->circles);
     strcat(str, data1);
	 free(data1);
	 strcat(str, " ]");
    } 

    if(getLength(myGroup->paths) > 0) {
     strcat(str, "\nPaths [\n");
	 data1 = toString(myGroup->paths);
     strcat(str, data1);
	 free(data1);
	 strcat(str, " \n]");
    }

    if(getLength(myGroup->groups) > 0) {
     strcat(str, "\nGroups [\n");
	 data1 = toString(myGroup->groups);
     strcat(str, data1);
	 free(data1);
	 strcat(str, " \n]");
    }
	
    if(getLength(myGroup->otherAttributes) > 0) {
     strcat(str, "\nOtherAttributes [\n");
	 data1 = toString(myGroup->otherAttributes);
     strcat(str, data1);
	 free(data1);
	 strcat(str, " \n]    },\n");
    }
	
	

    //strcpy(str,  "+++++++++++burhan");

    return str;
}
int compareGroups(const void *first, const void *second) {
    return 0;
}

/* ******************************* A2 stuff *************************** */

bool isNamesAndValuesValid(List * attributes) {

    if(attributes == NULL) return false;

    ListIterator iterator;
    void * tmp;
    iterator = createIterator(attributes);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Attribute * tmpAttr = (Attribute *)tmp;
        if(tmpAttr->name == NULL) return false;
        if(tmpAttr->value == NULL) return false;

    tmp = nextElement(&iterator);
    }

    return true;
}

void myWriteAttributes(List* attributes, xmlNodePtr root_node) {

    if ( attributes == NULL ) {
        return;
    }

    List * attr = attributes;
    ListIterator iterator;
    void * tmp;

    iterator = createIterator(attr);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Attribute * tmpAttr = (Attribute *)tmp;
        // > writing other attributes of valid SVG
        //if(strcmp("RandomStuff", tmpAttr->name) == 0)           // to do : have to check if name of other atteribute is invalid

        xmlNewProp(root_node, BAD_CAST tmpAttr->name, BAD_CAST tmpAttr->value); 

        tmp = nextElement(&iterator);
    }
}

void myWriteSVGrectangles(List* rectangleList, xmlNodePtr root_node){
    List * rects = rectangleList;
    ListIterator iterator;
    void * tmp;
    char str[50];
    xmlNodePtr node = NULL;

    iterator = createIterator(rects);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Rectangle * tmpRect = (Rectangle *)tmp;
        
        node =
            xmlNewChild(root_node, NULL, BAD_CAST "rect", NULL);

        sprintf(str, "%f", tmpRect->x);                                   // to do : .0f => .2f
        if( (strlen(tmpRect->units) > 0) && (isUnitValid(tmpRect->units) == 1) ) strcat(str, tmpRect->units); 
        xmlNewProp(node, BAD_CAST "x", BAD_CAST str);
        sprintf(str, "%f", tmpRect->y);
        if( (strlen(tmpRect->units) > 0) && (isUnitValid(tmpRect->units) == 1) )  strcat(str, tmpRect->units);
        xmlNewProp(node, BAD_CAST "y", BAD_CAST str);
        sprintf(str, "%f", tmpRect->width);
        if( (strlen(tmpRect->units) > 0) && (isUnitValid(tmpRect->units) == 1) )  strcat(str, tmpRect->units);
        xmlNewProp(node, BAD_CAST "width", BAD_CAST str);
        sprintf(str, "%f", tmpRect->height);
        if( (strlen(tmpRect->units) > 0) && (isUnitValid(tmpRect->units) == 1) )  strcat(str, tmpRect->units);
        xmlNewProp(node, BAD_CAST "height", BAD_CAST str);

        myWriteAttributes(tmpRect->otherAttributes, node);
        
        tmp = nextElement(&iterator);
    }
}

void myWriteSVGcircles(List* circleList, xmlNodePtr root_node){
    List * circles = circleList;
    ListIterator iterator;
    void * tmp;
    char str[50];
    xmlNodePtr node = NULL;

    iterator = createIterator(circles);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Circle * tmpCircle = (Circle *)tmp;

        node =
            xmlNewChild(root_node, NULL, BAD_CAST "circle", NULL);

        sprintf(str, "%f", tmpCircle->cx);                                // to do : .0f => .2f
        if( (strlen(tmpCircle->units) > 0) && (isUnitValid(tmpCircle->units) == 1) )  strcat(str, tmpCircle->units);
        xmlNewProp(node, BAD_CAST "cx", BAD_CAST str);
        sprintf(str, "%f", tmpCircle->cy);
        if( (strlen(tmpCircle->units) > 0) && (isUnitValid(tmpCircle->units) == 1) )  strcat(str, tmpCircle->units);
        xmlNewProp(node, BAD_CAST "cy", BAD_CAST str);
        sprintf(str, "%f", tmpCircle->r);
        if( (strlen(tmpCircle->units) > 0) && (isUnitValid(tmpCircle->units) == 1) )  strcat(str, tmpCircle->units);
        xmlNewProp(node, BAD_CAST "r", BAD_CAST str);

        myWriteAttributes(tmpCircle->otherAttributes, node);
        
        tmp = nextElement(&iterator);
    }
}

void myWriteSVGpaths(List* pathList, xmlNodePtr root_node) {
    List * paths = pathList;
    ListIterator iterator;
    void * tmp;
    xmlNodePtr node = NULL;

    iterator = createIterator(paths);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Path * tmpPath = (Path *)tmp;
        node =
        xmlNewChild(root_node, NULL, BAD_CAST "path", NULL);
        xmlNewProp(node, BAD_CAST "d", BAD_CAST tmpPath->data);

        myWriteAttributes(tmpPath->otherAttributes, node);

        tmp = nextElement(&iterator);
    }
}

void myWriteSVGgroups(List* groups, xmlNodePtr root_node){
    List * grps = groups;
    ListIterator iterator;
    void * tmp;
    //xmlNodePtr new_node;
    xmlNodePtr node = NULL;    

    iterator = createIterator(grps);
    while ((tmp = nextElement(&iterator)) != NULL) {
        Group * tmpGrp = (Group *)tmp;
        
        node =
            xmlNewChild(root_node, NULL, BAD_CAST "g", NULL);

        myWriteAttributes(tmpGrp->otherAttributes, node);

        myWriteSVGrectangles(tmpGrp->rectangles, node);
        myWriteSVGcircles(tmpGrp->circles, node);
        myWriteSVGpaths(tmpGrp->paths, node); 
        myWriteSVGgroups(tmpGrp->groups, node);
    }
}

bool isAttributesNull(List * list, char * shape) {

    int flag = 1;

    ListIterator iterator;
    void * tmp;
    iterator = createIterator(list);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        if(strcmp("rects", shape) == 0 ) {
            Rectangle * tmpRect = (Rectangle *)tmp;
            //tmpRect->otherAttributes = NULL;                     // to do : check if other attributes is null 
            if(tmpRect->otherAttributes == NULL) return false;
            // extra attribute name and value cannot be null
            flag = isNamesAndValuesValid(tmpRect->otherAttributes);
            if(flag == 0) return false;  

            if(isUnitValid(tmpRect->units) == 0)  return false;        // to do : test cases fail if comment it out (check same line for circles)

            // In rectangle, width and height can not be negative
            if (tmpRect->width < 0 ) return false;
            if (tmpRect->height < 0 ) return false;
        }
        else if(strcmp("circles", shape) == 0 ) {
            Circle * tmpCircle = (Circle *)tmp;
            if(tmpCircle->otherAttributes == NULL) return false;
            // extra attribute name and value cannot be null
            flag = isNamesAndValuesValid(tmpCircle->otherAttributes);
            if(flag == 0) return false;

            if(isUnitValid(tmpCircle->units) == 0)  return false;

            // In circle, radius can not be negative
            if (tmpCircle->r < 0 ) return false;
        } 
        else if(strcmp("paths", shape) == 0 ) {
            Path * tmpPath = (Path *)tmp;
            if(tmpPath->otherAttributes == NULL) return false;
            // extra attribute name and value cannot be null
            flag = isNamesAndValuesValid(tmpPath->otherAttributes);
            if(flag == 0) return false;

            // data of path can not be null
            if ( tmpPath->data == NULL ) return false;
        } 
        
    tmp = nextElement(&iterator);
    }

    return true;
}

bool isListsOfGroupsNull(List * allGroups) {

    int flag = 1;

    ListIterator iterator;
    void * tmp;
    iterator = createIterator(allGroups);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Group * tmpGrp = (Group *)tmp;
        if(tmpGrp->rectangles == NULL ) return false;
        if(tmpGrp->circles == NULL ) return false;
        if(tmpGrp->paths == NULL ) return false;
        if(tmpGrp->otherAttributes == NULL ) return false;
        if(tmpGrp->groups == NULL ) return false;

        // extra attribute name and value cannot be null
        flag = isNamesAndValuesValid(tmpGrp->otherAttributes);
        if(flag == 0) return false;  

    tmp = nextElement(&iterator);
    }

    return true;
}

bool isSVGimageViolates ( SVGimage * img ) {
    int flag = 1;
    // namespace can't be empty
    if ( img->namespace[0] == '\0' )   return false;
    // In svg image lists can't be null. May be empty
    if ( img->rectangles == NULL )   return false;
    if ( img->circles == NULL )   return false;
    if ( img->paths == NULL )   return false;
    if ( img->groups == NULL )   return false;

    //img->otherAttributes = NULL;                                            // to do
    if ( img->otherAttributes == NULL )   return false;

    // in any extra attribute name and value can not be null
    ListIterator iterator;
    void * tmp;
    iterator = createIterator(img->otherAttributes);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Attribute * tmpAttr = (Attribute *)tmp;
        if(tmpAttr->name == NULL ) return false;
        if(tmpAttr->value == NULL ) return false;

    tmp = nextElement(&iterator);
    }


    // Attribute list of any element can't be null
    List * rectList = getRects(img);
    flag = isAttributesNull(rectList, "rects");
    getterFree(rectList);
    if(flag == 0) return false;

    List * circleList = getCircles(img);
    flag = isAttributesNull(circleList, "circles");
    getterFree(circleList);
    if(flag == 0) return false;

    List * pathList = getPaths(img);
    flag = isAttributesNull(pathList, "paths");
    getterFree(pathList);
    if(flag == 0) return false;

    // In groups no list can be null including groups of group list
    List * allGroups = getGroups(img);
    flag = isListsOfGroupsNull(allGroups);
    getterFree(allGroups);
    if(flag == 0) return false;  

    // In any extra attribute name and value cannot be null
    flag = isNamesAndValuesValid(img->otherAttributes);
    if(flag == 0) return false;  
    // see isAttributesNull() and isListsOfGroupsNull() functions for others


return true;
}

/** Function to validating an existing a SVGimage object against a SVG schema file
 *@pre 
    SVGimage object exists and is not NULL
    schema file name is not NULL/empty, and represents a valid schema file
 *@post SVGimage has not been modified in any way
 *@return the boolean aud indicating whether the SVGimage is valid
 *@param obj - a pointer to a GPXSVGimagedoc struct
 *@param obj - the name iof a schema file
 **/
bool validateSVGimage(SVGimage* image, char* schemaFile) {

    if ( image == NULL ) {
        return false;
    }
    if ( (schemaFile == NULL) || (schemaFile[0] == '\0')) {
        return false;
    }

    xmlDocPtr doc = NULL;       /* document pointer */
    xmlNodePtr root_node = NULL;/* node pointers */

    LIBXML_TEST_VERSION;

    /* 
     * Creates a new document, a node and set it as a root node
     */
    doc = xmlNewDoc(BAD_CAST "1.0");
    root_node = xmlNewNode(NULL, BAD_CAST "svg");
        // creating attributes nodes of svg
        myWriteAttributes(image->otherAttributes, root_node);

    xmlDocSetRootElement(doc, root_node);


    // > creating xmlns(namespace) property
        xmlNs * ns = NULL;
        ns = xmlNewNs(root_node, BAD_CAST image->namespace, NULL);
        xmlSetNs(root_node, ns);

    if ( strlen(image->title) > 0 ) {
        xmlNewChild(root_node, NULL, BAD_CAST "title",
                BAD_CAST image->title);
    }
    if ( strlen(image->description) > 0 ) {
        xmlNewChild(root_node, NULL, BAD_CAST "desc",
                BAD_CAST image->description);
    }

        myWriteSVGrectangles(image->rectangles, root_node);
        myWriteSVGcircles(image->circles, root_node);
        myWriteSVGpaths(image->paths, root_node); 
        myWriteSVGgroups(image->groups, root_node);


    //*************************************************************************************
    xmlSchemaPtr schema = NULL;
    xmlSchemaParserCtxtPtr ctxt;
    char *XSDFileName = schemaFile;

    xmlLineNumbersDefault(1);

    ctxt = xmlSchemaNewParserCtxt(XSDFileName);

    xmlSchemaSetParserErrors(ctxt, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
    schema = xmlSchemaParse(ctxt);
    xmlSchemaFreeParserCtxt(ctxt);
    //xmlSchemaDump(stdout, schema); //To print schema dump


    int ret = 0;

    if (doc == NULL)
    {
        ret = -1;
    }
    else
    {
    xmlSchemaValidCtxtPtr ctxt;     

    ctxt = xmlSchemaNewValidCtxt(schema);
    xmlSchemaSetValidErrors(ctxt, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
    if ( ret != -1 ) ret = xmlSchemaValidateDoc(ctxt, doc);


    xmlSchemaFreeValidCtxt(ctxt);
    //xmlFreeDoc(doc);
    }

    // free the resource
    if(schema != NULL)
    xmlSchemaFree(schema);

    xmlSchemaCleanupTypes();
    // xmlCleanupParser();
    // xmlMemoryDump();

    //*************************************************************************************


    /*free the document */
    xmlFreeDoc(doc);

    /*
     *Free the global variables that may
     *have been allocated by the parser.
     */
    xmlCleanupParser();

    /*
     * this is to debug memory for regression tests
     */
    xmlMemoryDump();

    if ( ret != 0 ) return false; // Unlike this, if ret equals zero it validates


    int flag = isSVGimageViolates(image);
    if (flag == 0) return false;

    return true;
}

/** Function to create an SVG object based on the contents of an SVG file.
 * This function must validate the XML tree generated by libxml against a SVG schema file
 * before attempting to traverse the tree and create an SVGimage struct
 *@pre File name cannot be an empty string or NULL.
       File represented by this name must exist and must be readable.
       Schema file name is not NULL/empty, and represents a valid schema file
 *@post Either:
        A valid SVGimage has been created and its address was returned
		or 
		An error occurred, or SVG file was invalid, and NULL was returned
 *@return the pointer to the new struct or NULL
 *@param fileName - a string containing the name of the SVG file
**/
SVGimage* createValidSVGimage(char* fileName, char* schemaFile) {

    if (fileName == NULL) {
        return NULL;
    }
    if(schemaFile == NULL) {
        return NULL;
    }

    xmlDocPtr doc;
    xmlSchemaPtr schema = NULL;
    xmlSchemaParserCtxtPtr ctxt;
    char *XMLFileName = fileName;
    char *XSDFileName = schemaFile;
    SVGimage * validSVG;

    xmlLineNumbersDefault(1);

    ctxt = xmlSchemaNewParserCtxt(XSDFileName);

    xmlSchemaSetParserErrors(ctxt, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
    schema = xmlSchemaParse(ctxt);
    xmlSchemaFreeParserCtxt(ctxt);
    //xmlSchemaDump(stdout, schema); //To print schema dump

    doc = xmlReadFile(XMLFileName, NULL, 0);

    int ret = 0;

    if (doc == NULL)
    {
    //fprintf(stderr, "Could not parse %s\n", XMLFileName);
        ret = -1;
    }
    else
    {
    xmlSchemaValidCtxtPtr ctxt;

    ctxt = xmlSchemaNewValidCtxt(schema);
    xmlSchemaSetValidErrors(ctxt, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
    if ( ret != -1 ) ret = xmlSchemaValidateDoc(ctxt, doc);
    if (ret == 0)
    {
    //printf("%s validates\n", XMLFileName);
    // creating valid svg
    validSVG = createSVGimage(fileName);

    }
    else if (ret > 0)
    {
    //printf("%s fails to validate\n", XMLFileName);
    }
    else
    {
    //printf("%s validation generated an internal error\n", XMLFileName);
    }
    xmlSchemaFreeValidCtxt(ctxt);
    xmlFreeDoc(doc);
    }

    // free the resource
    if(schema != NULL)
    xmlSchemaFree(schema);

    xmlSchemaCleanupTypes();
    xmlCleanupParser();
    xmlMemoryDump();

    if ( ret == 0 ) {
        if(validSVG != NULL)  return validSVG;
    }

    return NULL;
}

/** Function to writing a SVGimage into a file in SVG format.
 *@pre
    SVGimage object exists, is valid, and and is not NULL.
    fileName is not NULL, has the correct extension
 *@post SVGimage has not been modified in any way, and a file representing the
    SVGimage contents in SVG format has been created
 *@return a boolean value indicating success or failure of the write
 *@param
    doc - a pointer to a SVGimage struct
 	fileName - the name of the output file
 **/

/* creating new svg for web */
void createNewSVGobject(char* fileName, char* newTitle, char* desc) {


    SVGimage * img = (SVGimage*)malloc(sizeof(SVGimage));
    strcpy(img->namespace, "http://www.w3.org/2000/svg");
    strcpy(img->title, newTitle);
    strcpy(img->description, desc);

    List * otherAttrListOfSVG = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);
    List * rectList = initializeList(&rectangleToString, &deleteRectangle, &compareRectangles);
    List * circleList = initializeList(&circleToString, &deleteCircle, &compareCircles);
    List * pathList = initializeList(&pathToString, &deletePath, &comparePaths);
    List * groupList = initializeList(&groupToString, &deleteGroup, compareGroups);
 
    (img)->otherAttributes = otherAttrListOfSVG;
    (img)->rectangles = rectList;           
    (img)->circles = circleList;
    (img)->paths = pathList;
    (img)->groups = groupList;

    int valid = validateSVGimage(img, "parser/validation/svg.xsd");

    if (valid == 1) {
        writeSVGimage(img, fileName);
        printf("Creating new image is successful!\n");
    } 
    else deleteSVGimage(img);
    

}

void setTitleAndDesc(SVGimage * img, char* newTitle, char* newDesc, char* filename) {

    strcpy(img->title, newTitle);
    strcpy(img->description, newDesc);
    int ret = writeSVGimage(img, filename);
    if (ret == 1) printf("SVG title and description edited successfully\n");
    else printf("Something went wrong while editing title and description !\n");

}


bool writeSVGimage(SVGimage* image, char* fileName) {

    if ( image == NULL ) {
        return false;
    }
    if ( fileName == NULL ) {
        return false;
    }

    xmlDocPtr doc = NULL;       /* document pointer */
    xmlNodePtr root_node = NULL;/* node pointers */

    LIBXML_TEST_VERSION;

    /* 
     * Creates a new document, a node and set it as a root node
     */
    doc = xmlNewDoc(BAD_CAST "1.0");
    root_node = xmlNewNode(NULL, BAD_CAST "svg");
        // creating attributes nodes of svg
        myWriteAttributes(image->otherAttributes, root_node);

        // > creating xmlns(namespace) property
        xmlNs * ns = NULL;
        ns = xmlNewNs(root_node, BAD_CAST image->namespace, NULL);
        xmlSetNs(root_node, ns);

    xmlDocSetRootElement(doc, root_node);

    /*
     * Creates a DTD declaration. Isn't mandatory. 
     */
    xmlCreateIntSubset(doc, BAD_CAST "root", NULL, BAD_CAST fileName);

    if ( strlen(image->title) > 0 ) {
        xmlNewChild(root_node, NULL, BAD_CAST "title",
                BAD_CAST image->title);
    }
    if ( strlen(image->description) > 0 ) {
        xmlNewChild(root_node, NULL, BAD_CAST "desc",
                BAD_CAST image->description);
    }

        myWriteSVGrectangles(image->rectangles, root_node);
        myWriteSVGcircles(image->circles, root_node);
        myWriteSVGpaths(image->paths, root_node); 
        myWriteSVGgroups(image->groups, root_node); 

     

    /* 
     * Dumping document to stdio or file
     */
    xmlSaveFormatFileEnc(fileName, doc, "UTF-8", 1);

    /*free the document */
    xmlFreeDoc(doc);

    /*
     *Free the global variables that may
     *have been allocated by the parser.
     */
    xmlCleanupParser();

    /*
     * this is to debug memory for regression tests
     */
    xmlMemoryDump();
    return true;
}

/** Function to setting an attribute in an SVGimage or component
 *@pre
    SVGimage object exists, is valid, and and is not NULL.
    newAttribute is not NULL
 *@post The appropriate attribute was set corectly
 *@return N/A
 *@param
    image - a pointer to an SVGimage struct
    elemType - enum value indicating elemtn to modify
    elemIndex - index of thje lement to modify
    newAttribute - struct containing name and value of the updated attribute
 **/



void updateAttributes(List * otherAttributes, Attribute * newAttribute) {

    int isAttrExist = 0;
    ListIterator iterator;
    void * tmp;
    iterator = createIterator(otherAttributes);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Attribute * tmpAttr = (Attribute *)tmp;

        if(strcmp(tmpAttr->name, newAttribute->name) == 0){
            strcpy(tmpAttr->value, (char*)newAttribute->value);
            isAttrExist = 1;

            // free attribute setting value
            deleteAttribute(newAttribute);
            break;
        }
        
    tmp = nextElement(&iterator);
    }

    // add new Attribute
    if (isAttrExist == 0){
        insertBack(otherAttributes, (void*)newAttribute);
    }
}

void updateRectangleAttributes(List * rectangles, Attribute * newAttribute, int elemIndex) {

    if ( rectangles == NULL ) {
        return;
    }

    ListIterator iterator;
    void * tmp;
    iterator = createIterator(rectangles);
    tmp = nextElement(&iterator);
    int i = 0;
    while ((tmp != NULL) && (i < elemIndex)) {

        tmp = nextElement(&iterator);
        i++;
    }
    if (tmp != NULL) {

        Rectangle * rect = (Rectangle*)tmp;
        if (strcmp("x", newAttribute->name) == 0) {
            rect->x = atof((char*)newAttribute->value);
            deleteAttribute(newAttribute);
        }
        else if (strcmp("y", newAttribute->name) == 0) {
            rect->y = atof((char*)newAttribute->value);
            deleteAttribute(newAttribute);
        }
        else if (strcmp("width", newAttribute->name) == 0) {
            rect->width = atof((char*)newAttribute->value);
            deleteAttribute(newAttribute);
        }
        else if (strcmp("height", newAttribute->name) == 0) {
            rect->height = atof((char*)newAttribute->value);
            deleteAttribute(newAttribute);
        }
        else{
            updateAttributes(rect->otherAttributes, newAttribute);
        }
    }
}

void updateCircleAttributes(List * circles, Attribute * newAttribute, int elemIndex) {

    if ( circles == NULL ) {
        return;
    }

    ListIterator iterator;
    void * tmp;
    iterator = createIterator(circles);
    tmp = nextElement(&iterator);
    int i = 0;
    while ((tmp != NULL) && (i < elemIndex)) {

        tmp = nextElement(&iterator);
        i++;
    }
    if (tmp != NULL) {

        Circle * circle = (Circle*)tmp;
        if (strcmp("cx", newAttribute->name) == 0) {
            circle->cx = atof((char*)newAttribute->value);
            deleteAttribute(newAttribute);
        }
        else if (strcmp("cy", newAttribute->name) == 0) {
            circle->cy = atof((char*)newAttribute->value);
            deleteAttribute(newAttribute);
        }
        else if (strcmp("r", newAttribute->name) == 0) {
            circle->r = atof((char*)newAttribute->value);
            deleteAttribute(newAttribute);
        }
        else{
            updateAttributes(circle->otherAttributes, newAttribute);
        }
    }
}

void updatePathAttributes(List * paths, Attribute * newAttribute, int elemIndex) {

    if ( paths == NULL ) {
        return;
    }

    ListIterator iterator;
    void * tmp;
    iterator = createIterator(paths);
    tmp = nextElement(&iterator);
    int i = 0;
    while ((tmp != NULL) && (i < elemIndex)) {

        tmp = nextElement(&iterator);
        i++;
    }
    if (tmp != NULL) {

        Path * path = (Path*)tmp;
        if(strcmp("d", newAttribute->name) == 0) {
            strcpy(path->data, (char*)newAttribute->value);
            deleteAttribute(newAttribute);
        }
        else{
            updateAttributes(path->otherAttributes, newAttribute);
        }
    }
}

void updateGroupAttributes(List * groups, Attribute * newAttribute, int elemIndex) {

    if ( groups == NULL ) {
        return;
    }

    ListIterator iterator;
    void * tmp;
    iterator = createIterator(groups);
    tmp = nextElement(&iterator);
    int i = 0;
    while ((tmp != NULL) && (i < elemIndex)) {

        tmp = nextElement(&iterator);
        i++;
    }
    if (tmp != NULL) {
        Group * grp = (Group*)tmp;
        updateAttributes(grp->otherAttributes, newAttribute);        
    }
    else deleteAttribute(newAttribute);
}

void setAttribute(SVGimage* image, elementType elemType, int elemIndex, Attribute* newAttribute) {

    if ( image == NULL ) {
        deleteAttribute(newAttribute);
        return;
    }
    if ( newAttribute == NULL ) {
        return;
    }

    if ( elemType == SVG_IMAGE) {

        updateAttributes(image->otherAttributes, newAttribute);
    }
    else if ( elemType == CIRC) {
       updateCircleAttributes(image->circles, newAttribute, elemIndex);
    }
    else if ( elemType == RECT) {
        updateRectangleAttributes(image->rectangles, newAttribute, elemIndex);

    }
    else if ( elemType == PATH) {
        updatePathAttributes(image->paths, newAttribute, elemIndex);
    }
    else if ( elemType == GROUP) {
        updateGroupAttributes(image->groups, newAttribute, elemIndex);
    }
}

/** Function to adding an element - Circle, Rectngle, or Path - to an SVGimage
 *@pre
    SVGimage object exists, is valid, and and is not NULL.
    newElement is not NULL
 *@post The appropriate element was added correctly
 *@return N/A
 *@param
    image - a pointer to an SVGimage struct
    elemType - enum value indicating elemtn to modify
    newElement - pointer to the element sgtruct (Circle, Rectngle, or Path)
 **/
void addComponent(SVGimage* image, elementType type, void* newElement) {

    if ( image != NULL ) {
        if ( newElement != NULL ) {
            if ( type == RECT ) {
                insertBack(image->rectangles, (void*)newElement);
            }
            else if ( type == CIRC ) {
                insertBack(image->circles, (void*)newElement);
            }
            else if ( type == PATH ) {
                insertBack(image->paths, (void*)newElement);
            }
        }
    }
    
}

/** Function to converting an Attribute into a JSON string
*@pre Attribute is not NULL
*@post Attribute has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to an Attribute struct
**/
char* attrToJSON(const Attribute *a) {

    char * attrJSON = NULL;

    if ( a == NULL ) {
        attrJSON = (char*)malloc(sizeof(char)*3);
        strcpy(attrJSON, "{}");
    }
    else {
        int len;
        len = strlen(a->name) + strlen(a->value) + 500;
        attrJSON = (char*)malloc(sizeof(char)*len);

        sprintf(attrJSON, "{\"name\":\"%s\",\"value\":\"%s\"}", a->name, a->value);
    }

    return attrJSON;
}

/** Function to converting a Circle into a JSON string
*@pre Circle is not NULL
*@post Circle has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a Circle struct
**/
char* circleToJSON(const Circle *c){

    char * circleJSON = NULL;

    if ( c == NULL ) {
        circleJSON = (char*)malloc(sizeof(char)*3);
        strcpy(circleJSON, "{}");
    }
    else {
        int len;
        len = 5000; 
        circleJSON = (char*)malloc(sizeof(char)*len);


        sprintf(circleJSON, "{\"cx\":%.2f,\"cy\":%.2f,\"r\":%.2f,\"numAttr\":%d,\"units\":\"%s\"}", c->cx, c->cy, c->r, getLength(c->otherAttributes), c->units);
    }

    return circleJSON;
}

/** Function to converting a Rectangle into a JSON string
*@pre Rectangle is not NULL
*@post Rectangle has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a Rectangle struct
**/
char* rectToJSON(const Rectangle *r){

    char * rectJSON = NULL;

    if ( r == NULL ) {
        rectJSON = (char*)malloc(sizeof(char)*3);
        strcpy(rectJSON, "{}");
    }
    else {
        int len;
        len = 5000; 
        rectJSON = (char*)malloc(sizeof(char)*len);

        float x, y, width, height;
        int attr;

        // memset(&units[0], '.', sizeof(char)*50);
        // printf("%ld\n",strlen(units));
        // printf("%s\n",units);

        if ( r->x > 0 ) x = r->x;
        else x = 0;
        if ( r->y > 0 ) y = r->y;
        else y = 0;
        if ( r->width > 0 ) width = r->width;   
        else width = 0;
        if ( r->height > 0 ) height = r->height;
        else height = 0;

        // unit zaten empty olsa da sıkıntı yok
        // if ( strlen(r->units) > 0 ) strcpy(units, r->units);
        // else units[0] = '\0';

        if ( getLength(r->otherAttributes) > 0 ) attr = getLength(r->otherAttributes);
        else attr = 0;



        sprintf(rectJSON, "{\"x\":%.2f,\"y\":%.2f,\"w\":%.2f,\"h\":%.2f,\"numAttr\":%d,\"units\":\"%s\"}", x, y, width, height, attr, r->units);
    }

    return rectJSON;
}

/** Function to converting a Path into a JSON string
*@pre Path is not NULL
*@post Path has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a Path struct
**/
char* pathToJSON(const Path *p){

    char * pathJSON = NULL;

    if ( p == NULL ) {
        pathJSON = (char*)malloc(sizeof(char)*3);
        strcpy(pathJSON, "{}");
    }
    else {
        int attr = 0;

        char string[65];
        pathJSON = (char*)malloc(sizeof(char)* (strlen(p->data) + 50));

        if(p->data != NULL) strncpy(string, p->data, 64);
        string[64] = '\0';


        if ( getLength(p->otherAttributes) > 0 ){
             attr = getLength(p->otherAttributes);
        }
        
        else attr = 0;


        sprintf(pathJSON, "{\"d\":\"%s\",\"numAttr\":%d}", string, attr);
    }
    return pathJSON;
}


/** Function to converting a Group into a JSON string
*@pre Group is not NULL
*@post Group has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a Group struct
**/
char* groupToJSON(const Group *g){

    char * groupJSON = NULL;

    if ( g == NULL ) {
        groupJSON = (char*)malloc(sizeof(char)*3);
        strcpy(groupJSON, "{}");
    }
    else {

        int attr, children, len;
        children = 0;

        len = 5000; 
        groupJSON = (char*)malloc(sizeof(char)*len);

        if(getLength(g->rectangles) > 0 ) children += getLength(g->rectangles);
        if(getLength(g->circles) > 0 ) children += getLength(g->circles);
        if(getLength(g->paths) > 0 ) children += getLength(g->paths);
        if(getLength(g->groups) > 0 ) children += getLength(g->groups);



        if ( getLength(g->otherAttributes) > 0 ) attr = getLength(g->otherAttributes);
        else attr = 0;

        sprintf(groupJSON, "{\"children\":%d,\"numAttr\":%d}", children, attr);
    }
    return groupJSON;
}

/** Function to converting a list of Attribute structs into a JSON string
*@pre Attribute list is not NULL
*@post Attribute list has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a List struct
**/
char* attrListToJSON(const List *list){

    char * attrListJSON = NULL;
    attrListJSON = "";

    if ( list == NULL ) {
        attrListJSON = (char*)malloc(sizeof(char)*3);
        strcpy(attrListJSON, "[]");
    }
    else {

        int len = 5000; 
        attrListJSON = (char*)malloc(sizeof(char)*len);

        ListIterator iterator, tmpItr;
        void * tmp;
        iterator = createIterator((List*)list);
        tmp = nextElement(&iterator);
        strcpy(attrListJSON, "[");
        while (tmp != NULL) {
            Attribute * tmpAttr = (Attribute *)tmp;
            
            // top get rid of return value of attrToJSON() causing memory leaks
            char * tmpStr = attrToJSON(tmpAttr); 

            strcat(attrListJSON, tmpStr);

            free(tmpStr);

            // aralara virgül eklemek için
            tmpItr = iterator;
            if(nextElement(&tmpItr) != NULL) strcat(attrListJSON, ",");            


        tmp = nextElement(&iterator);
        }

        strcat(attrListJSON, "]");
        
    }
    

    return attrListJSON;
}

/** Function to converting a list of Circle structs into a JSON string
*@pre Circle list is not NULL
*@post Circle list has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a List struct
**/
char* circListToJSON(const List *list){

    char * circleListJSON = NULL;
    circleListJSON = "";

    if ( list == NULL ) {
        circleListJSON = (char*)malloc(sizeof(char)*3);
        strcpy(circleListJSON, "[]");
    }
    else {

        int len = 5000; 
        circleListJSON = (char*)malloc(sizeof(char)*len);

        ListIterator iterator, tmpItr;
        void * tmp;
        iterator = createIterator((List*)list);
        tmp = nextElement(&iterator);
        strcpy(circleListJSON, "[");
        while (tmp != NULL) {
            Circle * tmpCircle = (Circle *)tmp;
            
            // top get rid of return value of attrToJSON() causing memory leaks
            char * tmpStr = circleToJSON(tmpCircle); 

            strcat(circleListJSON, tmpStr);

            free(tmpStr);

            // aralara virgül eklemek için
            tmpItr = iterator;
            if(nextElement(&tmpItr) != NULL) strcat(circleListJSON, ",");            


        tmp = nextElement(&iterator);
        }

        strcat(circleListJSON, "]");

    }
    

    return circleListJSON;
}

/** Function to converting a list of Rectangle structs into a JSON string
*@pre Rectangle list is not NULL
*@post Rectangle list has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a List struct
**/
char* rectListToJSON(const List *list){

    char * rectListJSON = NULL;
    rectListJSON = "";

    if ( list == NULL ) {
        rectListJSON = (char*)malloc(sizeof(char)*3);
        strcpy(rectListJSON, "[]");
    }
    else {

        int len = 5000; 
        rectListJSON = (char*)malloc(sizeof(char)*len);

        ListIterator iterator, tmpItr;
        void * tmp;
        iterator = createIterator((List*)list);
        tmp = nextElement(&iterator);
        strcpy(rectListJSON, "[");
        while (tmp != NULL) {
            Rectangle * tmpRect = (Rectangle *)tmp;
            
            // top get rid of return value of attrToJSON() causing memory leaks
            char * tmpStr = rectToJSON(tmpRect); 

            strcat(rectListJSON, tmpStr);

            free(tmpStr);

            // aralara virgül eklemek için
            tmpItr = iterator;
            if(nextElement(&tmpItr) != NULL) strcat(rectListJSON, ",");            


        tmp = nextElement(&iterator);
        }

        strcat(rectListJSON, "]");

    }
    

    return rectListJSON;
}

/** Function to converting a list of Path structs into a JSON string
*@pre Path list is not NULL
*@post Path list has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a List struct
**/
char* pathListToJSON(const List *list){

    char * pathListJSON = NULL;
    pathListJSON = "";

    if ( list == NULL ) {
        pathListJSON = (char*)malloc(sizeof(char)*3);
        strcpy(pathListJSON, "[]");
    }
    else {

        int len = 5000; 
        pathListJSON = (char*)malloc(sizeof(char)*len);

        ListIterator iterator, tmpItr;
        void * tmp;
        iterator = createIterator((List*)list);
        tmp = nextElement(&iterator);
        strcpy(pathListJSON, "[");
        while (tmp != NULL) {
            Path * tmpPath = (Path *)tmp;

            
            // top get rid of return value of attrToJSON() causing memory leaks
            char * tmpStr = pathToJSON(tmpPath); 


            strcat(pathListJSON, tmpStr);

            free(tmpStr);

            // aralara virgül eklemek için
            tmpItr = iterator;
            if(nextElement(&tmpItr) != NULL) strcat(pathListJSON, ",");            


        tmp = nextElement(&iterator);
        }

        strcat(pathListJSON, "]");        
    }
    

    return pathListJSON;
}

/** Function to converting a list of Group structs into a JSON string
*@pre Group list is not NULL
*@post Group list has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to a List struct
**/
char* groupListToJSON(const List *list){

    char * groupListJSON = NULL;
    groupListJSON = "";

    if ( list == NULL ) {
        groupListJSON = (char*)malloc(sizeof(char)*3);
        strcpy(groupListJSON, "[]");
    }
    else {

        int len = 5000; 
        groupListJSON = (char*)malloc(sizeof(char)*len);

        ListIterator iterator, tmpItr;
        void * tmp;
        iterator = createIterator((List*)list);
        tmp = nextElement(&iterator);
        strcpy(groupListJSON, "[");
        while (tmp != NULL) {
            Group * tmpGrp = (Group *)tmp;
            
            // top get rid of return value of attrToJSON() causing memory leaks
            char * tmpStr = groupToJSON(tmpGrp); 

            strcat(groupListJSON, tmpStr);

            free(tmpStr);

            // aralara virgül eklemek için
            tmpItr = iterator;
            if(nextElement(&tmpItr) != NULL) strcat(groupListJSON, ",");            


        tmp = nextElement(&iterator);
        }

        strcat(groupListJSON, "]");        
    }
   
    return groupListJSON;
}

/** Function to converting an SVGimage into a JSON string
*@pre SVGimage is not NULL
*@post SVGimage has not been modified in any way
*@return A string in JSON format
*@param event - a pointer to an SVGimage struct
**/
char* SVGtoJSON(const SVGimage* imge){

    int ret = validateSVGimage((SVGimage*)imge, "parser/validation/svg.xsd");
	if (ret==0) return "invalid SVG!";

    char * svgJSON = NULL;

    if ( imge == NULL ) {
        svgJSON = (char*)malloc(sizeof(char)*3);
        strcpy(svgJSON, "{}");
    }
    else {

        int numR = 0, numC = 0, numP = 0, numG = 0, len;

        len = 5000; 
        svgJSON = (char*)malloc(sizeof(char)*len);

        if ( getLength(getRects((SVGimage*)imge)) > 0 ) numR = getLength(getRects((SVGimage*)imge));
        if ( getLength(getCircles((SVGimage*)imge)) > 0 ) numC = getLength(getCircles((SVGimage*)imge));
        if ( getLength(getPaths((SVGimage*)imge)) > 0 ) numP = getLength(getPaths((SVGimage*)imge));
        if ( getLength(getGroups((SVGimage*)imge)) > 0 ) numG = getLength(getGroups((SVGimage*)imge));

     sprintf(svgJSON, "{\"numRect\":%d,\"numCirc\":%d,\"numPaths\":%d,\"numGroups\":%d}", numR, numC, numP, numG);
    }
    return svgJSON;
}

/* ******************************* Bonus A2 functions - optional for A2 *************************** */

/** Function to converting a JSON string into an SVGimage struct
*@pre JSON string is not NULL
*@post String has not been modified in any way
*@return A newly allocated and initialized SVGimage struct
*@param str - a pointer to a string
**/
SVGimage* JSONtoSVG(const char* svgString){return NULL;}

/** Function to converting a JSON string into a Rectangle struct
*@pre JSON string is not NULL
*@post Rectangle has not been modified in any way
*@return A newly allocated and initialized Rectangle struct
*@param str - a pointer to a string
**/
Rectangle* JSONtoRect(const char* svgString){return NULL;}

/** Function to converting a JSON string into a Circle struct
*@pre JSON string is not NULL
*@post Circle has not been modified in any way
*@return A newly allocated and initialized Circle struct
*@param str - a pointer to a string
**/
Circle* JSONtoCircle(const char* svgString){return NULL;}


/* ******************************* MY BACKEND FUNCTIONS *************************** */

char * mySVGtoJSON(char * filename) {

    SVGimage * img = NULL;
    
    img = createValidSVGimage(filename, "parser/validation/svg.xsd");

    char * str = SVGtoJSON(img);
    
    deleteSVGimage(img);

    return str;
}

char * getSVGTitle(SVGimage * img) {
	
	char * title = malloc(sizeof(char) * 257);
    int ret = validateSVGimage(img, "parser/validation/svg.xsd");
	if (ret==1) strcpy(title, img->title);
    else strcpy(title, "Invalid SVG!");

	return title;

}

char * getSVGDescription(SVGimage * img) {
	
	char * desc = malloc(sizeof(char) * 257);
    int ret = validateSVGimage(img, "parser/validation/svg.xsd");
	if (ret==1) strcpy(desc, img->description);
    else strcpy(desc, "description of Invalid SVG!");
	

	return desc;

}

char * mySVGToRectJSON(SVGimage * img) {

    int ret = validateSVGimage(img, "parser/validation/svg.xsd");
	if (ret==1) return rectListToJSON(img->rectangles);
    else return "rect json of invalid SVG !";
    

}
char * mySVGToCircJSON(SVGimage * img) {

    int ret = validateSVGimage(img, "parser/validation/svg.xsd");
	if (ret==1) return circListToJSON(img->circles);
    else return "circle json of invalid SVG !";

}
char * mySVGToPathJSON(SVGimage * img) {

    int ret = validateSVGimage(img, "parser/validation/svg.xsd");
	if (ret==1) return pathListToJSON(img->paths);
    else return "path json of invalid SVG !";


}
char * mySVGToGroupJSON(SVGimage * img) {

    int ret = validateSVGimage(img, "parser/validation/svg.xsd");
	if (ret==1) return groupListToJSON(img->groups);
    else return "group json of invalid SVG !";
}

char * showRectAttributes(SVGimage * img) {

    int len = 500; 
    char * attrListJSON = (char*)malloc(sizeof(char)*len);

    strcpy(attrListJSON, "[");


    ListIterator iterator, tmpIter;
    void * tmp;
    iterator = createIterator(img->rectangles);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Rectangle * tmpRect = (Rectangle *)tmp;

        
        char * tmpStr = attrListToJSON(tmpRect->otherAttributes);

        tmpIter = iterator;
        if (nextElement(&tmpIter) == NULL)
        {
            strcat(attrListJSON, tmpStr);
        }
        else
        {
            strcat(attrListJSON, strcat(tmpStr, ","));
        }

        free(tmpStr);
        
                   
    tmp = nextElement(&iterator);
    }
    strcat(attrListJSON, "]");


    return attrListJSON;

}

char * showCircAttributes(SVGimage * img) {

    int len = 500; 
    char * attrListJSON = (char*)malloc(sizeof(char)*len);

    strcpy(attrListJSON, "[");


    ListIterator iterator, tmpIter;
    void * tmp;
    iterator = createIterator(img->circles);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Circle * tmpCirc = (Circle *)tmp;

        
        char * tmpStr = attrListToJSON(tmpCirc->otherAttributes);

        tmpIter = iterator;
        if (nextElement(&tmpIter) == NULL)
        {
            strcat(attrListJSON, tmpStr);
        }
        else
        {
            strcat(attrListJSON, strcat(tmpStr, ","));
        }

        free(tmpStr);
        
                   
    tmp = nextElement(&iterator);
    }
    strcat(attrListJSON, "]");


    return attrListJSON;

}

char * showPathAttributes(SVGimage * img) {

    int len = 500; 
    char * attrListJSON = (char*)malloc(sizeof(char)*len);

    strcpy(attrListJSON, "[");


    ListIterator iterator, tmpIter;
    void * tmp;
    iterator = createIterator(img->paths);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Path * tmpPath = (Path *)tmp;
        
        char * tmpStr = attrListToJSON(tmpPath->otherAttributes);

        tmpIter = iterator;
        if (nextElement(&tmpIter) == NULL)
        {
            strcat(attrListJSON, tmpStr);
        }
        else
        {
            strcat(attrListJSON, strcat(tmpStr, ","));
        }

        free(tmpStr);
        
                   
    tmp = nextElement(&iterator);
    }
    strcat(attrListJSON, "]");

    return attrListJSON;

}

char * showGroupAttributes(SVGimage * img) {

    int len = 500; 
    char * attrListJSON = (char*)malloc(sizeof(char)*len);

    strcpy(attrListJSON, "[");


    ListIterator iterator, tmpIter;
    void * tmp;
    iterator = createIterator(img->groups);
    tmp = nextElement(&iterator);
    while (tmp != NULL) {
        Group * tmpGrp = (Group *)tmp;

        
        char * tmpStr = attrListToJSON(tmpGrp->otherAttributes);

        tmpIter = iterator;
        if (nextElement(&tmpIter) == NULL)
        {
            strcat(attrListJSON, tmpStr);
        }
        else
        {
            strcat(attrListJSON, strcat(tmpStr, ","));
        }

        free(tmpStr);
        
                   
    tmp = nextElement(&iterator);
    }
    strcat(attrListJSON, "]");


    return attrListJSON;

}

