console.log("\n==> CDU loaded");

var fpanCDU = function() { // the cdu class (not fmc) constructor
	
	// private fields
	var me = this;
	
	// publc fields
	this.scr = new Array(); 
	this.scratch = "";
	this.charset = new String("zyxwvutsrqponmlkjihgfedcba_0_987654321");
	this.emptyline = String("             "); // 13 chars max per line
	
	
	// init screen
	for (var x = 0; x < 38; x++) // reserve memory for cdu screen
		this.scr.push(new String("-123.4/ABCDEF"));
	
	// init scratchpad	
	this.scratch = this.emptyline;
};

// private methods (not really)
fpanCDU.prototype.fromCharCode = function (pos) {
	return String(this.charset.charAt(pos - 5));
};

fpanCDU.prototype.asciiArm = function(v) {
	var asciiarmor = new String("");
	
	for (var x = 0; x < v.length; x++) {
		if (v.charCodeAt(x) < 32 || v.charCodeAt(x) > 32+26+26+32)
			asciiarmor += "*";
		else
			asciiarmor += v.charAt(x);
	}
	
	return asciiarmor.toString();		
};

// public methods
fpanCDU.prototype.setScreen = function(l, a, b, o) {
	// l=line;a,b=strings;o=order
	var apad = 0; // "a" padded to 13
	var bpad = 0; // "b" padded to 13
	var blank = this.emptyline;
	
	if (a == "" && b == "") { // if empty, then clear
		apad = bpad = blank;
	}	
	
	else { // pad values with spaces (String.slice(-n) variant)
		apad = new String((blank + a).slice(0 - blank.length));
		bpad = new String((blank + b).slice(0 - (blank.length - a.length)));
		bpad = new String((bpad.valueOf() + blank).slice(0, blank.length));
	}
	
	this.scr[l] = apad.toUpperCase().valueOf();
	
	if (b != "") // if smallfont string not empty (empty != blank), that too
		this.scr[l - 1] = bpad.toUpperCase().valueOf();
};

fpanCDU.prototype.getScreen = function(l) {
	//console.log(this);
	return this.scr[l].toString();
};

fpanCDU.prototype.toMerged = function(a, b) {
	var mergedString = "";
	// TODO: not gonna work, needs to return two strings
	// (well why not, but it looks more like a class candidate)
	
}

// calculate correct screen array index (index * 3 + offset)
// (for clearer code, maybe should be part of a special CDUString class)
fpanCDU.prototype.scri = function(index, subindex) {
	var i = index - 1; // 1-based
	var j = 0;
	
	switch (subindex) {
		case "t": //for title
			j = 2;			
			break;
		case "b": //for big-font
			j = 1;
			break;
		case "s": //for small-font
			j = 0; // actually, no need for this, setScreen handles small font
			// break;
		default:
			j = 0;
			break;	
	}
	
	return i * 3 + 1 + j; // 1 means "do not count scratchpad"; offset can be set
							// by multiplying "index" in the call
}


fpanCDU.prototype.parseInput = function(gid, scancode, cbi, cbf) {
	var lineId = 0; // screenBuffer line id
	var lineVal = String("");
	var bid = scancode; // NOTE: scancodes start from 1!!!
	var blank = this.emptyline; // shorthand for emptyline
	var pad = this.scratch; // shorthand for scratchpad buffer
	
	if (gid == "groupLineButts") { // maybe "switch" would be more adequate?
		bid = scancode;
		
		if (bid == 1 || bid == 7)
			// pass to function callback
			cbf(bid);
		else {
			lineId = this.scri(bid, "b"); // per spec, changable values are big font
			lineVal = String(this.getScreen(lineId)); // yo mo fo, getScreen is a FN!!!
				
			if (pad == blank)
				pad = lineVal;
			else if (lineVal != blank) { // IMPLICIT: scratch not blank
				// pass to input callback
				cbi(bid, pad);
				// scratchpad to line
				lineVal = pad;
				// clear scratchpad (TODO - make this a function)
				pad = blank; // clear scratchpad after transfer				
			}
		}
	}
	
	else if (gid == "groupAlphas" || gid == "groupNumers") {
		// numers = alphas + 30
		bid = gid == "groupNumers" ? scancode + 30 : scancode;
		
		switch(bid) {
			case 1:	// CLR		
				pad = String(
					pad.slice(0, pad.length - 1));
				break;
			case 31: // +-
			case 33: // that weird button
				break;
			// todo: del, sp, "/"
			default:
				if (bid > 0 && bid < 43)
					pad += this.fromCharCode(bid);
		}
	}
	// centralized update of screen from local vars
	this.setScreen(lineId, lineVal, "", 0);
	this.setScreen(0, pad, "", 0);
	// update global scratchpad field
	this.scratch = pad; 
};

// parse fpan entity for display
fpanCDU.prototype.parseEntity = function(ents, i, p) {
	var objtre = ents[i].pages[p]; // trenutni objekat na displeju
	var objpre = ents[i].pages[p-1] ? ents[i].pages[p-1] : null;// prethodni objekat
	var objsle = ents[i].pages[p+1] ? ents[i].pages[p+1] : null; // sledeci objekat
	var entpre = ents[i-1] ? ents[i-1] : null; // prethodni entitet
	var entsle = ents[i+1] ? ents[i+1] : null; // sledeci entitet
	
	// clear screen, except the scratchpad
	for (var x = 1; x < this.scr.length; x++)
		this.setScreen(x, this.emptyline, "", 0);
	
	// parse entity title for display
	this.setScreen(this.scri(13,"none"), ents[i].title, "", 0);
	
	// parse entity parameters for display
	for (var x = 0; x < objtre.data.length;  x++) {
		this.setScreen(this.scri(x + 2, "t"), objtre.data[x].title, "", 0);
		this.setScreen(this.scri(x + 2, "b"), this.asciiArm(objtre.data[x].v.toString()), " ", 0);
	}

	// parse prev-next strings
	this.setScreen(this.scri(7, "b"), // offset to value field - big font
		objpre ? "<" + objpre.title :
		entpre ? "<" + entpre.title : 
		"", 
		"", 0);
	this.setScreen(this.scri(1, "b"), // offset to value field - big font
		objsle ? objsle.title + ">" :
		entsle ? entsle.title + ">" : 
		"" ,
		"", 0);
};

