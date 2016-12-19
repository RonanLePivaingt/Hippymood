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

var adminCombination = '';

function checkAdminCombination() {
    if (adminCombination === "6568777378") {
        setAdmin();
    }
}

window.addEventListener("keyup", function(event) {
    var adminKey = event.keyCode.toString();
    if (adminKey === "65") {
        adminCombination = adminKey;
        checkAdminCombination();
    }
    else if (adminKey === "68") {
        adminCombination += adminKey;
        checkAdminCombination();
    }
    else if (adminKey === "77") {
        adminCombination += adminKey;
        checkAdminCombination();
    }
    else if (adminKey === "73") {
        adminCombination += adminKey;
        checkAdminCombination();
    }
    else if (adminKey === "78") {
        adminCombination += adminKey;
        checkAdminCombination();
    }
    else adminCombination = '';
});

keyboardEvents();

// Check if element is displayed
function isHidden(el) {
    return (el.offsetParent === null)
}
// Return the selected search input element displayed
function getFocusedSearchInput() {
    var searchInputs = document.getElementsByClassName("searchInput");
    for (var i = 0; i < searchInputs.length; i++) { 
        if (isHidden(searchInputs[i]) == false) {
            return searchInputs[i];
        }
    }
}
// Focus on the displayed search input
function focusSearch() {
    getFocusedSearchInput().select();

    // Prevent default browser action
    return false;
}

// Mapping / key to focusSearch
Mousetrap.bind('/', focusSearch);

// Remove focus on input when clicking escape key
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
    } else {
        isEscape = (evt.keyCode == 27);
    }
    if (isEscape)
        getFocusedSearchInput().blur();
};
