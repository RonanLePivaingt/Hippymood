document.addEventListener("DOMContentLoaded", function(event) { 
    // Animations 
    const burst = new mojs.Burst({
        degree:   120,
        radius:   { 10: 25 },
        count:    5,
        children: {
            shape:        'line',
            radius:       7,
            radiusY:      0,
            scale:        1.5,
            strokeDasharray: '100%',
            strokeDashoffset: { '-100%' : '100%' },
            stroke:       '#F9DD5E' ,
            easing:       'linear.none',
            duration:     300
        }
    });

    function upAnim() {
        burst
            .tune({ x: 0, y: -200, angle: 300  })
            .replay();
    }
    function downAnim() {
        burst
            .tune({ x: 0, y: -80, angle: 120 })
            .replay();
    }
    function leftAnim() {
        burst
            .tune({ x: -70, y: -140, angle: 210  })
            .replay();
    }
    function rightAnim() {
        burst
            .tune({ x: 70, y: -140, angle: 30  })
            .replay();
    }

    document.addEventListener( 'click', function (e) {
        upAnim();
    });

    // Keyboard unlock
    var combination = '';

    document.onkeyup = function(evt){    
        var key = evt.keyCode.toString();
        if (key === "38" && combination != "38") {
            combination = key;
            checkCombination();
            upAnim();
        }
        else if (key === "38") {
            combination += key;
            checkCombination();
            upAnim();
        }
        else if (key === "40") {
            combination += key;
            checkCombination();
            downAnim();
        }
        else if (key === "37") {
            combination += key;
            checkCombination();
            leftAnim();
        }
        else if (key === "39") {
            combination += key;
            checkCombination();
            rightAnim();
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
    }

    function checkCombination() {
        console.log(combination + " - " + authCombination);
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
    var wait = 0;
    function resetWait() {
        wait = 0;
    }
    /*
    $( "#datChips" ).draggable({ 
        revert:  function(dropped) {
            window.setTimeout(resetWait, 200);
            return true;
        }
    });
    */
    var myElement = document.getElementById('datChips');
    //var myElement = document.querySelectorAll('window');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);

    // let the pan gesture support all directions.
    // this will block the vertical scrolling on a touch-device while on the element
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    // listen to events...
    var debug = document.getElementById('debug');
    var key = "";
    mc.on("panleft panright panup pandown", function(ev) {
        if (wait === 0) {
            wait = 1;
            switch (ev.type) {
                case "panup":
                    key = "38";
                    break;
                case "pandown":
                    key = "40";
                    break;
                case "panleft":
                    key = "37";
                    break;
                case "panright":
                    key = "39";
                    break;
                default:
                    break;
            }

            if (key === "38" && combination != "38") {
                combination = key;
                checkCombination();
                upAnim();
            }
            else if (key === "38") {
                combination += key;
                checkCombination();
                upAnim();
            }
            else if (key === "40") {
                combination += key;
                checkCombination();
                downAnim();
            }
            else if (key === "37") {
                combination += key;
                checkCombination();
                leftAnim();
            }
            else if (key === "39") {
                combination += key;
                checkCombination();
                rightAnim();
                if (combination == "3838404037393739") {
                    // Faire apparaître les touches A et B
                    removeClass(document.getElementById("NESbuttons"), "hide");
                }
            }
            else combination = '';
        }
    });

    // Au clic sur les boutons + évènements 
    function buttonClick() {
        if (this.id == "NESb") {
            combination += "66";
            checkCombination();
        }
        else if (this.id == "NESa") {
            combination += "65";
            checkCombination();
        }
    }
    // Idem ci dessus mais avec le tactile
    var myElement = document.getElementById('NESb');
    var mcB = new Hammer(myElement);
    mcB.add( new Hammer.Tap({ event: 'tap' }) );
    mcB.on("tap", function(ev) {
        console.log("Tap B");
        combination += "66";
        checkCombination();
    });
    var myElement = document.getElementById('NESa');
    var mcA = new Hammer(myElement);
    mcA.add( new Hammer.Tap({ event: 'tap' }) );
    mcA.on("tap", function(ev) {
        console.log("Tap A");
        combination += "65";
        checkCombination();
    });
});
