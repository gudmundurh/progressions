
module("ChordForm");

test("that chord with all strings closed is parsed correctly", function() {
   var chord = new ChordForm("2243");
   same(chord.fingers, [2,2,4,3], "fingers"); 
});

test("that chord with open string is parsed correctly", function() {
   var chord = new ChordForm("0023");
   same(chord.fingers, [0,0,2,3], "fingers"); 
});

test("that chord with unplayed string is parsed correctly", function() {
   var chord = new ChordForm("333x");
   same(chord.fingers, [3,3,3,null], "fingers"); 
});

/*
test("that sharp notes return correct html formatting", function() {
    var chord = new Chord("0000");
    same(chord.getFormattedName(), "F<sup>#</sup>");
});

test("that flat notes return correct html formatting", function() {
    var chord = new Chord("0000");
    same(chord.getFormattedName(), "B<sub>b</sub>");
});
*/

module("ChordDrawingDecorator");

test("that base fret is 0 for low chord", function() {
    var decoratedChord = new ChordDrawingDecorator(new ChordForm('0023'), 5);
    same(decoratedChord.getBaseFret(), 0, "base fret");
});

test("that bas fret is 0 for closed low chord", function() {
    var decoratedChord = new ChordDrawingDecorator(new ChordForm('1111'), 5);
    same(decoratedChord.getBaseFret(), 0, "base fret");
});

test("that correct base fret is returned for high chord", function() {
    var decoratedChord = new ChordDrawingDecorator(new ChordForm('5579'), 5);
    same(decoratedChord.getBaseFret(), 4, "base fret");
});

test("that error is thrown if there are not enough visible frets for chord", function() {
    var decoratedChord = new ChordDrawingDecorator(new ChordForm('1239'));
    var errorThrown = false;
    try 
    {
        decoratedChord.getBaseFret(5);
    }
    catch (e) 
    {
        errorThrown = true;
    }
    ok(errorThrown, "Error thrown")
});


module('Notes');

test("gettings notes", function() {
    ok(Notes.get('A') instanceof Note, 'Notes.get returns Note');
    same(Notes.get('A').name, 'A', 'A');
    same(Notes.get('C#').name, 'C#', 'C#');
    same(Notes.get('Gb').name, 'F#', 'Gb');
});


test("getNormalizedNoteName", function() {
    same(Notes.getNormalizedNoteName('Bb'), 'A#', 'Bb');
    same(Notes.getNormalizedNoteName('Cb'), 'B', 'Cb');
    same(Notes.getNormalizedNoteName('F#'), 'F#', 'F#');
    same(Notes.getNormalizedNoteName('C'), 'C', 'C');
});


module('ChordNameParser');


test("parseing chords with ChordNameParser", function() {
    var Am = ChordNameParser.parse("Am");
    same(Am.note.name, 'A', 'Am note name');
    same(Am.modifier, 'm', 'Am modifier');

    var Gb7 = ChordNameParser.parse('Gb7');
    same(Gb7.note.name, 'F#', 'Gb7 note name');
    same(Gb7.modifier, '7', 'Gb7 modifier');
});