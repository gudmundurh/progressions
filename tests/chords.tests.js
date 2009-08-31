
module("chords");

test("that chord with all strings closed is parsed correctly", function() {
   var chord = new Chord("A7", "2243");
   same(chord.fingers, [2,2,4,3], "fingers"); 
});

test("that chord with open string is parsed correctly", function() {
   var chord = new Chord("G", "0023");
   same(chord.fingers, [0,0,2,3], "fingers"); 
});

test("that chord with unplayed string is parsed correctly", function() {
   var chord = new Chord("X", "333x");
   same(chord.fingers, [3,3,3,null], "fingers"); 
});

test("that sharp notes return correct html formatting", function() {
    var chord = new Chord("F#", "0000");
    same(chord.getFormattedName(), "F<sup>#</sup>");
});

test("that flat notes return correct html formatting", function() {
    var chord = new Chord("Bb", "0000");
    same(chord.getFormattedName(), "B<sub>b</sub>");
});