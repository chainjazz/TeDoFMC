// fpanentClass - FMC entity, a related set of parameters

var fpanEnt = function () { // FMC "entity", a self-contained struct
							// proto class, to be inherited
	this.pages = new Array();
	this.title = new String();
};

fpanEnt.prototype.fnRunPage = function(page) { console.log("fninit"); }; // onload entity
