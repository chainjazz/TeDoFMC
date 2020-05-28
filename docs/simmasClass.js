function SimMas(k) {
	fpanEnt.call(this); // inheritance, basically, "extends fpanEnt"
	
	this.title = "RC4 CIPHER";
	this.pages = new Array( new FpanPage("SETUP"), new FpanPage("EXEC") );	
	this.pages[0].data = new Array( // don't push, otherwise parameters add up
				new fpanEntPar("message", "hi,there"),
				new fpanEntPar("key", k)
	); // create a class method for this
	
	this.pages[1].data = new Array(
			new fpanEntPar("direction", 0), 
			new fpanEntPar("state", "")
	);
	
	// setup private references to entity parameters
	this.indat = this.pages[0].data[0];
	this.k = this.pages[0].data[1];	
	this.direct = this.pages[1].data[0];
	this.bindat = this.pages[1].data[1];
	
}

SimMas.prototype = Object.create(fpanEnt.prototype); // inherit methods
SimMas.prototype.constructor = SimMas; // but don't inherit constructor

SimMas.prototype.fnRunPage = function (page) {
	switch(page) {
		case "0": {
			this.initSim();
		}
		
		case "1": {
			this.opSim();
		}
		
		default: {
			;
		}
	}
}

SimMas.prototype.initSim = function() {
		
			
		// do some stuff, I don't know
}

SimMas.prototype.opSim = function() {	
	var teedo = new teedos(
		this.indat.v, this.k.v, 20
	);
	
	// run (usually an entity with output only)
	this.bindat.v = this.indat.v;
	teedo.apply(((this.direct.v)) * 10); // teedo, teedos, chetaa, cheetos...
	this.bindat.v = String(teedo.processed);
	this.indat.v = this.bindat.v;
	this.direct.v = (this.direct.v + 1) % 2; // switch cipher dir (0-10-0-10...)
	
}