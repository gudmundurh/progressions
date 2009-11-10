
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

module('Note');

test("Note ctor should set correct name", function() {
    var note = new Note(2);
    same(note.name, NOTE_NAMES[2])
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