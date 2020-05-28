var FpanPage = function (t) { // FMC "entity", a self-contained struct
							// proto class, to be inherited
	this.title = new String(t);
	// this.pgprev = new String(""); // this will be calculated on exec
	// this.pgnext = new String(""); // it is basically the title of the other page
	this.data = new Array();	
};