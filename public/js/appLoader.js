

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
function daFunc() {
    getAjax("/app", function(data){ 
        var app = document.getElementById("appData");
        app.innerHTML = data;
        loadScript("/public/js/ui.js");
        loadScript("/public/js/events.js");
    });
}
//link(href="", rel="stylesheet")
loadStyleSheet("/public/css/style.css", function( success, link ) {
});
