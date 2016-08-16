/*
 * Global vars
 */
var currentSong = {};
currentSong['song'] = '';
currentSong['artist'] = '';
currentSong['album'] = '';
currentSong['path'] = '';

var genres = document.getElementsByClassName("genreItem");

var playerHTML5 = document.getElementById("playerHTML5");

var lastGenre = '';
var currentGenre = null;

/*
 * Vue.js
 */
var playerVue;
function playerVueInit() {
    playerVue = new Vue({
        el: '#app',
        data: {
            title: '',
            artist: '',
            album: '',
            path: '',
            filename: '',
            genre: '',
            nextGenre: ''
        },
        methods: {
            play: function(data) {
                this.title = data.song
                this.artist = data.artist
                this.album = data.album
                this.path = data.path
                this.genre = "Genre : " + currentGenre.getAttribute("data-genre-name")
                this.filename = filenameFromPath(data.path)
            },
            updateUi: function() {
                this.title = currentSong.song
                this.artist = currentSong.artist
                this.album = currentSong.album
                this.path = currentSong.path
                this.genre = "Genre : " + currentGenre.getAttribute("data-genre-name")
                if (nextGenre) this.nextGenre = "Prochain : " + nextGenre.getAttribute("data-genre-name")
                this.filename = filenameFromPath(currentSong.path)
            }
        }
    });
}
playerVueInit();

/*
 * SnackBar functions
 */
var snackbarContainer = document.querySelector('#demo-snackbar-example');
var snackBarData = '';
function showSnackBar() {
    snackbarContainer.MaterialSnackbar.showSnackbar(snackBarData);
}
function showSnackClickAgain() {
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}
/*
 * Player functions
 */
function playNext(){
    if (currentGenre) {
        var dataHref = "/genre/" + currentGenre.getAttribute("data-genre-id");
        getAjax(dataHref, function(data){ 
            data = JSON.parse(data);
            if (data.error) {
                if (data.error.allSongGenrePlayed == 1) 
                    allSongGenrePlayed();
            }
            else {
                play(data.randomSong);
                playingStyling();
            }
        });
    }
}
function play(songData) {
    playerHTML5.setAttribute("src", songData.path);

    playerVue.play(songData);
}
function playGenre() {
    // Saving genre information
    lastGenre = currentGenre;
    currentGenre = this;

    /* Playing next song if :
     * - It's the first song played
     * - Genre was already selected
     * - Player is paused
     */
    if (lastGenre == this || lastGenre == null || playerHTML5.paused) {
        playNext();
        genreButtonStyle();
    }
    else {
        snackBarData = {
            message: "Appuyer une deuxième fois sur le genre l'écouter avant la fin de la chanson",
            timeout: 5000
        };
        // Hiding current snackbar before showing another
        if (hasClass(snackbarContainer, "mdl-snackbar--active")) {
            snackbarContainer.MaterialSnackbar.cleanup_();
            window.setTimeout(showSnackBar, 250);
        }
        else {
            showSnackBar();
        }
    }
};
function downloadSong() {
    var songUrl = playerHTML5.getAttribute("src");
    location.replace(songUrl);
}

/*
 * Player functions for the UI
 */
function playPause(){
    if (playerHTML5.paused) {
        playerHTML5.play();
        playingStyling();
    }
    else {
        playerHTML5.pause();
        pausedStyling();
    }
}
function playingStyling(){
    document.querySelector("#pause").style.display = 'inline-block';
    document.querySelector("#play").style.display = 'none';
}
function pausedStyling(){
    document.querySelector("#pause").style.display = 'none';
    document.querySelector("#play").style.display = 'inline-block';
}

function genreButtonStyle() {
    // Check lastGenre as it is undefined on first execution
    if (lastGenre) {
        var button = document.querySelectorAll("div.genreList button.mdl-button--colored");
        removeClass(button[0],"mdl-button--colored");
    }

    addClass(currentGenre,"mdl-button--colored");
}

/* Pop up */
var resetGenre = function(event) {
    var genreId = currentGenre.getAttribute("data-genre-id");
    getAjax("/resetGenre/" + genreId, function(data){ 
        playNext();
        // Hiding snack bar
        var snackbarContainer = document.querySelector('#demo-snackbar-example');
        removeClass(snackbarContainer, "mdl-snackbar--active");
    });
};
function allSongGenrePlayed() {
    var snackbarContainer = document.querySelector('#demo-snackbar-example');
    var genreName = currentGenre.getAttribute("data-genre-name");
    snackBarData = {
        message: "Toutes les chansons du genre " + genreName + " ont déjà été lues",
        timeout: 5000,
        actionHandler: resetGenre,
        actionText: "Réécouter"
    };
    //snackbarContainer.MaterialSnackbar.showSnackbar(data);
    // Hiding current snackbar before showing another
    if (hasClass(snackbarContainer, "mdl-snackbar--active")) {
        snackbarContainer.MaterialSnackbar.cleanup_();
        window.setTimeout(showSnackBar, 250);
    }
    else {
        showSnackBar();
    }
}

// Duplicated to make it work when admin mode is on
function keyboardEvents1() {
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
            default:
                break;
        }
    });
}
function playerEventsInit1() {
    // Play pause song
    document.querySelector("#play").addEventListener("click", playPause, false);
    document.querySelector("#pause").addEventListener("click", playPause, false);

    // Skipping to next song
    document.querySelector("#next").addEventListener("click", playNext, false);
}


/* Interface d'admin */
function setAdmin() {
    getAjax("/admin", function(data){ 
        var player = document.getElementById("app");
        player.innerHTML = data;
        // Getting MDL working with the new elements
        componentHandler.upgradeDom();
        playerVueInit();
        playerVue.updateUi();
        keyboardEvents1();
        playerEventsInit1();
        document.querySelector("#resetSessions").addEventListener("click", resetSessions, false);
        document.querySelector("#resetDatabase").addEventListener("click", resetDatabase, false);
        document.querySelector("#scanMusic").addEventListener("click", scanMusic, false);
    });
}

function resetSessions() {
    var resetSessionsSpinner = document.getElementById("resetSessionsSpinner");
    removeClass(resetSessionsSpinner,"hideOpacity");
    addClass(resetSessionsSpinner,"showOpacity");

    getAjax("/admin/resetSessions", function(data){ 
        removeClass(resetSessionsSpinner,"showOpacity");
        addClass(resetSessionsSpinner,"hideOpacity");
    });
}

function resetDatabase() {
    var resetDatabaseSpinner = document.getElementById("resetDatabaseSpinner");
    removeClass(resetDatabaseSpinner,"hideOpacity");
    addClass(resetDatabaseSpinner,"showOpacity");

    getAjax("/admin/resetDatabase", function(data){ 
        removeClass(resetDatabaseSpinner,"showOpacity");
        addClass(resetDatabaseSpinner,"hideOpacity");
    });
}

function scanMusic() {
    var scanMusicSpinner = document.getElementById("scanMusicSpinner");
    removeClass(scanMusicSpinner,"hideOpacity");
    addClass(scanMusicSpinner,"showOpacity");

    getAjax("/admin/scanMusic", function(data){ 
        removeClass(scanMusicSpinner,"showOpacity");
        addClass(scanMusicSpinner,"hideOpacity");
    });
}
