loadStyleSheet("https://fonts.googleapis.com/icon?family=Material+Icons", function( success, link ) {
    if ( success ) {
        console.log("MDL Icons Loaded");
    }
});
loadStyleSheet("http://fonts.googleapis.com/css?family=Roboto:300,400,500,700", function( success, link ) {
    if ( success ) {
        console.log("Roboto Font Loaded");
    }
});
loadScript("/public/js/vue.js", vueCallback);
function vueCallback (e) {
    loadScript("/public/js/genericFunctions.js", daFunc);
}
/* Function to display player and hide intro text */
var playerInit = function (event) {
    console.log("Intro message hidden and player displayed");
    var intro = document.getElementById("intro");
    intro.setAttribute("style", "display: none");
    var app = document.getElementById("app");
    app.style.display = "";
    var title = document.getElementById("title");
    title.style.display = "";

    window.removeEventListener('click',playerInit, false );
};
function daFunc() {
    getAjax("/app", function(data){ 
        var appData = document.getElementById("appData");
        appData.innerHTML = data;
        // Getting MDL working with the new elements
        componentHandler.upgradeDom();

        loadScript("/public/js/ui.js", vueCallback2);
        function vueCallback2 (e) {
            loadScript("/public/js/events.js");
        }

        // Hide spinner when app is loaded
        var appSpinner = document.getElementById("appLoadSpinner");
        addClass(appSpinner,"hideOpacity");

        // Update UI on first genre click
        var buttons = document.querySelectorAll("div.genreList button");
        console.log("Combien de boutons : " + buttons.length);
        Array.prototype.forEach.call(buttons, function(el) {
            el.addEventListener("click", playerInit, false);
        });
    });
}
loadStyleSheet("/public/css/style.css", function( success, link ) {
});
