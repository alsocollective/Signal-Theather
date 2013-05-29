
var options = {
	"containerOfEverything": 	"almightyParent", 	//this is and ID the top levl object, there can only be one with
	"classOfCreationMark": 		"content", 			//this a Class that defines element to create a new slide object from them
	"idOfSpash": 				"splash",			//the splash page, don't really need to define this anymore
	"idOfContent": 				"company",  		//the ID of div that will contain the company info
	"idOfContentButton": 		"companyButton",	//the ID of button for the company
	"sizeOfButtons": 			50, 				//the width of the side panels
	"transitionSpeed": 			500, 				//the speed at which evertything moves, beaware, if people start clicking multiple things, they will try to load and in doing so, alter the animations
	"archiveNavWidth": 			200, 				//keep this as the same width of the archive Nav
	"randomButtonColors": 		true,				//this was for the dev of it...
};

options["idOfContent"]

var width,height;

var staticOrder = [];		//side bar items
var active;					//active element, the big one, this is only for staticOrder
var root;					//container for this whole thing
var company;				//company object



window.onload = function(){
	active = document.getElementById(options["idOfSpash"]);
	root = document.getElementById(options["containerOfEverything"]);
	width = root.offsetWidth;
	height = root.offsetHeight;

	company = new companyObj(document.getElementById(options["idOfContent"]),document.getElementById(options["idOfContentButton"]));
	company.resize(width);

	var elements = document.getElementsByClassName(options["classOfCreationMark"]);
	for(var a = 0; a < elements.length; ++a){
		staticOrder[a] = (new block(elements[a],a, elements.length));
		staticOrder[a].setSize(width,height);
		if(options["randomButtonColors"]){
			staticOrder[a].makeColorRandom();
		}
		staticOrder[a].setListener();//.parent.addEventListener("click",makeMain);
	}

	window.addEventListener("resize",function(){
		width = root.offsetWidth;
		height = root.offsetHeight;
		for(var a = 0; a < staticOrder.length; ++a){
			staticOrder[a].setSize(width,height);
		}
		if(active && active.id != options["idOfSpash"]){
			active.setSize(width,height);
		}
		company.resize(width);
	});
}


function colapseAll(){
	if(active && active.id != options["idOfSpash"]){
		staticOrder.splice(0,0,active);
		active = null;
	}
	for(var b = 0; b < staticOrder.length; ++b){
		staticOrder[b].setOrder(b, staticOrder.length,"right");
	}
}

function makeMain(currentEvent){
	var templength = staticOrder.length;
	var point;
	for(var a = 0; a < templength; ++a){
		if(this == staticOrder[a].parent){
			//retrive and remove the new active element
			var newActive = staticOrder[a];
			staticOrder.splice(a,1);

			//if there is an active one add it back to the list
			if(active && active.id != options["idOfSpash"]){
				staticOrder.splice(0,0,active);
			}

			//resize the new active element
			newActive.makeBig();
			active = newActive;

			//this resizes all the other elements to their right postion
			for(var b = 0; b < staticOrder.length; ++b){
				staticOrder[b].setOrder(b, staticOrder.length,"left");
			}
			point = a;
			a = 999;
		}
	}
	if(point < staticOrder.length){
		if(point != staticOrder.length-1 || staticOrder.length > 1){
			setTimeout(function(){
				for(var a = point; a < staticOrder.length; ++a){
					staticOrder[a].bringToLocation(a);
				}
			},options["transitionSpeed"]*2);
		}
	}

	company.hide();
}

function logStaticOrder(){
	var out = [];
	for(var a = 0; a < staticOrder.length;++a){
		out.push(staticOrder[a].id+"", staticOrder[a].getOrder());
	}
	console.log(out);
}

function findChildId(within,id){
	var children = within.childNodes;
	for(var a = 0; a < children.length; ++a){
		if(children[a].nodeType == 1){
			if(children[a].id != id){
				var out = findChildId(children[a],id);
				if(out){
					return out;
				}
			} else {
				return children[a]
			}
		}
	}
}

function companyObj(element,buttonEl){
	var parentNode = element;
	var buttonEl = buttonEl;
	var transition = false;
	var ondisplay = false;
	var locWidth,locHeight;

	setTimeout(enableTransitions,10);
	function toggle(){
		if(ondisplay){
			parentNode.style.left = -root.offsetWidth;
			ondisplay = false;
		} else {
			colapseAll();
			parentNode.style.left = 0;
			ondisplay = true;
		}
	}

	this.hide = function(){
		if(ondisplay){
			parentNode.style.left = -locWidth;
			ondisplay = false;
		}
	}

	buttonEl.addEventListener("click",toggle);

	this.resize = function(newWidth){
		if(!ondisplay){
			parentNode.style.left = - newWidth;
		}
		parentNode.style.display = "block";
		locWidth = newWidth;
	}

	function enableTransitions(){
		if(!transition){
			with(parentNode.style){
				transition = "left "+options["transitionSpeed"]+", width "+options["transitionSpeed"];
				MozTransition = "left "+options["transitionSpeed"]+", width "+options["transitionSpeed"];
				WebkitTransition = "left "+options["transitionSpeed"]+", width "+options["transitionSpeed"];
				OTransition = "left "+options["transitionSpeed"]+", width "+options["transitionSpeed"];
			}
			transition = true;
		}
	}

	function disableTransitions(){
		if(transition){
			with(parentNode.style){
				transition = "left 0s, width 0s";
				MozTransition = "left 0s, width 0s";
				WebkitTransition = "left 0s, width 0s";
				OTransition = "left 0s, width 0s";
			}
			transition = false;
		}
	}
}

//This is our class persay
function block(element, order, totalNumbOfEl){
	var parentNode = element.parentNode;
	this.parent = parentNode;

	var content = element;
	var activeMain = findChildId(content,"activeMain");
	var activeContainer = activeMain.parentNode;
	var toArchiveButton = findChildId(activeMain,"archiveButton");
	var toActiveButton = findChildId(activeContainer,"activeButton");
	var inActive = true;

	//meta data...
	this.id = this.parent.id;
	var order = order;
	var totalNumbOfEl = totalNumbOfEl;
	this.presenting = false; //to tell if it's big or not
	var localWidth,localHeight;
	var transition = false;

	setTimeout(enableTransitions,1);

	toArchiveButton.addEventListener("click",function(){
		inActive = false;
		with(content.style){
			left = -localWidth;
		}
	});

	toActiveButton.addEventListener("click",function(){
		inActive = true;
		with(content.style){
			left = 0;
		}
	});

	this.setListener = function(){
		parentEventListener = parentNode.addEventListener("click",makeMain);
	}

	this.makeColorRandom = function(){
		content.style.backgroundColor = "#"+(Math.floor(Math.random()*999));
	}

	this.setSize = function(newWidth,newHeight){
		localWidth = newWidth;
		localHeight = newHeight;

		if(!this.presenting){
			with(this.parent.style){
				left = newWidth - ((order+1)*options["sizeOfButtons"]);
				zIndex = 2;
			}
		}
		with(content.style){
			width = newWidth*2;
			height = newHeight;
		}
		with(activeContainer.style){
			width = newWidth+options["archiveNavWidth"]; //this makes the left nav for 30%
		}
		with(activeMain.style){
			width = newWidth;
		}
		if(!inActive){
			with(content.style){
				left = -newWidth;
			}
		}
	}

	this.makeBig = function(){
		this.presenting = true;
		with(this.parent.style){
			zIndex = 1;
			left = "0px";
			width = "100%";
		}
		parentNode.removeEventListener("click",makeMain);
	}

	this.setOrder = function(newOrder, newtotalNumbOfEl, direction){
		//to reset the archive
		if(!inActive){
			inActive = true;
			with(content.style){
				left = 0;
			}
		}

		order = newOrder;
		totalNumbOfEl = newtotalNumbOfEl;
		if(this.presenting){ 						//when we are dealing with the old preseting object we got to put it to the left and then bring it in
			if(direction =="left"){
				this.parent.style.left = -localWidth;	//sliding off the left
			} else {
				this.parent.style.left = localWidth;	//sliding off the right
			}
			this.presenting = false;				//no longer presenting
			setTimeout(function(){					//once off screen we disable it and reorganize the elements
				for(var b = 0; b < staticOrder.length; ++b){
					disableTransitions();
					staticOrder[b].setOrder(b, staticOrder.length,"left");
				}
			},options["transitionSpeed"]);
		}
		else {
			//when the element is off the screen it's transitions are disabled
			//we must bring this element back on screen to it's proper location
			if(!transition){
				//this is where we are placing the element to the far right and sliding it back in
				with(this.parent.style){
					left = localWidth;
					zIndex = 2;
				}
				//reenableing the sliding fucntion and then setting it to it's proper locaiton
				setTimeout(function(){
					enableTransitions();
					staticOrder[order].setListener();
					for(var a = 0; a < staticOrder.length; ++a){
						staticOrder[a].bringToLocation(a);
					}
				},options["transitionSpeed"]);
			}
		}
	}


	this.bringToLocation = function(){
		with(parentNode.style){
			left = localWidth - ((order+1)*options["sizeOfButtons"]);
			zIndex = 2;
			width = options["sizeOfButtons"]+"px";
		}
	}

	this.getOrder = function(){
		return order;
	}

	this.outEnableTrans = function(){
		enableTransitions();
	}
	function enableTransitions(){
		if(!transition){
			with(parentNode.style){
				transition = "left "+options["transitionSpeed"]+", width "+options["transitionSpeed"];
				MozTransition = "left "+options["transitionSpeed"]+", width "+options["transitionSpeed"];
				WebkitTransition = "left "+options["transitionSpeed"]+", width "+options["transitionSpeed"];
				OTransition = "left "+options["transitionSpeed"]+", width "+options["transitionSpeed"];
			}
			transition = true;
		}
	}

	function disableTransitions(){
		if(transition){
			with(parentNode.style){
				transition = "left 0s, width 0s";
				MozTransition = "left 0s, width 0s";
				WebkitTransition = "left 0s, width 0s";
				OTransition = "left 0s, width 0s";
			}
			transition = false;
		}
	}
}
