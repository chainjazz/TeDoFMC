console.log("\n===> FMC loaded");

var fpanFMC = function (ents, cdu) {
	// private fields
	
	// public fields
	this.entPtr = 0;
	this.entPagePtr = 0;
	this.es = ents;
	this.cdu = cdu;
	this.nEnts = this.es.length;
	// constructor
	
}

fpanFMC.prototype.selEnt = function(entid, pagedelta) {	
	var nPages = 0;
	var entdelta = 0;
		
	nPages = this.es[entid].pages.length;
	this.entPtr = entid;
	
	this.entPagePtr += pagedelta;
	entdelta = 
		this.entPagePtr < 0 ? -1 :
		this.entPagePtr > nPages - 1 ? 1 :
		0;
	this.entPagePtr = 
		this.entPagePtr < 0 ? 0 :
		this.entPagePtr > nPages - 1 ? nPages - 1 : 
		this.entPagePtr;
	this.entPtr += entdelta;
	this.entPtr = 
		this.entPtr < 0 ? 0 :
		this.entPtr > this.nEnts - 1 ? this.nEnts - 1 :
		this.entPtr;
	this.entPagePtr = this.entPtr != entid ? 0 : this.entPagePtr;
			
	this.es[this.entPtr].fnRunPage(this.entPagePtr.toString());
};

fpanFMC.prototype.fnExec = function(page) {
	var pagedelta = Math.trunc((2 * (7-page)) / 6 - 1);
	this.selEnt(this.entPtr, pagedelta);
};

fpanFMC.prototype.cbCduSelFn = function(parid) {
	var me = this;
	var cbrun = 0;
	
	cbrun = function() { me.fnExec(parid); };
	cbrun();
	this.cdu.parseEntity(this.es, this.entPtr, this.entPagePtr);
};

fpanFMC.prototype.cbCduInput = function(parid, v) {
	var entPar = this.es[this.entPtr].pages[this.entPagePtr].data[parid-2];
	
	switch(typeof(entPar.v)) {
		case "number":
			entPar.v = Number(v);
			break;
		default:
			entPar.v = v;
	}
};

