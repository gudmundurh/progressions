

function ChordDrawingDecorator(chordForm, maxVisibleFrets)
{
    this.chordForm = chordForm;
    this.maxVisibleFrets = maxVisibleFrets;
}


ChordDrawingDecorator.prototype.getFingers = function() 
{
    return this.chordForm.getFingers();
}


ChordDrawingDecorator.prototype.getBaseFret = function()
{
	var fingersPlayed = $.grep(this.getFingers(), function(finger) { return finger != null });
	var highestFinger = Math.max.apply(Math, fingersPlayed)
	var lowestFinger = Math.min.apply(Math, fingersPlayed);
	var width = highestFinger - lowestFinger + 1;
	
	if (highestFinger <= this.maxVisibleFrets)
	    return 0;
	else if (width <= this.maxVisibleFrets)
	    return lowestFinger - 1;
    else
        throw new Error("getBaseFret: Not enough visible frets (" + this.maxVisibleFrets + ") for chord "
            + this.chordForm);
}

ChordDrawingDecorator.prototype.toString = function() 
{
    return this.chordForm.toString();
};



function ChordRenderer(canvas) 
{
	this.canvas = canvas;
	this.fingerRadius = 8;
	this.stringCount = 4;
	this.stringWidth = 1;
	this.bottomMargin = 20;
	this.spaceBetweenStrings = Math.floor(
	        (this.canvas.height - this.bottomMargin - 2 * this.fingerRadius - this.stringCount * this.stringWidth) / (this.stringCount-1));
	this.fretWidth = this.spaceBetweenStrings;
	this.leftMargin = 6;
	this.numberOfFrets = 7;
}


ChordRenderer.prototype.renderChord = function(chordForm) 
{
	var context = this.canvas.getContext('2d');
	context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	context.save();
	
	chordForm = new ChordDrawingDecorator(chordForm, this.numberOfFrets);

	context.translate(this.leftMargin, this.fingerRadius);
	
	this._renderGrid(context, chordForm);
    this._renderFingers(context, chordForm);

    context.restore();
};



ChordRenderer.prototype._renderGrid = function(context, chordForm) 
{
    var baseFretNumber = chordForm.getBaseFret();
    var highestFretX = this._getFretXCoordinate(this.numberOfFrets);
    
	// Draw the strings
	for (var i = 1; i <= this.stringCount; i++) 
	{
	    var y = this._getStringYCoordinate(i);
	    context.line(0, y, highestFretX, y);
	}
	
	var fretHeight = Math.abs(this._getStringYCoordinate(1) - this._getStringYCoordinate(this.stringCount));
	
	// Draw the fret-lines
	for (var i = 0; i <= this.numberOfFrets; i++) 
	{
	    var x = this._getFretXCoordinate(i);
	    context.line(x, 0, x, fretHeight);
	}

	if (baseFretNumber == 0)
	    this._renderNut(context, fretHeight);
	else
	    this._renderBaseFretNumber(context, baseFretNumber);
};


ChordRenderer.prototype._renderBaseFretNumber = function(context, baseFretNumber)
{
    var x = this._getFingerCoordinates(1, 1).x;
    var y = this.canvas.height - this.bottomMargin / 2;
    context.textBaseline = "middle";
    context.fillText(baseFretNumber + 1, x, y)
}


ChordRenderer.prototype._renderNut = function(context, fretHeight)
{
    // Draw the nut
	context.rect(-this.leftMargin, -this.stringWidth, this.leftMargin, fretHeight+2*this.stringWidth);
	context.fill();
};


ChordRenderer.prototype._getFretXCoordinate = function(fretNumber) {
    return this.fretWidth * fretNumber;
};


// stringNumber: Which string to draw, counting from 1 from the deepest.
ChordRenderer.prototype._getStringYCoordinate = function(stringNumber) {
   return (this.stringCount - stringNumber) * (this.spaceBetweenStrings + this.stringWidth);
};


ChordRenderer.prototype._getFingerCoordinates = function(stringNumber, finger) 
{
    return {
        x: this.fretWidth * (finger - .5),
        y: this._getStringYCoordinate(stringNumber)
    };
};


ChordRenderer.prototype._renderFingers = function(context, chordForm) 
{
    var This = this;
    
    $.each(chordForm.getFingers(), function(stringIndex, finger) 
    {
        if (finger == null) 
            This._renderUnplayedStringMark(context, stringIndex + 1);
        else if (finger != 0) 
            This._renderFinger(context, chordForm.getBaseFret(), stringIndex + 1, finger);
    });
};


ChordRenderer.prototype._renderFinger = function(context, baseFret, stringNumber, finger) 
{
    var coords = this._getFingerCoordinates(stringNumber, finger - baseFret);
    context.beginPath();
    context.arc(coords.x, coords.y, this.fingerRadius, 0, 2*Math.PI, true);
    context.fill();
};


ChordRenderer.prototype._renderUnplayedStringMark = function(context, stringNumber) 
{
    context.save();
    context.lineWidth = 2;
    
    var y = this._getStringYCoordinate(stringNumber);
    context.line(-6, y-6, +6, y+6);
    context.line(-6, y+6, +6, y-6);
    
    context.restore();
};