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
    getAjax(window.location.toString().slice(0, -1) + dataHref, function(data){ 
        data = JSON.parse(data);
        var player = document.getElementById("player");
        player.setAttribute("src", data.randomSong.path);
    });
};

for (var i = 0; i < genres.length; i++) {
    genres[i].addEventListener('click', playGenre, false);
}

function playNext(){
    console.log("Chargement de la prochaine chanson.");
    getAjax(currentGenreHref, function(data){ 
        data = JSON.parse(data);
        var player = document.getElementById("player");
        player.setAttribute("src", data.randomSong.path);
    });
}

// Playing another song at the end of each songs
document.querySelector("#player").addEventListener("ended", playNext, false);
