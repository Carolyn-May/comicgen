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

var changedX;
var changedY;

scene.add( scene.rect(w, h, 'white') ); //scene.add attaches the object o in ragaboom's this.add = function(o) to the scene object
//basically adds a new object to the screen
scene.update(); //update the canvas only once - repainting every object in the Canvas area

var lib = $('#lib');
//keeps the URL for each image of the toolbar - need to change these names in both arrays when I change the sprite images
var miniUrls = ["sm01_mini.png", "sm02_mini.png", "sm03_mini.png", "sushi_mini.png", "z01_mini.png", "z02_mini.png", "z03_mini.png", "z04_mini.png", "balao.png", "toon01_mini.png", "toon02_mini.png", "toon03_mini.png", "toon04_mini.png", "toon05_mini.png", "toon06_mini.png"];
//stores the URL for the actual image that should be placed on the screen
var toonUrls = ["sm01.png", "sm02.png", "sm03.png", "sushi.png", "z01.png", "z02.png", "z03.png", "z04.png", "balao.png", "toon01.png", "toon02.png", "toon03.png", "toon04.png", "toon05.png", "toon06.png"];


//////////array of modified sprites
var examplePanel = [
	{
		//"name" : "sprite01",
		"url" : "sm01.png",
	    "x" : "", //cg.x? 
	    "y" : "",
	    "width" : "", //cg.w?
	    "height" : "",
	    "flipped" : "", //true, false flag?
	},
	{
		//"name" : "sprite02",
		"url" : "sm02.png",
		"x" : "",
	    "y" : "",
	    "width" : "",
	    "height" : "",
	    "flipped" : "",
	}];

/*array of panels */
var comic = [];
/* actual array of sprites and their properties (modeled like the above example) */
var panel = [];

/////I added this code above

/* Adds the new panel to comic array */
function addNewPanel() {
	comic.push(panel);
}

//This creates a unique id for each panel. Not sure how to use it yet...
//https://stackoverflow.com/questions/33554120/incrementing-object-id-automatically-js-constructor-static-method-and-variable
var panelClass = (function() {
	var panelId = 1;
	return function panelClass(name) { //name of the panel. we need to add this
		this.name = name;
		this.id = panelId++;
	}
}) ();


//could refactor the functions below 

//search for sprite by url in panel array, update x and y coordinates
function changeDesc(url , x, y) {
	   for (var i in panel) {
	     if (panel[i].url == url) {
	        panel[i].x = x;
	        panel[i].y = y;
	        break; //Stop this loop, we found it!
	     }
	   }
	}

//delete sprite from panel array
function deleteSprite(o) {
	var uid = o.id;//change this 
	
	for (var i in panel) {
	     if (uid == panel[i].id) {
	    	 panel.splice(i, 1);
	    	 break;
	     }
	}
}

//increase and update width and height of sprite in panel array
function zoomInSprite (o) {
	var uid = o.id;
	
	for (var i in panel) {
	     if (uid == panel[i].id) {
	    	var w = panel[i].width * 0.05;
	    	var h = panel[i].height * 0.05;
	    	
	    	panel[i].width += w;
	    	panel[i].height += h;
	    	panel[i].x -= (w/2);
	    	panel[i].y -= (h/2);
	    	break;
	     }
	 }
}

//decrease and update  width and height of sprite in panel array
function zoomOutSprite (o) {
	var uid = o.id;
	
	for (var i in panel) {
	     if (uid == panel[i].id) {
	    	 var w = panel[i].width * 0.05;
    		 var h = panel[i].height * 0.05;
	    
	    	 if(panel[i].width - w > 0 && panel[i].height - h > 0) {
	    		 panel[i].width -= w;
	    		 panel[i].height -= h;
	    		 panel[i].x += (w/2);
	    		 panel[i].y += (h/2);
	    		 break;
	    	 }//height width comparison end
	     }//id comparison end
	 }//for loop end
}

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
//delete or flip sprite on certain key ups
$(d).keyup(function(e){

	var key = e.keyCode || e.which;

	if(key == 46 && currentObj){
		console.log("deleted sprite - d.keyup(function(e)");
		
		deleteSprite(currentObj); //delete sprite from panel
		
		scene.remove(currentObj); //removes object from the scene
		
		scene.update();
		RB.destroyCanvas( currentObj.getCanvas().id );
		currentObj = null;
	}
	
	if( currentObj && (key==37 || key==39) ){
		console.log("flip sprite - d.keyup(function(e)");
		//panel.find(findSprite);
		cg.hFlip(currentObj);
	}
});
//zoom in and out of sprite on key down
$(d).keydown(function(event){
	
	var key = event.keyCode || event.which;

	if(key == 38 && currentObj){
		//zoomInSprite(currentObj); //zoom in on sprite in panel 
		cg.zoomIn(currentObj);
	}
	
	if(key == 40 && currentObj){
		//zoomOutSprite(currentObj); //zoom out of sprite in panel 
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
	var imgString = "<img src='toons/IMG_URL' class='rc mini'></img>"; //same as comment below
	var link = "<a href=\"javascript:cg.createImage('toons/IMG_URL')\">"; //if this is commented out, all the sprites disappear and text input cannot be added anymore
	
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
	console.log("cg.createimage");
	////load an image inside a buffer canvas and return it in a RB.Obj - maybe I can pass in the modified sprites in panel instead?
	scene.image(url, function(obj){ 
		//console.log(JSON.stringify(obj));
		//console.log("id: " + obj.id);
		//allows the character image to be dragged on the screen (after already being added to the scene)
		obj.draggable = true;
		//sets the image in this location after clicking on it
		obj.setXY(30, 30); 
		
		//obj.setXY(Math.random()*800, Math.random()*800); 
		//var position = getPosition(obj);
		currentObj = obj;
		var dragging = false;
		
		obj.onmousedown = function(e){ //enables image dragging on mouse down
			dragging = true;
			
			console.log("being dragged");
			
			currentObj = obj; 
			
			changedX = currentObj.x;
			changedY = currentObj.y;
			
			obj.setXY(currentObj.x, currentObj.y);
			console.log(obj.x + " " + obj.y);
			
			changeDesc(url, changedX, changedY);
			
			//you can see that the x and y position change but only when clicking down, we want this to change when the click is released
			//so that the position is where you leave the sprite
			//console.log(changedX + " " + changedY);
			
			//stack order of element: element with greater stack order is always in front of element with lower stack order
			scene.zIndex(obj, 1); 
			//having z index set to 1 makes the character image being dragged in the scene appear in front of any other images in the scene
			
			scene.update();
		}
		//obj.setXY(currentObj.x, currentObj.y);
		
		//code doesnt seem to run through this function, statements dont print
		obj.onmouseup = function(e){
			if (dragging) {
				currentObj = obj;
				console.log("x:" + obj.x);
				console.log("y:" + obj.y);
				dragging = false;
				//scene.onmousemove();
		}
		}
		
		panel.push(obj); ////yay
		
		
		var lastElement = panel.length - 1;
		
		scene.add(panel[lastElement]);
		//adds the character image to the screen
		//scene.add(obj);
				
		console.log(panel[lastElement]);
		
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
	console.log ("zoom in");
	scene.update();
}

cg.hFlip = function(obj) {
	var tmpCanvas = $(obj.getCanvas()).clone()[0];
	var img = obj.getCanvas();
	var tmpCtx = tmpCanvas.getContext('2d');
	var w = tmpCanvas.width;
	var h = tmpCanvas.height;
	
	//save current size and position
	var cW = obj.w, cH = obj.h, cX = obj.x, cY = obj.y;
	
	tmpCtx.translate(w/2, h/2);
	tmpCtx.scale(-1, 1);
	tmpCtx.drawImage(img, (-1*w/2), (-1*h/2));// drawImage() draws an image, canvas, or video onto the canvas - can resize
	tmpCanvas.id = obj.getCanvas().id;
	obj.getCanvas().id = 'killme';
	
	RB.destroyCanvas('killme');
	d.body.appendChild(tmpCanvas);
	obj.setCanvas(tmpCanvas);
	obj.x=cX; obj.y=cY; obj.h=cH; obj.w=cW;	
	scene.update();
}

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

//localStorage.setItem(c, c.toDataURL());	//(canvasName, canvas.toDataURL())

	
}
