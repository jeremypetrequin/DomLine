DomLine
=============
DomLine is a Javascript class (not the most usefull you ever seen, i agree ;) ) to create Line between two DOM elements.

Line are canvas element (why not SVG? good question..!), (one canvas for each line) so DomLine only supports HMTL5 browsers, and need jQuery to work fine.

You can see it in action on my portfolio : http://jeremypetrequin.fr
or in this example : http://jeremypetrequin.fr/projets/domline/


The file DomLine contains two Javascript classes :

RenderList Static class
---------

Just a static class to make an enterframe render of several elements.
You can use it simply in any project/context you want : 

Use RenderList.addItem(obj) and RenderList.removeItem(obj) to add/remove objects in renderList

Use RenderList.resume() / RenderList.stop() to control the render

You can set the RenderList.framerate = 30 to change the speed (frames per second)

Use RenderList.dequeuAll() to remove all objects

The only constraint is that each object added in the renderList need to have a public property "posInRenderList" set to false;
this property is used to have no loop in the renderList when looking for a specific element.

And of course, each object need to have a public method called "render()", which is launch at the enter frame

A little example :

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

to create a new line, simply do :

    var line = new DomLine(param1, param2, param3);

params are :
    
    param1 = {
        elmt : $('#firstElement'),//jQuery object of the first element 
        place : ['center', 'center']
    }

place is the anchor for the line (can be an array or a string):
value can be : center || left || right, center || top || bottom
example : ['center', 'center'] place the anchor on the center of the element, 'center-center' will produce the same result

param2 is the same object than param1, except that param2.elmt has to be the jQuery object of the second element.

    param3 = {//settings object : 
        autorender : false, //if true, push the current object in the renderList and refresh the line at each frame (so you don't need to call the "play()" method)
        lineWidth : 1, //set the line width, in pixel, uint
        lineColor : 'black', //set the color of the line, string : any "standard" color (red, green, white...) or rgb/rgba : rgba(255, 0, 0, 0.5); (> a red, 50% opacity)
        debug : false //for easily debuging, display a red background on each canvas
    }

you have some public methods :

    line.render();  if you set autoplay to false, and if the line is currently not playing, you can manually call this method to refresh line (when elements are moving for example...)
    line.resume(); add line in the render queue
    line.pause(); remove line from render queue

(each method is chainable, although chain resume().pause() make no sens!)

If canvas is not supported by the browser, object instanciation will throw an error "Canvas not Supported";



