console.log("\n===> SVG-CDU loaded");

var svgCDU = function() {
	// private fields
	var me = this; // because in anon fns, this is not yet this ;)
	
	// public fields
	this.fpanEs = 0;
	this.cdu = 0;
	this.fmc = 0;
	
	// constructor (NOTE: new style - every function is only
	// 	a constructor; methods are defined globally in the module
	//	for the prototype
	
	this.fpanEs = new Array(
		new SimMas("asdfg"),
		new AsiMas(53,59));

	this.cdu = new fpanCDU();
	this.fmc = new fpanFMC(this.fpanEs, this.cdu);	
	this.fmc.entPtr = 0;
	// this.fmc.selEnt(this.fmc.entPtr, this.fmc.entPagePtr);	
};

// method definitions (per dev.moz recommendation)

// 		update screen from buffer
svgCDU.prototype.rdrw = function () { // in other words, commit to svg
	var outLines = document.getElementById("groupText"); // SVG OUTPUT TEXT NODES
	
	for (var x = 0; x < this.cdu.scr.length; x++) {
		if (x < outLines.children.length) // svg text node = scbuf value
			outLines.children[x].firstElementChild.textContent = 
				this.cdu.scr[x].toString();
	}
};

//		inputcallback
svgCDU.prototype.cbInput = function(e) { // callback for (mousedown)
	var arr = e.target; // the array (group of buttons)
	var el = e.target; // the element of array (button)
	var pca = Array.prototype.slice.call(arr.childNodes); // node to array
	var gid = String(""); // which array
	var me = this; // because in anon fns, this is not yet this (?)
	
	// the following finds the index of the clicked element
	// (an element within group with set id, whatever the top event target - it
	// depends on the graphical design, goes up until it resolves)	
	while(gid == "") { // find first g parent with id set (group)
		el = arr; // remember current node
		arr = arr.parentNode; // switch to parent
		
		if (arr.attributes.id && arr.nodeName == "g") { // if g with id
			gid = arr.attributes.id.nodeValue; // set gid to id			
		}
	}
		
	pca = Array.prototype.slice.call(arr.childNodes); // convert nodeList to Array	
	
	this.cdu.parseInput(
		gid, 
		Math.ceil(pca.indexOf(el) / 2),
		// 	trick to set "this" in a callback function
		//		wrap the callback DECLARATION in anon fn that calls the callback
		//		through a saved "this" pointer from the *surrounding context*
		// 		(e.g. "me"); anon fn must pass all params to the callback
		//	regardless of whether we are defining callbacks, or functions within		
		//	functions (which we should NOT per OO), anon fn always lose "this"
		//  but the side-effect is that you can set *this* in the surrounding
		// 	context, i.e., change this; same effect should be possible with .bind()
		// 	or .call() generics
		function(bid, v) {me.fmc.cbCduInput(bid, v);},
		function(bid) {me.fmc.cbCduSelFn(bid);}); // event detailed parse
	
	this.cdu.parseEntity(this.fmc.es, this.fmc.entPtr, this.fmc.entPagePtr);
	this.rdrw(); // update screen (only)
};