var svg = document.getElementById("svggfx")

var svg_onmousedn = function(e) {
	console.log("SVG - " + 
		e.clientX.toString() + "x" +
		e.clientY.toString());
}

svg.addEventListener("mousedown", svg_onmousedn, false);