function AsiMas(p, q) {
	fpanEnt.call(this); // inheritance, basically, "extends fpanEnt"	
	
	this.title = "RSA CIPHER"
	this.pages = new Array( 
		new FpanPage("SETUP"), 
		new FpanPage("EXEC") );
	
	// todo: create a class method for this
	this.pages[0].data = new Array (
		new fpanEntPar("prime2", q), // !SECURITY! see Wikipedia(RSA)
		new fpanEntPar("prime1", p), // only one of these should be exposed
											// the other calculated
											// in order to ensure obfuscation
											// of cpu time taken to generate key
		new fpanEntPar("test gcd(,b)", 260),
		new fpanEntPar("test gcd(a,)", 30)
	);
	
	this.pages[1].data = new Array (
		new fpanEntPar("key", "----"),
		new fpanEntPar("primes", "--/--"),
		new fpanEntPar("Decryption", "----"),
		new fpanEntPar("Insecurity", "----"),
		new fpanEntPar("Inprecision", "----"),
		new fpanEntPar("===========", "----"),
		new fpanEntPar("Range exceed", "NO"),
		new fpanEntPar("GCD", 0)
	);
	
	this.q = this.pages[0].data[0];
	this.p = this.pages[0].data[1];
	this.gcda = this.pages[0].data[2];
	this.gcdb = this.pages[0].data[3];
	this.key = this.pages[1].data[0];
	this.primes = this.pages[1].data[1];
	this.stat_d = this.pages[1].data[2];
	this.stat_i = this.pages[1].data[3];
	this.stat_p = this.pages[1].data[4];
	this.stat_e = this.pages[1].data[6];
	this.stat_gcd = this.pages[1].data[7];
	
}

AsiMas.prototype = Object.create(fpanEnt.prototype); // inherit methods
AsiMas.prototype.constructor = AsiMas; // but don't inherit constructor

AsiMas.prototype.fnRunPage = function (page) {
	switch(page) {
		case "0": {
			this.initAsi();
		}
		
		case "1": {
			this.opAsi();
		}
		
		default: {
			this.initAsi();
		}
	}
}

AsiMas.prototype.initAsi = function() {
	// I don't know, do something
}

AsiMas.prototype.opAsi = function () {
	// private fields (right?)
	var asy_alice; // dummy, informational
	var asy_bob;	// dummy, informational
	var msg_num = 0;
	var msg_num_in_transit = 0;
	var msg_num_de = 0;
	//		stats
	var stat_rde = 0; // decryption success ratio
	var stat_swt = 0; // accidental sniffing possibility
	var stat_nro = 0; // exponentiation overlap ratio
	var stat_inf = 0; // environment number range exceeded
	
	// public fields
		
	// run (so now, it looks more like a class right?)
	asy_alice = new ted_asskey(this.p.v, this.q.v);
	asy_bob = new ted_asskey(0, 0);
	
	asy_alice.find_e(); // generate public key
	asy_alice.find_d(); // generate private key
	
	for (var oldchk = 0, chk = 0, x = 0; x < 256; x++ ) {	
		msg_num = x;	
		msg_num_in_transit = asy_bob.apply_encrypt(msg_num, asy_alice.e, asy_alice.n);
		msg_num_de = asy_alice.apply_decrypt(msg_num_in_transit);
		
		// calc stats
		oldchk = chk; 
		chk = Math.pow(msg_num_in_transit, asy_alice.d); 	
		stat_swt += msg_num == msg_num_in_transit ? 1 : 0; 
		stat_rde += msg_num_de == msg_num ? 1 : 0; 
		stat_nro += chk > oldchk ? 1 : 0; 
		stat_inf = msg_num_de == "Infinity" ? "YES" : "NO";
	}
	
	this.key.v = String(asy_alice.n + "-" + asy_alice.e);	 
	this.primes.v = String(asy_alice.pseq[0] + "/" + asy_alice.pseq[1]);
	this.stat_d.v = String(Math.floor((stat_rde / 256) * 100) + "%");
	this.stat_i.v = String(Math.floor((stat_swt / 256) * 100) + "%");
	this.stat_p.v = String(Math.floor((stat_nro / 256) * 100) + "%");
	this.stat_e.v = String(stat_inf);
	this.stat_gcd.v = String(asy_alice.grecodi(this.gcda.v, this.gcdb.v, 0) + "/" +
		asy_alice.grecodi.k);
}