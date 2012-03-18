/**
 * DomLine 
 * draw canvas line between two DOM element
 * @author Badger
 * http://jeremypetrequin.fr/
 * 
 * BETA
 */

;(function($, w) {
    
    /**
     * Render List is a static class used for an enterFrame render of several elements
     */
    //expose renderList on window
    w.RenderList =  {
        renderList : [],
        paused : true,
        frameRate :30,  //you can change this value : RenderList.frameRate = 12;
        
        /**
         * Enterframe method, launch method render on each item in renderList
         */
        render : function() {
            if(RenderList.paused) return
            var i = RenderList.renderList.length;
            if(i == 0) return;
            while(i--) {
                RenderList.renderList[i].render();
            }
            setTimeout(RenderList.render, 1000/RenderList.frameRate);
        },
        
        /**
         * Add an object to the render list
         * @params :any object which has a public propertie "posInRenderList"
         */
        addItem : function(item) {
            if(item.posInRenderList) return;
            RenderList.renderList.push(item);
            item.posInRenderList = RenderList.renderList.length-1;
            if(RenderList.renderList.length === 1 && RenderList.paused === true) {RenderList.resume();}
        },
        
        //Pause
        pause : function() {
            RenderList.paused = true;
        },
        //play or resume
        resume : function() {
            RenderList.paused = false;
            RenderList.render();
        },
        
        //dequeu all the item from the renderList
        dequeuAll : function() {
            var i = RenderList.renderList.length;
            if(i == 0) return;
            while(i--) {
                this.removeItem(RenderList.renderList[i]);
            }
        },

        /**
         * remove one item from the render list
         * @params :any object which has a public propertie "posInRenderList"
         */
        removeItem : function(item) {
            if(!item || item.posInRenderList === false) return;
            RenderList.renderList.splice(item.posInRenderList, 1);
            item.posInRenderList = false;
        }
    }
    
    
   
   /**
    * DomLine class
    */
    w.DomLine = function(one, two, settings) {
        /*** privates properties ***/
        var _settings = {
            autorender : false, //automaticly render on enterFrame
            lineWidth : 1, //line width (in px)
            lineColor : 'black', //color of line : a css standart color (red, white...) or rgb/rgba(0, 0, 0, 0)...
            debug : false //display red background on each canvas
        },
        _elmt1 = {
            elmt : null, //jquery element of first element
            place : ['center', 'center'] //positon of the anchor, string or array (center || left || right, center || top || bottom)
        },
        _elmt2 = {
            elmt : null, //jquery element of second element
            place : 'center-center' //positon of the anchor, string or array (center || left || right, center || top || bottom)
        },
        _$cv = null,
        _ctx = null,
        _$b = $('body'),
        canvasSupported = true;
        
        /*** public propertie (used in RenderList) ***/
        this.posInRenderList = false;
        
        
        /*** public methods ***/
        /**
         * Render function,
         * if you set autorender at true, or if you call this.play(), this method'll render the line at enterFrame
         * or, you can manualy called this function, anytime one of the objects move
         */
        this.render = function() {
            var _e1 =_elmt1.elmt.offset(),
            _e2 =_elmt2.elmt.offset(),
            top1 = _e1.top + (_elmt1.place[1] === 'top' ? 0 : (_elmt1.place[1] === 'center' ? _elmt1.elmt.outerHeight()/2 : _elmt1.elmt.outerHeight())),
            top2 = _e2.top + (_elmt2.place[1] === 'top' ? 0 : (_elmt2.place[1] === 'center' ? _elmt2.elmt.outerHeight()/2 : _elmt2.elmt.outerHeight())),
            left1 = _e1.left + (_elmt1.place[0] === 'left' ? 0 : (_elmt1.place[0] === 'center' ? _elmt1.elmt.outerWidth()/2 : _elmt1.elmt.outerWidth())),
            left2 = _e2.left + (_elmt2.place[0] === 'left' ? 0 : (_elmt2.place[0] === 'center' ? _elmt2.elmt.outerWidth()/2 : _elmt2.elmt.outerWidth()));

            _$cv[0].style.left = Math.min(left1, left2)+'px';
            _$cv[0].style.top = Math.min(top1, top2)+'px';
            var h = _$cv[0].height =Math.max(top1 - top2, top2 - top1);
            var w = _$cv[0].width = Math.max(left1 - left2, left2 - left1);
            
            
            _ctx.clearRect(0, 0, w, h);
            _ctx.beginPath();
            
            _ctx.lineWidth=_settings.lineWidth;   
            
            _ctx.moveTo(left1 < left2 ? 0 : w, top1 > top2 ?  h : 0);
            
            _ctx.lineTo(left1 > left2 ? 0 : w, top1 > top2 ? 0 : h);
            _ctx.strokeStyle = _settings.lineColor;
            _ctx.closePath();
            _ctx.stroke();
           
           return this;
        }
        
        /**
         * add this item in the renderList
         */
        this.resume = function() {
            if(!canvasSupported) {throw "Canvas not Supported";return;}
            RenderList.addItem(this);
            return this;
        }
        
       /**
        * remove this item from the renderList
        */ 
        this.pause  =function() {
            if(!canvasSupported) {throw "Canvas not Supported";return;}
            RenderList.removeItem(this);
            return this;
        }
        
        /*** init ***/
        _settings = $.extend({},this._settings,settings);
        _elmt1 = $.extend({},this._elmt1,one);
        _elmt2 = $.extend({},this._elmt2,two);
        _elmt1.place = typeof _elmt1.place == 'string' ?  _elmt1.place.split('-') : _elmt1.place;
        _elmt2.place = typeof _elmt2.place == 'string' ? _elmt2.place.split('-') : _elmt2.place;
        
        _$cv = $('<canvas>', {css : {position : 'absolute', display : 'block'}});
        if(_settings.debug) _$cv.css('background', 'red');
        _$b.append(_$cv);
        if(!(_$cv[0].getContext && (_ctx =_$cv[0].getContext('2d')))) {
            canvasSupported = false;
            throw "Canvas not Supported";
            return false;
        }
        
        

        this.render();
        if(_settings.autorender) this.resume();
        return this;
     
    }
})(jQuery, window);


