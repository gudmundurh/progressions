

function Chord(name, chord) {
	this.name = name;

	var fingerChars = chord.split('');
	this.fingers = [];
	
	for (var i = 0; i < fingerChars.length; i++) {
		if (fingerChars[i] == 'x')
			this.fingers.push(null);
		else if (!isNaN(fingerChars[i]))
			this.fingers.push(parseInt(fingerChars[i], 10));
		else
			throw new Error("Unknown character '" + fingerChars[i] + "' in chord '" + chord + "'");
	}
}

Chord.prototype.getWidth = function() {
	var fingersPlayed = $.grep(this.fingers, function(finger) { return finger != null });
	return Math.max.apply(Math, fingersPlayed) - Math.min.apply(Math, fingersPlayed) + 1;
};

String.prototype.startswith = function(prefix) {
    return this.substring(0, prefix.length) === prefix;
};

String.prototype.endswith = function(suffix) {
    return this.substring(this.length - suffix.length - 1, this.length) === suffix;
};

Chord.prototype.getFormattedName = function() {
    if (this.name.charAt(this.name.length-1) == '#')
        return this.name.substring(0, this.name.length-1) + '<sup>#</sup>';
    else if (this.name.charAt(this.name.length-1) == 'b')
        return this.name.substring(0, this.name.length-1) + '<sub>b</sub>';
    else
        return this.name;
};


function ChordRenderer(canvas) {
	this.canvas = canvas;
	this.fingerRadius = 8;
	this.stringCount = 4;
	this.stringWidth = 1;
	this.spaceBetweenStrings = Math.floor(
	        (this.canvas.height - 2 * this.fingerRadius - this.stringCount * this.stringWidth) / (this.stringCount-1));
	this.fretWidth = this.spaceBetweenStrings;
	this.leftMargin = 10;
}


ChordRenderer.prototype.renderChord = function(chord) {
	var context = this.canvas.getContext('2d');
	context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	this._renderGrid(context);
	
	var This = this;
    var y = this.fingerRadius + (this.stringWidth + this.spaceBetweenStrings) * (this.stringCount - 1);
    
	$.each(chord.fingers, function(index, finger) {
	    if (finger == null) {
	        // TODO: Draw x at the left margin
	    } else if (finger != 0) {
	        var x = This.leftMargin + This.fretWidth * (finger - .5);
	        context.beginPath();
	        context.arc(x, y, This.fingerRadius, 0, 2*Math.PI, true);
	        context.fill();
	    }
	    
		y -= This.stringWidth + This.spaceBetweenStrings;
	});

};

ChordRenderer.prototype._renderGrid = function(context) {
	var y = this.fingerRadius;
	
	// Draw the strings
	for (var i = 0; i < this.stringCount; i++) {
        context.beginPath();
		context.moveTo(0, y);
		context.lineTo(this.canvas.width, y);
		context.stroke();
		y += this.spaceBetweenStrings + this.stringWidth;	
	}
	
	var fretHeight = (this.spaceBetweenStrings + this.stringWidth) * (this.stringCount - 1);
	
	// Draw the fret-lines
	var x = this.leftMargin;
	while (x < this.canvas.width) {
	    context.beginPath();
	    context.moveTo(x, this.fingerRadius);
	    context.lineTo(x, this.fingerRadius + fretHeight);
	    context.stroke();
	    x += this.fretWidth;
	}
	
	// Draw the nut
	context.rect(0, this.fingerRadius, this.leftMargin / 2, fretHeight);
	context.fill();
};