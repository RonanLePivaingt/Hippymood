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

/*
 * Vue.js
 */
var playerVue = new Vue({
    el: '#app',
    data: {
        title: '',
        artist: '',
        album: ''
    },
    methods: {
        play: function(data) {
            this.title = data.song
            this.artist = data.artist
            this.album = data.album
        }
    }
});

/*
 * Global vars
 */
var genres = document.getElementsByClassName("genreItem");

var player = document.querySelector("#player");
var buttonPause = document.querySelector("#pause");
var buttonPlay = document.querySelector("#play");

var lastGenre = '';
var currentGenre;


/*
 * Player functions
 */
function play(songData) {
    var player = document.getElementById("player");
    player.setAttribute("src", songData.path);

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
        playPause();
    });
};
function playNext(){
    console.log("Chargement de la prochaine chanson.");
    getAjax(currentGenreHref, function(data){ 
        data = JSON.parse(data);
        play(data.randomSong);
        playPause();
    });
}

/*
 * Player functions for the UI
 */
function playPause(){
    if (player.paused) {
        player.play();
        buttonPlay.style.display = 'none';
        buttonPause.style.display = 'inline-block';

    }
    else {
        player.pause();
        buttonPause.style.display = 'none';
        buttonPlay.style.display = 'inline-block';
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
document.querySelector("#player").addEventListener("ended", playNext, false);

// Play pause song
document.querySelector("#play").addEventListener("click", playPause, false);
document.querySelector("#pause").addEventListener("click", playPause, false);

function genreButtonStyle() {
    // Check lastGenre as it is undefined on first execution
    if (lastGenre)
        removeClass(lastGenre,"mdl-button--colored");

    addClass(currentGenre,"mdl-button--colored");
}
