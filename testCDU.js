// MAIN SCRIPT

var inAlphas = 0;
var inNumers = 0;
var inButtns = 0;
var testCDU = 0;
var vezdb = 0;

// get markup objects
inAlphas = document.getElementById("groupAlphas");
inNumers = document.getElementById("groupNumers");
inButtns = document.getElementById("groupLineButts");

// init AJAX
vezdb = new HttpThing("post", "localhost");

// init SVG-CDU
testCDU = new svgCDU();

// attach DOM events
inAlphas.addEventListener("mousedown", function (e){testCDU.cbInput(e);}, true);
inNumers.addEventListener("mousedown", function (e){testCDU.cbInput(e);}, true);
inButtns.addEventListener("mousedown", function (e){testCDU.cbInput(e);}, true);
	
// before users start clicking
testCDU.cdu.parseEntity(testCDU.fmc.es, testCDU.fmc.entPtr, testCDU.fmc.entPagePtr);
testCDU.rdrw();