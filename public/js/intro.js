function loadStyleSheet( path, fn, scope ) {
    var head = document.getElementsByTagName( 'head' )[0], // reference to document.head for appending/ removing link nodes
        link = document.createElement( 'link' );           // create the link node
    link.setAttribute( 'href', path );
    link.setAttribute( 'rel', 'stylesheet' );
    link.setAttribute( 'type', 'text/css' );

    var sheet, cssRules;
    // get the correct properties to check for depending on the browser
    if ( 'sheet' in link ) {
        sheet = 'sheet'; cssRules = 'cssRules';
    }
    else {
        sheet = 'styleSheet'; cssRules = 'rules';
    }

    var interval_id = setInterval( function() {                     // start checking whether the style sheet has successfully loaded
        try {
            if ( link[sheet] && link[sheet][cssRules].length ) { // SUCCESS! our style sheet has loaded
                clearInterval( interval_id );                      // clear the counters
                clearTimeout( timeout_id );
                fn.call( scope || window, true, link );           // fire the callback with success == true
            }
        } catch( e ) {} finally {}
    }, 10 ),                                                   // how often to check if the stylesheet is loaded
    timeout_id = setTimeout( function() {       // start counting down till fail
        clearInterval( interval_id );             // clear the counters
        clearTimeout( timeout_id );
        head.removeChild( link );                // since the style sheet didn't load, remove the link node from the DOM
        fn.call( scope || window, false, link ); // fire the callback with success == false
    }, 15000 );                                 // how long to wait before failing

    head.appendChild( link );  // insert the link node into the DOM and start loading the style sheet

    return link; // return the link node;
}

function loadScript(url, callback = null) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (callback)
        script.onload = callback;
    document.body.appendChild(script);
}

loadStyleSheet( "/public/css/mdl/material.min.css", function( success, link ) {
    if ( success ) {
        console.log("MDL CSS Loaded");
        loadScript("/public/js/mdl/material.min.js", CallBackForAfterFileLoaded);
    }
});
function CallBackForAfterFileLoaded (e) {
    console.log("MDL js loaded");
    componentHandler.upgradeDom();
    loadScript("/public/js/appLoader.js");
}
