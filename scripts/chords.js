

function Chord(name, chord) {
	this.name = name;

	var fingerChars = chord.split('');
	this.fingers = [];
	
	for (var i = 0; i < fingerChars.length; i++) {
		if (fingerChars[i] == 'x')
			fingers.push(null);
		else if (!isNaN(fingerChars[i]))
			fingers.push(parseInt(fingerChars[i], 10));
		else
			throw new Error("Unknown character '" + fingerChars[i] + "' in chord '" + chord + "'");
	}
}

Chord.prototype.getWidth = function() {
	var fingersPlayed = $.grep(this.fingers, function(finger) { return finger != null });
	return Math.max.apply(Math, fingersPlayed) - Math.min.apply(Math, fingersPlayed) + 1;
};


function ChordRenderer(canvas) {
	this.canvas = canvas;
	this.fingerRadius = 5;
	this.stringCount = 4;
	this.stringWidth = 1;
}


ChordRenderer.prototype.renderChord = function(chord) {
	var context = this.canvas.getContext('2d');
	this._renderGrid(context);
	
	var height = this.canvas.height - this.fingerRadius;
	var fretWidth = 30;
	context.fillStyle = "rgb(0,0,0)";

	$.each(chord.fingers, function(index, finger) {
		var fingerX = this.
	});
};

ChordRenderer.prototype._renderGrid = function(context) {
	var x = this.fingerRadius;
	var spaceBetweenStrings = (this.canvas.height - 2 * this.fingerRadius - this.stringCount * this.stringWidth)
							/ this.stringCount;
							
	for (var i = 0; i < this.stringCount; i++) {
		context.moveTo(x, 0);
		context.lineTo(x, this.canvas.width);
		x += spaceBetweenStrings;	
	}
};