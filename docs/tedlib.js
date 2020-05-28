// assymetric key (RCA) algorithm

console.log("\n\n===>tedlib loaded");

var ted_asskey = function (p1, p2) {
	// OO javascript hints
	//		function equivalent to class/instance/object
	//		function.prototype equivalent to abstract class
	//		var x - private field/function
	//		this.x - public field/method
	//		function fn() { fn.staticvar } - static variable (this.staticvar?)
	//		var id = function is equivalent to function id (?)
	//		function.prototype.staticFunction - "static" function
	//		function.prototype.staticProp - "static" property
	
	
	// fields
	this.n = 0; // modulus (public) = prime * prime [* prime...?]
	this.phin = 0; // phi(n) = phi(p1) * phi(p2)
	this.k = 0; // exponent factor (private)
	this.e = 0; // exponent factor (public)
	this.d = 0; // private key (private)
	this.pseq = new Array(); // prime sequence
	
	// methods
	this.grecodi = function(a, b, k) { // basic helper function: Euclid's GCD
		// this was the first algorithm in the BBC series by M duSautoy
		this.grecodi.r = 0;	// this shitty prefix is because this is 
		this.grecodi.a = a; // a freakin' anonymous function, eg. not
		this.grecodi.b = b; // a function object 
		this.grecodi.k = k; // how to avoid reiniting "static" var; pass it
							// recursively (least expensive?)
		
		this.grecodi.k++;	// not really needed, dbg var, although
							// it may be used to find coprimes, etc.
		this.grecodi.r = this.grecodi.a % this.grecodi.b;
				
		if (this.grecodi.r != 0)
			this.grecodi(this.grecodi.b, this.grecodi.r, this.grecodi.k);
		
		return this.grecodi.b;
	}
	
	this.modpow = function (base, exp, mod) { // mem-efficient modular exponentiation
		var c,e;
		
		c = 1; // result (cumulative)
		e = 0; // counter
		
		do { // while e' < e (exp)
			e++;
			c = (base * c) % mod; // fake the exponentiation b^e mod mod
				// since modulo is always performed, numbers never grow
				// too much; compare with most math library pow(a,b)
		} while (e < exp);
		
		return c;
	}
	
	this.phi = function(a_prime) { // PHI function, number of prime factors
		var n;
		
		n = a_prime;
		
		/*
		 *for (var x = n; x > 0; x--) {
		 *	; // general case, see Euler 
		 *}
		 */
		
		return n - 1; // special case, phi(prime) = prime - 1
	};
	
	this.find_e = function () { // public key part
		var e;
		
		e = 0;
		
		for (e = 3; e < 21; e+=2) {
			if(this.phin % e > 0)
				break;
		}
		
		this.e = e;	
	}
	
	this.find_d = function () { // private key
		var d, k, e;
		
		e = 0; // temp exponent
		d = 0; // will be d
		k = 0; // will be k
		
		for (k = 1; k < 21; k++) {
			e = k * this.phin + 1;
			
			if (e % this.e == 0)
				break;	
		}
		
		this.d = e / this.e;
		this.k = k;
	};
	
	this.apply_encrypt = function(msg_plain, pub_e, pub_n) { // a one way function (LOCK)
		var m; // take a number
		var e; // raise it to some (public) exponent (public key)
		var n; // divide by the (random) modulus (public key)
		var c; // output the remainder
		
		m = msg_plain;
		e = pub_e;
		n = pub_n;
		
		c = this.modpow(m, e, n);	
		
		return c;
	}
	
	this.apply_decrypt = function(msg_locked) {
		var m; // unlocked
		var c; // locked
		
		c = msg_locked;
					
		m = this.modpow(c, this.d, this.n);	

		return m;
	}
	
	// 	constructor {		
	this.pseq.push(p1, p2);	
		
	// 		calc n, public key part
	this.n = 1;
	
	for (var x = 0; x < this.pseq.length; x++)
		this.n *= this.pseq[x];	
	
	// 		calc phi[n]
	this.phin = 1;
	
	for (var x = 0; x < this.pseq.length; x++)
		this.phin *= this.phi(this.pseq[x]);
			
	// 	} constructor
}


///////////////////////////
// ===== SCRIPT START =====

// symmetric
/* var sym_alice;
 * var sym_bob;
 * var level_all = 22;
 * var sym_key = "abc";
 * var msg_str = "Randomly";
 */

// asymmetric
var asy_alice; 
var asy_bob;
var msg_num = 0;
var msg_num_in_transit = 0;
var msg_num_de = 0;

//		stats
var stat_rde = 0; // decryption success ratio
var stat_swt = 0; // accidental sniffing possibility
var stat_nro = 0; // exponentiation overlap ratio
var stat_inf = 0; // environment number range exceeded

////////////////
// ASSYMETRIC //
////////////////
asy_alice = new ted_asskey(53,59);
asy_bob = new ted_asskey(0, 0);

console.log("GCD(1071,462) = " + asy_alice.grecodi(1071, 462, 0) + ", " +
	asy_alice.grecodi.k + " recursions.");

// generate private/public key pair for Alice
asy_alice.find_e();
asy_alice.find_d();

// start transaction
if (asy_alice.k == 0)
	console.log("k could not be found, stopping.");
else { // with debug info
	for (var oldchk = 0, chk = 0, x = 0; x < 256; x++ ) {		
		// encrypt with public key, then decrypt with private key
		msg_num = x;	
		msg_num_in_transit = asy_bob.apply_encrypt(msg_num, asy_alice.e, asy_alice.n);
		msg_num_de = asy_alice.apply_decrypt(msg_num_in_transit);
		
		// calc stats
		oldchk = chk; // out-of-range check
		chk = Math.pow(msg_num_in_transit, asy_alice.d); // out-of-range check	
		stat_swt += msg_num == msg_num_in_transit ? 1 : 0; // negative
		stat_rde += msg_num_de == msg_num ? 1 : 0; // positive
		stat_nro += chk > oldchk ? 1 : 0; // negative
		stat_inf = msg_num_de == "Infinity" ? "" : "not";
	}
	
	console.log("Input [0-255], prime factors [" +
		asy_alice.pseq[0] + "][" + asy_alice.pseq[1] +
		"], public key [" +
		asy_alice.n + "\t" + asy_alice.e +
		"]\nStatistics:\n\n" +
		" Decryption success rate: " + Math.floor((stat_rde / 256) * 100) + "%\n" +
		" Possibility of sniffing: " + Math.floor((stat_swt / 256) * 100) + "%\n" +
		" Possible number overlap: " + Math.floor((stat_nro / 256) * 100) + "%\n" +
		" Implementation int range " + stat_inf + " exceeded."
	);
}

////////////////
// SYMMETRIC
/* sym_alice = new teedos(msg_str, sym_key, level_all);
 * sym_bob = new teedos(msg_str, sym_key, level_all);
 *
 * console.log("Symmetric Alice says: " + sym_alice.signal);
 *
 * sym_alice.apply(0);
 * sym_bob.signal = sym_alice.processed;
 * sym_bob.apply(10);
 *
 * console.log("Symmetric Bob says: " +  sym_bob.processed);
 */