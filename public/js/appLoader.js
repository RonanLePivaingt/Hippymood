var robotoLoaded = 0
    materialIconsLoaded = 0
    genericFunctionsLoaded = 0
    appHTMLLoaded = 0
    appHTML = "";
    ;
function initGenrePlayer() {
    if (robotoLoaded && materialIconsLoaded && genericFunctionsLoaded && appHTMLLoaded) {
        // Load app HTML
        var appData = document.getElementById("appData");
        appData.innerHTML = appHTML;
        // Getting MDL working with the new elements
        componentHandler.upgradeDom();

        loadScript(
            "/public/js/ui.js", 
            function() {
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
        addClass(appSpinner,"hideOpacity");

        // Update UI on first genre click
        var buttons = document.querySelectorAll("div.genreList button");
        console.log("Combien de boutons : " + buttons.length);
        Array.prototype.forEach.call(buttons, function(el) {
            el.addEventListener("click", playerInit, false);
        });
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
    FontDetect.onFontLoaded (
        'Material Icons', 
        function() {
            materialIconsLoaded = 1;
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
    intro.setAttribute("style", "display: none");
    var app = document.getElementById("app");
    app.style.display = "";
    var title = document.getElementById("title");
    title.style.display = "";

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
