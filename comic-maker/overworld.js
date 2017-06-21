var d = document;
var cg = {};
var c = $('#c')[0]; //query html element with id c, c is a canvas object?
var ctx = c.getContext('2d');
var scene = new RB.Scene(c);
var w = c.width;
var h = c.height;
var fontFamily = "Arial, helvetica";
var pop = new Audio('pop.ogg');
var currentObj = null;

scene.add( scene.rect(w, h, 'gray') ); //scene.add attaches the object o in ragaboom's this.add = function(o) to the scene object
//basically adds a new object to the screen
scene.update(); //update the canvas only once - repainting every object in the Canvas area

var lib = $('#lib');
//keeps the URL for each image of the toolbar - need to change these names in both arrays when I change the sprite images
var miniUrls = ["squarePanel_mini.png"];
//stores the URL for the actual image that should be placed on the screen
var toonUrls = ["squarePanel.png"];

//helper functions for image object coordinates and size
/*cg.getX = function(obj) {
	return obj.x;
}

cg.getY = function(obj) {
	return obj.y;
}

cg.getWidth = function(obj) {
	 return obj.w;
}

cg.getHeight = function(obj) {
	return obj.h;
		
}

//////////array of modified sprites
var panel = [
	//"sprite01" : 
	{
		"name" : "sprite01",
	    "x" : cg.getX('toons/sm01_mini.png'),
	    "y" : cg.getY('toons/sm01_mini.png'),
	    "width" : cg.getWidth('toons/sm01_mini.png'),
	    "height" : cg.getHeight('toons/sm01_mini.png'),
	    //"rotation" : ""
	},
	//"sprite02" : 
	{
		"name" : "sprite02",
	    "x" : cg.getX('toons/sm02_mini.png'),
	    "y" : cg.getY('toons/sm02_mini.png'),
	    "width" : cg.getWidth('toons/sm02_mini.png'),
	    "height" : cg.getHeight('toons/sm02_mini.png'),
	    //"rotation" : ""
	}];
/////I added this code above
*/
cg.clearScreen = function(){
	ctx = c.getContext('2d');
	scene = new RB.Scene(c);
	w = c.width;
	h = c.height;
	fontFamily = "Arial, helvetica"; 
	pop = new Audio('pop.ogg');
	currentObj = null;

	scene.add( scene.rect(w, h, 'white') );
	scene.update();
}
//zoom in, up arrow
$(d).keyup(function(e){

	var key = e.keyCode || e.which;

	if(key == 46 && currentObj){
		scene.remove(currentObj);
		scene.update();
		RB.destroyCanvas( currentObj.getCanvas().id );
		currentObj = null;
	}
	
	if( currentObj && (key==37 || key==39) ){
		cg.hFlip(currentObj);
	}
});
//zoom out, down arrow
$(d).keydown(function(event){
	
	var key = event.keyCode || event.which;

	if(key == 38 && currentObj){
		cg.zoomIn(currentObj);
	}
	
	if(key == 40 && currentObj){
		cg.zoomOut(currentObj);
	}
});
//zoom in and out on a mouse wheel
d.onmousewheel = function(mw){
	if(currentObj && mw.wheelDelta > 0){
		cg.zoomIn(currentObj);
	} else if (currentObj && mw.wheelDelta < 0){
		cg.zoomOut(currentObj);
	}
};
//builds the image toolbar
cg.buildMinis = function(){
	var buffer = '';
	var imgString = "<img src='panels/IMG_URL' class='rc mini'></img>"; //same as comment below
	var link = "<a href=\"javascript:cg.createImage('panels/IMG_URL')\">"; //if this is commented out, all the sprites disappear and text input cannot be added anymore
	
	for(var i=0; i < miniUrls.length; i++){ //iterates through the miniurls array initialized on line 17
		buffer += link.replace(/IMG_URL/, toonUrls[i]); //replaces 1st argument string with second argument string
		buffer += imgString.replace(/IMG_URL/, miniUrls[i]) + '</a>';
	}
	
	lib.append(buffer);
	
	//lib.append( $('#textTool').clone() );
	$('#menuContainer').append( $('#instructs').clone() );
}

cg.buildMinis();

//add images to the screen
cg.createImage = function(url){
	////load an image inside a buffer canvas and return it in a RB.Obj - maybe I can pass in the modified sprites in panel instead?
	scene.image(url, function(obj){ 
		//allows the character image to be dragged on the screen (after already being added to the scene)
		obj.draggable = true;
		//sets the image in this location after clicking on it
		obj.setXY(30 + (Math.random()*100), 30 + (Math.random()*100)); 
		//obj.setXY(Math.random()*800, Math.random()*800); 
		
		obj.onmousedown = function(e){
			currentObj = obj;
			//stack order of element: element with greater stack order is always in front of element with lower stack order
			scene.zIndex(obj, 1); 
			//having z index set to 1 makes the character image being dragged in the scene appear in front of any other images in the scene

			scene.update(); 
		}
		//adds the character image to the screen
		scene.add(obj); 
		currentObj = obj;
		scene.update(); //image will not be added if this is commented out
		pop.play(); //plays a 'pop' noise when adding a character image
	});
}

cg.createText = function(){
	var txt = prompt("Adicione um texto:");
	
	if(txt){
		var obj = scene.text(txt, fontFamily, 20, 'black');
		obj.setXY(40, 40); //where the text will appear on the screen
		obj.draggable = true;
		
		obj.onmousedown = function(e){
			currentObj = obj;
			scene.zIndex(obj, 1); //stack order of element, puts element you are dragging in front of other elements
			scene.update();
		}
		currentObj = obj;
		
		scene.add(obj); //attaches object to scene object
		scene.update(); //
		pop.play(); //pop sound upon adding text
	}
}

cg.createTextFromInput = function(e){

	var key = e.keyCode || e.which;
	var txt = $('#newText').val(); 
	
	if(key == 13){
		var obj = scene.text(txt, fontFamily, 20, 'black');
		obj.setXY(40, 40);
		obj.draggable = true;
		
		obj.onmousedown = function(e){
			currentObj = obj;
			scene.zIndex(obj, 1);
			scene.update();
		}
		currentObj = obj;
		
		scene.add(obj);
		scene.update();
		$('#newText').val('');
		pop.play();
	}
}

cg.saveImage = function(){
	var data = c.toDataURL('png');
	var win = window.open(); //upon clicking save image at the top of the screen, new window opens that should have the image
	//the new window doesn't work in chrome, and in eclipse the window has nothing inside of it
	var b = win.document.body;
	var img = new Image();
	img.src = data;
	b.appendChild(img); //appendChild appends an item to a list
}
//what is obj
cg.zoomOut = function(obj){
	var w = obj.w * 0.05;
	var h = obj.h * 0.05;

	if(obj.w - w > 0 && obj.h - h > 0){
		obj.w -= w;
		obj.h -= h;
		
		obj.x += (w/2);
		obj.y += (h/2);
		
		scene.update();
	}
}

cg.zoomIn = function(obj){
	var w = obj.w * 0.05;
	var h = obj.h * 0.05;
	
	obj.w += w;
	obj.h += h;
	
	obj.x -= (w/2);
	obj.y -= (h/2);
	
	scene.update();
}

cg.hFlip = function(obj){
	var tmpCanvas = $(obj.getCanvas()).clone()[0];
	var img = obj.getCanvas();
	var tmpCtx = tmpCanvas.getContext('2d');
	var w = tmpCanvas.width;
	var h = tmpCanvas.height;
	
	//save current size and position
	var cW = obj.w, cH = obj.h, cX = obj.x, cY = obj.y;
	
	tmpCtx.translate(w/2, h/2);
	tmpCtx.scale(-1, 1);
	tmpCtx.drawImage(img, (-1*w/2), (-1*h/2));
	tmpCanvas.id = obj.getCanvas().id;
	obj.getCanvas().id = 'killme';
	
	RB.destroyCanvas('killme');
	d.body.appendChild(tmpCanvas);
	obj.setCanvas(tmpCanvas);
	obj.x=cX; obj.y=cY; obj.h=cH; obj.w=cW;	
	scene.update();
}

//add a function for rotation?

cg.setScreen = function(w, h){
	if(w && h && !isNaN(w) && !isNaN(h)){
		//var ok = confirm('All your work will be lost. Continue?');
		ok=true;
		if(ok){
			c.width = w;
			c.height = h;
			scene.update();
			//cg.clearScreen();
		}
	}
}