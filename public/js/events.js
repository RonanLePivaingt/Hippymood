// Playing another song at the end of each songs
document.querySelector("#playerHTML5").addEventListener("ended", playNext, false);

function playerEventsInit() {
    // Play pause song
    document.querySelector("#play").addEventListener("click", playPause, false);
    document.querySelector("#pause").addEventListener("click", playPause, false);

    // Skipping to next song
    document.querySelector("#next").addEventListener("click", playNext, false);

    // Cancel next genre choice
    document.querySelector("#cancelGenre").addEventListener("click", cancelNextGenre, false);
}
playerEventsInit();

// Playing genre on click
for (var i = 0; i < genres.length; i++) {
    genres[i].addEventListener('click', playGenre, false);
}

function keyboardEvents() {
    window.addEventListener("keypress", function(event) {
        switch (event.key) {
            case ' ':
                // Pausing/playing song on space press
                playPause();
                event.stopPropagation();
                event.preventDefault();
                break;
            case 'ArrowRight':
                // Skipping song with ctrl+right
                if (event.ctrlKey)
                    playNext();
                break;
            case 'ArrowLeft':
                // Skipping song with ctrl+right
                if (event.ctrlKey)
                    playPrevious();
                break;
            default:
                break;
        }
    });
}

var combination = '';

function checkCombination() {
    if (combination === "6568777378") {
        setAdmin();
    }
}

window.addEventListener("keyup", function(event) {
    var key = event.keyCode.toString();
    if (key === "65") {
        combination = key;
        checkCombination();
    }
    else if (key === "68") {
        combination += key;
        checkCombination();
    }
    else if (key === "77") {
        combination += key;
        checkCombination();
    }
    else if (key === "73") {
        combination += key;
        checkCombination();
    }
    else if (key === "78") {
        combination += key;
        checkCombination();
    }
    else combination = '';
});

keyboardEvents();
