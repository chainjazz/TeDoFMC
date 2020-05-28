// teedolib.js
//
// library type script offering a single
//	symmetric cipher object
//	of type ARCFOUR-strengthened

console.log("\n\n\n\n===> Loading teedolib...");

var teedos = function (signal, key, cs2level) {
	this.signal = new String(signal) // input - data
	this.processed = new String(); 	// output buffer
	this.state = new Array(256); 	// algorithm "state"
	this.key = new String(key); 	// input - key
	this.iv = new String();			// key init vector (randomizer)
	this.i = 0;						// algorithm counter
	this.j = 0						// algorithm arithmetic register
	this.swap = 0					// algoirthm swap helper register
	this.level = cs2level;			// key parameter - obfuscation level
	
	// key setup (once per msg)
	//	a) init state array with int series
	// 	b) "shuffle" state using key
	//		for each in state
	//		1) j += state[i] + key[i % len(key)]
	//		2) swap state[i and j]
	//		after which clear i, j
	this.init = function (key, level) {
	// 	clear j
		this.j = 0;
		
	//	init state array
		for (var k = 0; k < 256; k++) {
			this.state[k] = k;
		}
		
		for (var k = 0; k < level; k++) { // CipherSaber-2 (safer)
			for (this.i = 0; this.i < 256; this.i++) {
			//		setup j
				this.j += this.state[this.i] 
					+ key.charCodeAt(
						this.i % (key.length)
					); this.j %= 256;
			//		swap state[i and j]
				this.swap = this.state[this.i]
				this.state[this.i] = this.state[this.j]
				this.state[this.j] = this.swap	
			}
		}

		//		clear i,j
		this.i = this.j = 0
	} // key setup function (once per message)
	
	//	encrypt/decrypt (SYMMETRIC OP!)
	//		for each plain-or-ciphertext "byte"
	//		a) increment i
	//		b) j += state[i]
	//		c) swap state[i and j]
	//		d) add state[i and j] (->n)
	//		e) output "in byte" XOR state[n]		
	this.sym = function (signal_offset) {
		
		for (var n = 0, k = signal_offset; k < this.signal.length; k++) {
		//			increment i
			this.i++; this.i %= 256;
		//			setup j
			this.j += this.state[this.i]; this.j %= 256;
		//			swap state[i and j]
			this.swap = this.state[this.i]
			this.state[this.i] = this.state[this.j]
			this.state[this.j] = this.swap
		//			add state[i and j]
			n = this.state[this.i] + 
				this.state[this.j]; n %= 256;
		//			output "in byte" XOR state[n]	
			this.processed += String.fromCharCode(this.state[n] ^
					this.signal.charCodeAt(k)); // not an "addition" operation
		} 
				
	} // symmetric encrypt/decrypt function
	
	this.initv = function () {
		var r = new String();
		
		for (var p, c, k = 0; k < 10; k++) {
			p = Math.floor(Math.random() * 256);
			c = String.fromCharCode(p);
			r += c.toString(); // not an "addition" operation
		}
		
		return r.toString();
	}
	
	this.apply = function (signal_offset) {
		this.iv = new String() // clear key init vector
		this.processed = new String(); // clear output		
		this.iv = this.initv();
		// implicit - if signal_offset = 0, do nothing
		// implicit - if signal_offset > 0, concatenate
		// implicit - if signal_offset = substring offset, do nothing
		//		WARNING: OBSCURE BEHAVIOUR
		this.processed += this.iv.substring(10, signal_offset);		
		this.init(this.key + 
			this.signal.substring(0, signal_offset) + 
			this.iv.substring(10, signal_offset), this.level); // setup key
		this.sym(signal_offset); // process
		this.signal = this.processed; // set input to result (flip op)
	}

}; // teedos Object

var testSignal = String( // CipherSaber-1 only
	"\x6f\x6d\x0b\xab\xf3\xaa\x67\x19\x03\x15\x30\xed\xb6\x77\xca\x74\xe0\x08\x9d\xd0" +
	"\xe7\xb8\x85\x43\x56\xbb\x14\x48\xe3\x7c\xdb\xef\xe7\xf3\xa8\x4f\x4f\x5f\xb3\xfd" 
); // decrypt test (key=asdfg, obfuscation level=1)

/* EXAMPLE
 *
 * var teedos = new teedos(
 *	"Test CipherSaber-a v2, sa multi-skremblovanjem", // test data
 *	"asdfg", // test key
 *	20); // obfuscation level
 *
 * teedos.apply(0);
 * teedos.apply(10);
 * teedos.apply(0);
 * teedos.apply(10);
 */
console.log("===> teedolib loaded successfully.")