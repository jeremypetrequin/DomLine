DomLine
=============
DomLine is a Javascript class (not the most usefull you ever seen, i'm agree ;) ) to create Line between two DOM elements

Line are canvas element (why not SVG? good question..!), (one canvas for each line) so DomLine only supports HMTL5 browsers, and need jQuery to working fine

You can see it in action on my portfolio : http://jeremypetrequin.fr
or in this simple example : http://jeremypetrequin.fr/projets/domline/


The file DomLine containt two Javascript classes in fact :

RenderList 
---------

Just a static class to make an enterframe render of several elements
You can use it simply in any project/context you want : 

Use RenderList.addItem(obj) and RenderList.removeItem(obj) to add object in renderList
Use RenderList.resume() / RenderList.stop() to control the render
You can set the RenderList.framerate = 30 to change the speed (frames per second)

The only contraint is each object added in the renderList need to have a public propertie "posInRenderList" set to false;
this property is used to not have to loop in the renderList to search a specific element

And of course, each object need to have a public method called "render()", witch is launch at the enter frame

Little example :

    function MyClass() {

        this.posInRenderList = false;
        this.render = function() {
            //method call on enterFrame
        }   
    }

    var obj = new MyClass();//create object
    RenderList.addItem(obj); // add object in render queue
    RenderList.resume(); //launch the render
    RenderList.remove(obj); //remove object from render queue (but render loop of RenderList still playing...)

DomLine class:
-------------

to create a new line, simply does :
    var line = new DomLine(param1, param2, param3);
params are :
    param1 : an object containing : {
        elmt : $('#firstElement'),//jQuery object of the first element 
        place : //anchor for the line (could be an array or a string):
                    //value could be : center || left || right, center || top || bottom
                    //example : ['center', 'center'] place the anchor on the center of the element, 'center-center' will produce the same result
    }

    param2 is the same object than param1, except that param2.elmt have to be the jQuery object of the second element of course.

    param3 is a settings object : {
        autorender : false, //if true, push the current object in the renderList and refresh the line at each frame (so you don't need to call the "play()" method
        lineWidth : 1, //set the line width, in pixel, uint
        lineColor : 'black', //set the color of the line, string : any "standart" color (red, green, white...) or rgb/rgba : rgba(255, 0, 0, 0.5); (> a red, 50% opacity)
        debug : false //for easily debuging, display a red background on each canvas
    }

you have some public methods :

    line.render();  if you set autoplay to false, and if the line is currently not playing, you can manualy call this method to refresh line (when elements moving for example...)
    line.resume(); add line in the render queue
    line.pause(); remove line from render queue

(each method is chanable, instead chain resume().pause() make no sens!)

If canvas not supported on the browser, object instanciation'll throw an error "Canvas not Suported";



