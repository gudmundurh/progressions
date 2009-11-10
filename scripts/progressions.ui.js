
if (typeof Progressions == 'undefined')
    var Progressions = {};

Progressions.UI = {
    init: function(database) {

        $('#scales').append(
            $.map(Notes.getAll(), function(note) {
                return '<li><a href="#' + note.name + '">' + note.getFormattedName() + '</a></li>' 
            }).join('')
        ).find('a').bind('click', function() {
            var baseNote = getNoteNameFromLink(this);
            drawMajorChordProgressions(baseNote);
            drawMinorChordProgressions(baseNote);
            setSelectedScale(baseNote);
        });
              
        function drawMajorChordProgressions(noteName) {
            var chords = database.getMajorChordProgression(Notes.get(noteName));
            drawChordProgressions('primaryChords', chords);
        }
    
        function drawMinorChordProgressions(noteName) {
            var chords = database.getMinorChordProgression(Notes.get(noteName));
            drawChordProgressions('secondaryChords', chords);
        }
    
        function drawChordProgressions(containerId, chords) {
            var container = $('#' + containerId);
            for (var i = 0; i < chords.length; i++) {
                var chordContainer = container.find('div').eq(i);
                chordContainer.find('h2').html(chords[i].toString());
                new ChordRenderer(chordContainer.find('canvas').get(0)).renderChord(chords[i].getForms()[0]);
            }
        }
        
        function setSelectedScale(baseNote) {
            $('#scales').find('a')
                .removeClass('selected')
                .filter(function() { return getNoteNameFromLink(this) == baseNote })
                .addClass('selected');
        }
        
        function getNoteNameFromLink(link) {
            return link.href.substring(link.href.indexOf('#')+1);
        }
    
        function initChordContainer(containerId) {
            var container = $('#' + containerId);
            for (var i = 0; i < 3; i++) {
                container.append('<div class="span-8"><h2></h2><canvas width="300" height="150"></canvas></div>');
            }
            container.find('div:last').addClass('last');
            if ($.browser.msie) {
                container.find('canvas').each(function() {
                    G_vmlCanvasManager.initElement(this);
                });
            }
        }
        initChordContainer('primaryChords');
        initChordContainer('secondaryChords');
    
        var baseNote = 'C';
        if (location.hash.length > 1) {
            var noteFromHash = location.hash.substring(1);
            try {
                baseNote = Notes.get(noteFromHash).name;
            } catch (e) {
                baseNote = 'C';
            }
        }
        
        setSelectedScale(baseNote);
    
        drawMajorChordProgressions(baseNote);
        drawMinorChordProgressions(baseNote);
    }
};
