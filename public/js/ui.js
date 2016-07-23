/* 
 * Useful generic functions 
 */
function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
}

function getAjax(url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}

function filenameFromPath(path) {
    var filenameStart = path.lastIndexOf("/") + 1;
    return path.substring(filenameStart);
}

/*
 * Vue.js
 */
var playerVue = new Vue({
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
        }
    }
});

/*
 * Global vars
 */
var genres = document.getElementsByClassName("genreItem");

var playerHTML5 = document.getElementById("playerHTML5");
var buttonPause = document.querySelector("#pause");
var buttonPlay = document.querySelector("#play");

var lastGenre = '';
var currentGenre;

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

    var dataHref = this.getAttribute("data-href");
    getAjax(dataHref, function(data){ 
        data = JSON.parse(data);
        play(data.randomSong);
        genreButtonStyle();
    });
};
function playNext(){
    if (currentGenre) {
        var dataHref = currentGenre.getAttribute("data-href");
        getAjax(dataHref, function(data){ 
            data = JSON.parse(data);
            play(data.randomSong);
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
        playPauseStyling();
    }
    else {
        playerHTML5.pause();
        playPauseStyling();
    }
}
function playPauseStyling(){
    if (playerHTML5.paused) {
        buttonPause.style.display = 'none';
        buttonPlay.style.display = 'inline-block';
    }
    else {
        buttonPlay.style.display = 'none';
        buttonPause.style.display = 'inline-block';
    }
}

/*
 * Events
 */
// Playing genre on click
for (var i = 0; i < genres.length; i++) {
    genres[i].addEventListener('click', playGenre, false);
}

// Playing another song at the end of each songs
document.querySelector("#playerHTML5").addEventListener("ended", playNext, false);

// Play pause song
document.querySelector("#play").addEventListener("click", playPause, false);
document.querySelector("#pause").addEventListener("click", playPause, false);

// Skipping to next song
document.querySelector("#next").addEventListener("click", playNext, false);

// Download current song
//document.querySelector("#downloadSong").addEventListener("click", downloadSong, false);

function genreButtonStyle() {
    // Check lastGenre as it is undefined on first execution
    if (lastGenre)
        removeClass(lastGenre,"mdl-button--colored");

    addClass(currentGenre,"mdl-button--colored");
}

// Keyboard shortcuts
window.addEventListener("keypress", function(event) {
    // Play/pause with the spacebar
    if (event.charCode == 32)
        playPause();

    // Skipping song with ctrl+right
    if (event.ctrlKey && event.keyCode == 39)
        playNext();
});
