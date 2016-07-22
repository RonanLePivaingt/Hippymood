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

var genres = document.getElementsByClassName("genreItem");

var currentGenreHref = "";

var playGenre = function() {
    var dataHref = this.getAttribute("data-href");
    currentGenreHref = dataHref;
    getAjax(dataHref, function(data){ 
        data = JSON.parse(data);
        player(data.randomSong);
    });
};

for (var i = 0; i < genres.length; i++) {
    genres[i].addEventListener('click', playGenre, false);
}

function playNext(){
    console.log("Chargement de la prochaine chanson.");
    getAjax(currentGenreHref, function(data){ 
        data = JSON.parse(data);
        player(data.randomSong);
    });
}
function playPause(){
    var player = document.querySelector("#player");
    if (player.paused)
        player.play();
    else
        player.pause();
}

function player(songData) {
    var player = document.getElementById("player");
    player.setAttribute("src", songData.path);

    playerVue.play(songData);
}

// Vue.js
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

// Playing another song at the end of each songs
document.querySelector("#player").addEventListener("ended", playNext, false);
// Play pause song
document.querySelector("#play").addEventListener("click", playPause, false);
