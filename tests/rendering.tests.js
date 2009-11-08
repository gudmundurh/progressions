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