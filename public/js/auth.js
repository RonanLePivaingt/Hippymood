document.addEventListener("DOMContentLoaded", function(event) { 
    // Keyboard unlock
	var combination = '';

	document.onkeyup = function(evt){    
		var key = evt.keyCode.toString();
		if (key === "38" && combination != "38") {
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
		}
		else if (key === "65") {
			combination += key;
			checkCombination();
		}
		else if (key === "66") {
			combination += key;
			checkCombination();
		}
		else combination = '';
		//console.log("Key : " + key + ", Combination : " + combination);
	}

	function checkCombination() {
		//if (combination === "38384040373937396665") {
		if (combination === authCombination) {
            postAjax('/', {combination}, function(data){ 
                console.log(data); 
                if (data == "OK") {
                    auth = 1;
                    window.location.reload(false);
                    display();
                }
            });
		}
	}

    // Touch unlock
    $( "#datChips" ).draggable({ revert: true });
    var myElement = document.getElementById('auth');
    //var myElement = document.querySelectorAll('window');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);

    // let the pan gesture support all directions.
    // this will block the vertical scrolling on a touch-device while on the element
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    // listen to events...
    var debug = document.getElementById('debug');
    mc.on("panleft panright panup pandown tap press", function(ev) {
        console.log(ev.type +" gesture detected.")
        debug.innerHTML = debug.innerHTML +";" + ev.type +" gesture detected.";
    });
});
