function HttpThing(m, i) {
	// private
	var me = this;
	// public
	this.msx = new XMLHttpRequest();
	this.m = m;
	this.i = i;
	
	this.msx.open(this.m, this.i, true);	
	this.msx.onreadystatechange = function() { me.cbRsc(); }; // callback, not method
}

HttpThing.prototype.cbRsc = function() {	
		switch(this.msx.readyState) {
			case 4:
				console.log("Done.");
			
				if (this.msx.status === 200)
					console.log("Done.");
				break;
			case 3:
				console.log("Loading response...");
				break;
			case 2:
				console.log("Sending query...");
				break;
			case 1: 
				console.log("Connecting...");
				break;
			default:
				break;
		}
}

HttpThing.prototype.up = function(d) {
	this.msx.send(d);
}

/* var req = new HttpThing();
 * var payload = ["foobar=what&hi"];
 * req.up(payload.toString());
 */
