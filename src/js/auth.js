// Keyboard unlock
var combination = '';

function addCombination(evt, predefinedKey) {
    var key;

     //use this to determine whether predefinedKey was passed or not
    if (arguments.length == 1) {
        key = evt.keyCode.toString();
    }
    else {
        key = arguments[1]; // take second argument
    }

    if (combination.length > 1)
        console.log("Comparaison : " + combination + ", " +  window.authCombination.substring(0, combination.length));

    if (combination.length > 0 && combination + key != window.authCombination.substring(0, combination.length + 2)) {
        combination = '';
    }
    else if (key === "38" && combination != "38") {
        combination = key;
        checkCombination();
    }
    else if (key === "38") {
        combination += key;
        checkCombination();
    }
    else if (key === "40") {
        combination += key;
        checkCombination();
    }
    else if (key === "37") {
        combination += key;
        checkCombination();
    }
    else if (key === "39") {
        combination += key;
        checkCombination();
        if (combination == "3838404037393739") {
            // Faire apparaître les touches A et B
            // removeClass(document.getElementById("NESgamepad"), "hide");
        }
    }
    else if (key === "65") {
        combination += key;
        checkCombination();
    }
    else if (key === "66") {
        combination += key;
        checkCombination();
    }
}
document.onkeyup = function(evt) {    
    addCombination(evt);
}

function checkCombination() {
    if (combination === window.authCombination) {
      console.log('Authentification validé par auth.js');
      /*
        postAjax('/', {combination}, function(data){ 
            console.log(data); 
            if (data == "OK") {
                auth = 1;
                window.location.reload(false);
                display();
            }
        });
        */
    }
}
