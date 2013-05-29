var width,height;

var staticOrder = [];		//the side bar items
var active = document.getElementById("splash"); //the active element
var root = document.getElementById("almightyParent"); //the container for this whole thing
var company;

window.onload = function(){
	width = root.offsetWidth;
	height = root.offsetHeight;

	company = new companyObj(document.getElementById("company"),document.getElementById("companyButton"));
	company.resize(width);

	var elements = document.getElementsByClassName("content");
	for(var a = 0; a < elements.length; ++a){
		staticOrder[a] = (new block(elements[a],a, elements.length));
		staticOrder[a].setSize(width,height);
		staticOrder[a].makeColorRandom();
		staticOrder[a].setListener();//.parent.addEventListener("click",makeMain);
	}

	window.addEventListener("resize",function(){
		width = root.offsetWidth;
		height = root.offsetHeight;
		for(var a = 0; a < staticOrder.length; ++a){
			staticOrder[a].setSize(width,height);
		}
		if(active.id != "splash"){
			active.setSize(width,height);
		}
		company.resize(width);
	});
}


function colapseAll(){
	if(active && active.id != "splash"){
		staticOrder.splice(0,0,active);
		active = null;
	}
	for(var b = 0; b < staticOrder.length; ++b){
		staticOrder[b].setOrder(b, staticOrder.length);
	}
}

function makeMain(currentEvent){
	var templength = staticOrder.length;
	for(var a = 0; a < templength; ++a){
		if(this == staticOrder[a].parent){
			//retrive and remove the new active element
			var newActive = staticOrder[a];
			staticOrder.splice(a,1);

			//if there is an active one add it back to the list
			if(active && active.id != "splash"){
				staticOrder.splice(0,0,active);
			}

			//resize the new active element
			newActive.makeBig();
			active = newActive;

			//this resizes all the other elements to their right postion
			for(var b = 0; b < staticOrder.length; ++b){
				staticOrder[b].setOrder(b, staticOrder.length);
			}
			a = 999;
		}
	}
	company.hide();
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
		parentNode.style.left = - newWidth;
		locWidth = newWidth;
	}

	function enableTransitions(){
		if(!transition){
			with(parentNode.style){
				transition = "left 1s, width 1s";
				MozTransition = "left 1s, width 1s";
				WebkitTransition = "left 1s, width 1s";
				OTransition = "left 1s, width 1s";
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
	var activeMain = findChildId(content,"main");
	var activeContainer = activeMain.parentNode;
	var toArchiveButton = findChildId(activeMain,"archiveButton");
	var toActiveButton = findChildId(activeContainer,"activeButton");

	var parentEventListener;

	toArchiveButton.addEventListener("click",function(){
		console.log(content);
		with(content.style){
			left = -localWidth;
		}
	});

	toActiveButton.addEventListener("click",function(){
		with(content.style){
			left = 0;
		}
	});


	//meta data...
	this.id = this.parent.id;
	var order = order;
	var totalNumbOfEl = totalNumbOfEl;
	this.presenting = false; //to tell if it's big or not
	var localWidth,localHeight;
	var transition = false;

	setTimeout(enableTransitions,1);

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
				left = newWidth - ((order+1)*50);
				zIndex = 2;
			}
		}
		with(content.style){
			width = newWidth*2;
			height = newHeight;
		}
		with(activeContainer.style){
			width = newWidth*1.3; //this makes the left nav for 30%
		}
		with(activeMain.style){
			width = newWidth;
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

	this.setOrder = function(newOrder, newtotalNumbOfEl){
		order = newOrder;
		totalNumbOfEl = newtotalNumbOfEl;
		if(this.presenting){ 						//when we are dealing with the old preseting object we got to put it to the left and then bring it in

			this.parent.style.left = -localWidth;	//sliding off the left
			this.presenting = false;				//no longer presenting
			setTimeout(function(){					//once off screen we disable it and reorganize the elements
				for(var b = 0; b < staticOrder.length; ++b){
					disableTransitions();
					staticOrder[b].setOrder(b, staticOrder.length);
				}
			},1000);
		}
		else {
			with(this.parent.style){
				left = localWidth - ((order+1)*50);
				zIndex = 2;
				width = "50px";
			}
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
					staticOrder[order].setOrder(order,totalNumbOfEl)
				},1000);
			}
		}
	}

	this.outEnableTrans = function(){
		enableTransitions();
	}
	function enableTransitions(){
		if(!transition){
			with(parentNode.style){
				transition = "left 1s, width 1s";
				MozTransition = "left 1s, width 1s";
				WebkitTransition = "left 1s, width 1s";
				OTransition = "left 1s, width 1s";
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
