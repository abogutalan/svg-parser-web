/*
For your own test purposes, you will also want to code a main program in another .c file that calls your
functions with a variety of test cases, However, you must not submit that file with your assignment. Also, do
not put your main() function in SVGParser.h. Failure to do this may cause the test program will fail if you
incorrectly include main() in our shared library file; you will lose marks for that, and may get a 0 for the
assignment.
*/
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#include "LinkedListAPI.h"
#include "SVGParser.h"



int main(int argc, char **argv) {
    SVGimage* mySVGimage = NULL;
    char *fileName = NULL;
    printf("Hi there!\n\n");

    if (argc != 2)  return(1);

    fileName = (char*)malloc(sizeof(char)*strlen((char*)argv[1]) + 1 );
    strcpy(fileName, argv[1]);


    mySVGimage = createSVGimage(fileName);
    //mySVGimage = createValidSVGimage(fileName, "svg.xsd");
    bool b = validateSVGimage(mySVGimage, "svg.xsd");
    printf("> after validateSVGimage : %d\n",b);

    b = writeSVGimage(mySVGimage, "file.svg");
    printf("> after writeSVGimage : %d\n",b);

    // b = validateSVGimage(mySVGimage, "svg.xsd");
    // printf("> after validateSVGimage : %d\n",b);

    // b = writeSVGimage(mySVGimage, "file.svg");
    // printf("> after writeSVGimage : %d\n",b);


    //testing setAttribute for SVG
    // char *attrName = "r";
    // char *attrValue = "31";

    // Attribute * newAttribute = (Attribute *)malloc(sizeof(Attribute));    
            
    // newAttribute->name = malloc(sizeof(char) * (strlen(attrName) + 1));
    // newAttribute->value = malloc(sizeof(char) * (strlen(attrValue) + 1));
    // strcpy(newAttribute->name, attrName);
    // strcpy(newAttribute->value, attrValue);

    // //setAttribute(mySVGimage, SVG_IMAGE, 0, newAttribute);
    // setAttribute(mySVGimage, CIRC, 0, newAttribute);
    // //setAttribute(mySVGimage, RECT, 0, newAttribute);
    // //setAttribute(mySVGimage, PATH, 0, newAttribute);
    // //setAttribute(mySVGimage, GROUP, 1, newAttribute);

    // b = writeSVGimage(mySVGimage, "file.svg");

    // ********************************************

    //Module 3
    // char * str = NULL;
    // str = attrToJSON(newAttribute);
    // printf("%s\n",str);
    // deleteAttribute((void*)newAttribute);
    // free(str);
    
    
    char * str2 = NULL;
    str2 = "";
    
    // List * list = getGroups(mySVGimage);
    // str2 = groupListToJSON(list);
    // printf("%s\n",str2);
    // getterFree(list);
    // free(str2);

    // List * list = getPaths(mySVGimage);
    // str2 = pathListToJSON(list);
    // printf("%s\n",str2);
    // getterFree(list);
    // free(str2);



    // str2 = SVGtoJSON(mySVGimage);
    // printf("%s\n",str2);

    // str2 = attrListToJSON(mySVGimage->otherAttributes);
    // printf("%s\n", str2);
    // free(str2);

    

        // Rectangle * r = (Rectangle *)malloc(sizeof(Rectangle));
        // r->otherAttributes = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);
        // r->units[0] = '\0';
        // //strcpy(r->units, "mm");
        // r->width = 2.5;
        // r->height = 3.5;
        // str2 = rectToJSON(r);
        // printf("%s\n",str2);

        // Circle * c = (Circle*)malloc(sizeof(Circle));
        // c->otherAttributes = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);
        // c->units[0] = '\0';
        // //strcpy(r->units, "mm");
        // c->r = 2.5;
        // str2 = circleToJSON(c);
        // printf("%s\n",str2);

        // Rectangle * r = (Rectangle *)malloc(sizeof(Rectangle));
        // r->otherAttributes = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);
        // r->units[0] = '\0';
        // //strcpy(r->units, "mm");
        // r->width = 2.5;
        // r->height = 3.5;
        // str2 = rectToJSON(r);
        // printf("%s\n",str2);

        Path * p = (Path*)malloc(sizeof(Path));
        p->data = "m47 36c-15 0-15 0-29.9 0-2.1 0-2.1 4-.1 4 10.4 0 19.6 0 30 0 2 0 2-4 0-4";
        //p->data = "";
        p->otherAttributes = initializeList(&attributeToString, &deleteAttribute, &compareAttributes);
        str2 = pathToJSON(p);
        if(str2 != NULL) printf("str2 is : %s\n",str2);
        else printf("str2 is NULL !!! \n");

        //deletePath((void*)p);


    free(str2);

        
    // ListIterator iterator;
    // void * tmp;
    // iterator = createIterator(getRects(mySVGimage));
    // tmp = nextElement(&iterator);
    // while (tmp != NULL) {
    //     Rectangle * tmpCircle = (Rectangle *)tmp;

    //     str2 = rectToJSON(tmpCircle);
    //     printf("%s\n",str2);
    //     free(str2);

    // tmp = nextElement(&iterator);
    // }

    
    // ListIterator iterator;
    // void * tmp;
    // iterator = createIterator(getGroups(mySVGimage));
    // tmp = nextElement(&iterator);
    // while (tmp != NULL) {
    //     Group * tmpCircle = (Group *)tmp;

    //     str2 = groupListToJSON(tmpCircle);

    //     printf("%s\n",str2);
    //     free(str2);

    // tmp = nextElement(&iterator);
    // }
    
    

    


    // A1 

    // char *myString_representation = NULL;
    // myString_representation = (char *)SVGimageToString(mySVGimage);
    // printf("\nString representation of SVG image: \n%s\n", myString_representation);
	// free(myString_representation);  


    //  List * c  = getCircles(mySVGimage);
    //  printSVG(c, "Circle");
    //  getterFree(c);  

    //  List * r  = getRects(mySVGimage);
    //  printSVG(r, "Rectangle");
    //  getterFree(r);  

    //  List * p  = getPaths(mySVGimage);
    // printSVG(p, "Path");
    //  getterFree(p);  

    //  List * g  = getGroups(mySVGimage);
    //  printf("length of all groups : %d\n", getLength(g));
    //  getterFree(g);  

    // int circleArea = numCirclesWithArea(mySVGimage, 40.6944);
    // printf("Circle Area : %d\n", circleArea);

    // int rectArea = numRectsWithArea(mySVGimage, 285);
    // printf("Rectangle Area : %d\n", rectArea);

    // int comparedData = numPathsWithdata(mySVGimage, "m38 50.6c0 3.3-2.7 6-6 6-3.3 0-6-2.7-6-6 0-3.3 2.7-6 6-6 3.3 0 6 2.7 6 6");
    // printf("Number of path data : %d\n", comparedData);

    // int groupLength = numGroupsWithLen(mySVGimage, 3);
    // printf("number of all elements in all groups : %d\n", groupLength);

    // int a = numAttr(mySVGimage);
    // printf("number of all attributes : %d\n", a);


    

    free(fileName);

    deleteSVGimage(mySVGimage);                               //to do: There will be no main so free the memory somewhere else!
	
    
    return 0;
}

