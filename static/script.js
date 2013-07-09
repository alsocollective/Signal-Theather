
var myOptions = {
	"containerOfEverything": 	"almightyParent", 	//this is and ID the top levl object, there can only be one with
	"classOfCreationMark": 		"content", 			//this a Class that defines element to create a new slide object from them
	"idOfSpash": 				"splash",			//the splash page, don't really need to define this anymore
	"idOfContent": 				"company",  		//the ID of div that will contain the company info
	"idOfContentButton": 		"companyButton",	//the ID of button for the company
	"sizeOfButtons": 			25, 				//the width of the side panels
	"slideTimmer": 				1000,				//Genearl speed of the site
	"slideTimmerTransition": 	"1s",				//for compatibility write the same as above just in seconds
	"secondTransition": 		10, 				//amount of time before comming back in from the right
	"archiveNavWidth": 			200, 				//keep this as the same width of the archive Nav
	"randomButtonColors": 		true,				//this was for the dev of it...
	"hardRight": 				"hard"				//how the slides go to the right
};


window.onload = function(){
	var sliders = SliderMain(myOptions);
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

function AllWithClassName(inThisElement,className){
	var children = inThisElement.childNodes;
	var out = [];
	for(var a = 0; a < children.length; ++a){
		if(children[a].nodeType ==1){
			if(children[a].className == className){
				console.log(children[a]);
				out.push(children[a]);
			}
			var lower = AllWithClassName(children[a],className);
				for(var b = 0; b < lower.length; ++b){
					out.push(lower[b]);
				}
		}
	}
	return out;
}

function SliderMain(options){
	var staticOrder = [];		//side bar items
	var active;
	var newHidden 	= null;
	var hidden 		= null;
	var root 		= document.getElementById(options["containerOfEverything"]);
	var width 		= root.offsetWidth;
	var height 		= root.offsetHeight;
	var company 	= new companyObj(document.getElementById(options["idOfContent"]),document.getElementById(options["idOfContentButton"]));
	var staticfull 	= true;


	company.resize(width);

	//find the elements in the parent and make them into blocks
	var elements;
	if (!document.getElementsByClassName) {
		elements = AllWithClassName(root,options["classOfCreationMark"])
	} else {
		elements = document.getElementsByClassName(options["classOfCreationMark"]);
	}
	for(var a = 0; a < elements.length; ++a){
		staticOrder[a] = (new block(elements[a],a, elements.length));
		staticOrder[a].setSize(width,height);
		if(options["randomButtonColors"]){
			staticOrder[a].makeColorRandom();
		}
	}


	if (!window.addEventListener) {
		window.onresize = function(){
			width = root.offsetWidth;
			height = root.offsetHeight;
			for(var a = 0; a < staticOrder.length; ++a){
				staticOrder[a].setSize(width,height);
			}
			if(active && active.id != options["idOfSpash"]){
				active.setSize(width,height);
			}
			company.resize(width);
			rearangeNav("hard");
		}
	}
	else {
		window.addEventListener("resize",function(){
			width = root.offsetWidth;
			height = root.offsetHeight;
			for(var a = 0; a < staticOrder.length; ++a){
				staticOrder[a].setSize(width,height);
			}
			if(active && active.id != options["idOfSpash"]){
				active.setSize(width,height);
			}
			rearangeNav("hard");
			company.resize(width);
		});
	//Resize
	}

	function colapseAll(){
		if(!hidden){
			newHidden = active;
			hideHidden("right");
			active = null;
			console.log("collapse all");
		}
	}

	function makeMain(currentEvent){
		if(!hidden){
			for(var a = 0; a < staticOrder.length; ++ a){ //find and make click element main
				if(staticOrder[a].id == currentEvent){
					if(active && active.id != options["idOfSpash"]){
						newHidden = active;
						hideHidden();
					}
					active = staticOrder[a];
		 			staticOrder.splice(a,1);
					rearangeNav(options["hardRight"]);
					active.setupToBeMain();
				}
			}
			company.hide();
		}
	}

	function hideHidden(direction){
		if(newHidden){
			newHidden.callToActive();
			newHidden.hide(direction);
			hidden = newHidden;
			newHidden = null;
			setTimeout(returnHidden,options["slideTimmer"]);
		} else {
			console.log("no new hidden");
		}
	}

	function returnHidden(){
		if(hidden){
			hidden.moveToHiddenPlace();
			setTimeout(function(){
				staticOrder.splice(0,0,hidden);
				rearangeNav();
				hidden = null;
			},options["secondTransition"]);
		} else {
			console.log("hidden doesn't exist");
		}
	}

	function rearangeNav(style){
		if(style == "hard"){
			for(var a =0; a < staticOrder.length; ++a){
				staticOrder[a].bringToLocationHard(a);
			}
		} else {
			for(var a =0; a < staticOrder.length; ++a){
				staticOrder[a].bringToLocation(a);
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

		if (!buttonEl.addEventListener) {
			buttonEl.attachEvent("onclick", toggle);
		}
		else {
			buttonEl.addEventListener("click",toggle);
		}

		function toggle(){
			if(ondisplay){
				parentNode.style.left = -locWidth;
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

		this.resize = function(newWidth){
			locWidth = newWidth;
			parentNode.style.display = "block";
			if(!ondisplay){
				parentNode.style.left = - locWidth;
			}
		}

		function enableTransitions(){
			if(!transition){
				with(parentNode.style){
					transition = "left "+options["slideTimmerTransition"]+", width "+options["slideTimmerTransition"];
					MozTransition = "left "+options["slideTimmerTransition"]+", width "+options["slideTimmerTransition"];
					WebkitTransition = "left "+options["slideTimmerTransition"]+", width "+options["slideTimmerTransition"];
					OTransition = "left "+options["slideTimmerTransition"]+", width "+options["slideTimmerTransition"];
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
		var navPanel = findChildId(content,"archiveNavBar");
		var archiveMain = findChildId(content,"archive");
		var inActive = true;

		//meta data...
		this.id = this.parent.id;
		var localId = this.parent.id;
		var order = order;
		var orderPlus = order + 1;
		var totalNumbOfEl = totalNumbOfEl;
		this.presenting = false; //to tell if it's big or not
		var localWidth,localHeight;
		var transition = false;

		setLisenter();
		setTimeout(enableTransitions,1);

		this.makeColorRandom = function(){
			content.style.backgroundColor = "#"+(Math.floor(Math.random()*999));
		}

		//sliding over to the archive area and back
		if (!toActiveButton.addEventListener) {
			toActiveButton.attachEvent("onclick",toActive);
			toArchiveButton.attachEvent("onclick",toArchive);
		} else {
			toActiveButton.addEventListener("click",toActive);
			toArchiveButton.addEventListener("click",toArchive);
		}
		function toActive(){
			inActive = true;
			with(content.style){
				left = 0;
			}
		}
		function toArchive(){
			inActive = false;
			with(content.style){
				left = -localWidth;
			}
		}
		this.callToActive = function(){
			toActive();
		}

		this.setSize = function(newWidth,newHeight){
			localWidth = newWidth;
			localHeight = newHeight;

			if(!this.presenting){
				with(parentNode.style){
					left = (newWidth - (orderPlus*options["sizeOfButtons"]));
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
				left = 0;
			}
			with(navPanel.style){
				width = options["archiveNavWidth"];
				left = newWidth + "px";
			}
			with(archiveMain.style){
				width = newWidth-options["archiveNavWidth"];
			}
			if(!inActive){
				with(content.style){
					left = -newWidth;
				}
			}
		}

		function setLisenter(){
			if (!parentNode.addEventListener) {
				parentNode.attachEvent("onclick",callMain);
				console.log("added Event");
			} else {
				parentNode.addEventListener("click",callMain);
			}
		}

		function callMain(){
			console.log(localId);
			makeMain(localId);
		}

		function removeListener(){
			if(!parentNode.removeEventListener){
				parentNode.detachEvent('onclick',callMain);
			} else {
				parentNode.removeEventListener("click",callMain);
			}
		}

		this.setupToBeMain = function(){
			this.presenting = true;
			enableTransitions();
			removeListener();
			with(this.parent.style){
				zIndex = 1;
				left = "0px";
				width = "100%";
			}
		}

		this.bringToLocation = function(newOrder){
			if(newOrder == 0 || newOrder){
				order = newOrder;
				orderPlus = newOrder + 1;
			}
			enableTransitions();
			with(parentNode.style){
				left = localWidth - ((orderPlus)*options["sizeOfButtons"]);
				zIndex = 2;
				width = options["sizeOfButtons"]+"px";
			}
		}

		this.bringToLocationHard = function(newOrder){
			if(newOrder == 0 || newOrder){
				order = newOrder;
				orderPlus = newOrder + 1;
			}
			disableTransitions();
			with(parentNode.style){
				left = localWidth - ((orderPlus)*options["sizeOfButtons"]);
				zIndex = 2;
				width = options["sizeOfButtons"]+"px";
			}
		}

		this.hide = function(direction){
			enableTransitions();
			if(direction && direction =="right"){
				this.parent.style.left = localWidth;	//sliding off the right
			} else {
				this.parent.style.left = -localWidth;	//sliding off the left
			}
		}

		this.moveToHiddenPlace = function(){
			disableTransitions();
			setLisenter();
			this.parent.style.left = localWidth;
		}

		this.basicOrder = function(newOrder){
			order = newOrder;
			orderPlus = newOrder + 1;
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
					transition = "left "+options["slideTimmerTransition"]+", width "+options["slideTimmerTransition"];
					MozTransition = "left "+options["slideTimmerTransition"]+", width "+options["slideTimmerTransition"];
					WebkitTransition = "left "+options["slideTimmerTransition"]+", width "+options["slideTimmerTransition"];
					OTransition = "left "+options["slideTimmerTransition"]+", width "+options["slideTimmerTransition"];
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
}