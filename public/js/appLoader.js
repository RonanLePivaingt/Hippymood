var robotoLoaded = 0
    genericFunctionsLoaded = 0
    appHTMLLoaded = 0
    appHTML = ""
    authJsLoaded = 0
    ;
function initGenrePlayer() {
    function display() {
        // Load app HTML
        var appData = document.getElementById("appData");
        appData.innerHTML = appHTML;
        // Getting MDL working with the new elements
        componentHandler.upgradeDom();

        loadScript(
            "/public/js/ui.js", 
            function() {
                loadScript("/public/js/mousetrap.min.js");
                loadScript("/public/js/events.js");
            }
        );

        /* Loading dialog polyfill */
        loadScript(
            "/public/js/dialog-polyfill/dialog-polyfill.js",
            function () {
                var button = document.getElementById('show-dialog');
                var dialog = document.getElementsByClassName('mdl-dialog')[0];

                if (! dialog.showModal)
                    dialogPolyfill.registerDialog(dialog);

                button.addEventListener('click', function() {
                    dialog.showModal();
                });
                dialog.querySelector('.close').addEventListener('click', function() {
                    dialog.close();
                });
            }
        );

        // Hide spinner when app is loaded
        var appSpinner = document.getElementById("appLoadSpinner");
        if (appSpinner)
            addClass(appSpinner,"hideOpacity");

        // Update UI on first genre click
        var buttons = document.querySelectorAll("div.genreList button");
        Array.prototype.forEach.call(buttons, function(el) {
            el.addEventListener("click", playerInit, false);
        });
    }
    // Loading auth js when Robot is ready
    if (robotoLoaded && auth == 0 && authJsLoaded == 0) {
        authJsLoaded = 1;
        loadScript(
            "/public/js/auth.js", 
            function() {
                console.log("Auth js loaded");
            }
        );
    }

    if (robotoLoaded && genericFunctionsLoaded && appHTMLLoaded) {
        // Stopping timeout and loading
        //window.clearTimeout(loaderTimeout);
        display();
    }
    else {
        // Starting 
        //if (typeof loaderTimeout == 'undefined')
            //loaderTimeout = window.setTimeout(display, 5000);
    }
}
loadScript("/public/js/fontdetect.js", function() {
    FontDetect.onFontLoaded (
        'Roboto', 
        function() {
            robotoLoaded = 1;
            initGenrePlayer();
        },
        onItDidntLoad, 
        {msTimeout: 3000}
    );
    function onItDidntLoad (fontname) {
        console.log(fontname + " didn't load within 3 seconds");
    }
});
loadScript(
    "/public/js/vue.js", 
    function() {
        loadScript(
            "/public/js/genericFunctions.js", 
            function() {
                genericFunctionsLoaded = 1;
                retrieveAppHTML();
                initGenrePlayer();
            }
        );
    }
);
/* Function to display player and hide intro text */
var playerInit = function (event) {
    var intro = document.getElementById("intro");
    var app = document.getElementById("app");
    var title = document.getElementById("title");
    var searchFormIntro= document.getElementById("searchFormIntro");
    addClass(intro, "hide");
    addClass(searchFormIntro, "hide");
    removeClass(app, "hide");
    removeClass(title, "hide");

    window.removeEventListener('click',playerInit, false );
};
function retrieveAppHTML() {
    getAjax("/app", function(data){ 
        appHTML = data;
        appHTMLLoaded = 1;
        initGenrePlayer();
    });
}
loadStyleSheet("/public/css/style.css", function() {});
loadStyleSheet("/public/js/dialog-polyfill/dialog-polyfill.css", function() {});
