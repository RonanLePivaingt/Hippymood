document.addEventListener("DOMContentLoaded", function(event) { 
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
            /*
			var audio = new Audio('Mushroom.mp3');
			audio.play();
			audio.addEventListener(
				"ended", 
				function() { window.location = "/library";}
				, true
			);
            */
		}
	}
});
