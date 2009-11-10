var NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


function Note(index) 
{
    this.name = NOTE_NAMES[index];
    this.index = index;
}


Note.prototype.addHalftones = function(halftones) 
{
    var newIndex = this.index + halftones;
    if (newIndex < 0) 
        newIndex += NOTE_NAMES.length;
    
    return new Note(newIndex % NOTE_NAMES.length);
};


Note.prototype.toString = function() 
{
    return this.name;
};


Note.prototype.getFormattedName = function() 
{
    // Flat:  U+266D (http://www.decodeunicode.org/de/u+266d)
    // Sharp: U+266F
    
    if (this.name.length == 2 && this.name.charAt(1) == "#")
        return this.name[0] + "&#x266f;";
    
    return this.name;
};

Note.prototype.getIdentifier = function() 
{
    if (this.name.length == 2 && this.name.charAt(1) == "#")
        return this.name[0] + "sharp";
    
    return this.name;
};


var Notes = 
{
    get: function(noteName) 
    {   
        noteName = this.getNormalizedNoteName(noteName);
        return new Note(this._getNoteIndex(noteName));
    },
    
    getNormalizedNoteName: function(noteName) 
    {
        if (noteName.length == 2 && noteName.charAt(1) == 'b')
        {
            var noteIndex = this._getNoteIndex(noteName.charAt(0))
            
            return NOTE_NAMES[(NOTE_NAMES.length + noteIndex - 1) % NOTE_NAMES.length];
        }
        
        return noteName;
    },
    
    _getNoteIndex: function(noteName)
    {
        for (var i = 0; i < NOTE_NAMES.length; i++) 
        {
            if (NOTE_NAMES[i] == noteName)
                return i;
        }
        throw new Error("Note named " + noteName + " not found");
    },
    
    getAll: function() 
    {
        var notes = [];
        for (var i = 0; i < NOTE_NAMES.length; i++)
            notes.push(new Note(i));
        return notes;
    }
};



var ChordNameParser = 
{
    parse: function(chordName) 
    {
        var match = chordName.match(/^([ABCDEFG][b#]?)((?:m|maj|dim|aug)?\d*)$/);
        
        if (!match) 
            throw new Error("ChordNameParser.parse: Could not parse chord '" + chordName + "'");
        
        return {
            note: Notes.get(match[1]),
            modifier: match[2] || null
        };
    }
};


function ChordForm(chordString) 
{
	var fingerChars = chordString.split('');
	this.fingers = [];
	this.chordAsString = chordString;
	
	for (var i = 0; i < fingerChars.length; i++) 
	{
		if (fingerChars[i] == 'x')
			this.fingers.push(null);
		else if (!isNaN(fingerChars[i]))
			this.fingers.push(parseInt(fingerChars[i], 10));
		else
			throw new Error("Unknown character '" + fingerChars[i] + "' in chord '" + chordString + "'");
	}
}


ChordForm.prototype.getFingers = function() 
{
    return this.fingers;
};


ChordForm.prototype.toString = function() 
{
    return this.chordAsString;
};


function Chord(database, note, modifier)
{
    this._database = database;
    this.note = note;
    this.modifier = modifier || "";
}


Chord.prototype.addHalftones = function(halftones)
{
    return new Chord(this._database, this.note.addHalftones(halftones));
};


Chord.prototype.addModifier = function(modifier) 
{
    return new Chord(this._database, this.note, modifier);
};



Chord.prototype.toString = function() 
{
    return this.note.name + this.modifier;
};




Chord.prototype.getForms = function() 
{
    return this._database.getChordForms(this);
};



function ChordDatabase() 
{
    this._forms = {};
}

 
ChordDatabase.prototype = 
{
    getChord: function(note) 
    {
        return new Chord(this, note);
    },
    
    getChordForms: function(chord) 
    {
        var formsForNote = this._forms[chord.note];
        
        if (formsForNote)
            return formsForNote[chord.modifier || ""];
        else
            return [];
    },
    
    getMajorChordProgression: function(baseNote)
    {
        var baseChord = this.getChord(baseNote);
        var secondChord = baseChord.addHalftones(5);
        var thirdChord = baseChord.addHalftones(7);
        return [baseChord, secondChord, thirdChord];
    },
    
    getMinorChordProgression: function(baseNote)
    {
        var baseChord = this.getChord(baseNote).addHalftones(-3);
        var secondChord = baseChord.addHalftones(5);
        var thirdChord = baseChord.addHalftones(7);
        return [baseChord.addModifier('m'), secondChord.addModifier('m'), thirdChord];
    },
    
    addChordForm: function(noteName, modifier, form)
    {
        if (!this._forms[noteName])
            this._forms[noteName] = {};
        if (!this._forms[noteName][modifier])
            this._forms[noteName][modifier] = [];
        this._forms[noteName][modifier].push(new ChordForm(form));
    }
};


/*
Improvements:

Rename from progressions.js to chords.js or chordDatabase.js

    getMajorChordProgressions and getMinor... should be changed to something like
        getChordProgresisons(baseNote, new ProgressionDefinition(0, 5, 7))
    or e.g.
        getChordProgresisons(baseNote, ProgressionDefinition.Major)
    
*/