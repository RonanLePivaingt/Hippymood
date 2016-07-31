/*
 * Global vars
 */
var currentSong;
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
            filename: ''
        },
        methods: {
            play: function(data) {
                this.title = data.song
                this.artist = data.artist
                this.album = data.album
                this.path = data.path
                this.filename = filenameFromPath(data.path)
                currentSong = data
            },
            updateUi: function() {
                this.title = currentSong.song
                this.artist = currentSong.artist
                this.album = currentSong.album
                this.path = currentSong.path
                this.filename = filenameFromPath(currentSong.path)
            }
        }
    });
}
playerVueInit();

/*
 * Player functions
 */
function play(songData) {
    playerHTML5.setAttribute("src", songData.path);

    playerVue.play(songData);
}
function playGenre() {
    // Saving genre information
    lastGenre = currentGenre;
    currentGenre = this;

    // Playing next song if genre was already selected or if it's the first song
    if (lastGenre == this || lastGenre == null) {
        playNext();
        genreButtonStyle();
    }
    else {
        var snackbarContainer = document.querySelector('#demo-snackbar-example');
        var genreName = currentGenre.getAttribute("data-genre-name");
        var data = {
            message: "Appuyer une deuxième fois sur le genre l'écouter avant la fin de la chanson",
            timeout: 5000
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
    /*
    var dataHref = "/genre/" + this.getAttribute("data-genre-id");
    getAjax(dataHref, function(data){ 
        data = JSON.parse(data);
        if (data.error) {
            if (data.error.allSongGenrePlayed == 1) 
                allSongGenrePlayed();
        }
        else {
            play(data.randomSong);
            genreButtonStyle();
            playingStyling();
        }
        });
        */
};
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
    var data = {
        message: "Toutes les chansons du genre " + genreName + " ont déjà été lues",
        timeout: 5000,
        actionHandler: resetGenre,
        actionText: "Réécouter"
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

// Duplicated to make it work when admin mode is on
function keyboardEvents1() {
    window.addEventListener("keypress", function(event) {
        switch (event.key) {
            case ' ':
                // Pausing/playing song on space press
                playPause();
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
    });
}

function resetSessions() {
    var resetSessionsSpinner = document.getElementById("resetSessionsSpinner");
    removeClass(resetSessionsSpinner,"hide");
    addClass(resetSessionsSpinner,"show");

    getAjax("/admin/resetSessions", function(data){ 
        removeClass(resetSessionsSpinner,"show");
        addClass(resetSessionsSpinner,"hide");
    });
}
