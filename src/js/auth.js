document.addEventListener(
  'chipslock-ready', function () {
    /************
     * Animations
     */

    function getElementOffset(element) {
      var de = document.documentElement;
      var box = element.getBoundingClientRect();
      var top = box.top + window.pageYOffset - de.clientTop;
      var left = box.left + window.pageXOffset - de.clientLeft;
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      return { top: top, left: left, width: width, height: height };
    }

    var datChips = document.getElementById("datChips");
    var datChipsPos = getElementOffset(datChips);

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var windowCenter = {
      x: windowWidth / 2,
      y: windowHeight / 2
    };

    var datChipsCenter = {
      x: datChipsPos.left + (datChipsPos.width / 2),
      y: datChipsPos.top + (datChipsPos.height / 2),
    }
    var chipsUp = {
      x: datChipsCenter.x - windowCenter.x,
      y: datChipsCenter.y - windowCenter.y - (datChipsPos.height / 2),
    }
    var chipsDown = {
      x: datChipsCenter.x - windowCenter.x,
      y: datChipsCenter.y - windowCenter.y + (datChipsPos.height / 2),
    }
    var chipsLeft = {
      x: datChipsCenter.x - windowCenter.x - (datChipsPos.width / 2),
      y: datChipsCenter.y - windowCenter.y,
    }
    var chipsRight = {
      x: datChipsCenter.x - windowCenter.x + (datChipsPos.width / 2),
      y: datChipsCenter.y - windowCenter.y,
    }

    // Animations 
    const DURATION = 400

    var smoke = new mojs.Burst({
      degree:   0,
      count:    3,
      radius:   { 10: 100 },
      children: {
        fill:       'cyan',
        pathScale:  'rand(0.5, 1)',
        radius:     'rand(12, 15)',
        swirlSize:  'rand(10, 15)',
        swirlFrequency: 'rand(2, 4)',
        direction:  [ 1, -1 ],
        duration:   `rand(${1*DURATION}, ${2*DURATION})`,
        delay:      'rand(0, 75)',
        easing:     'quad.out',
        isSwirl:    true,
        isForce3d:  true,
      }
    });
    var shape = new mojs.Shape({
      shape:        'circle',
      radius:       datChipsPos.width/2,
      duration:     200,
      easing:     'quad.out',
      fill:         'transparent',
      stroke:       '#F64040',
      strokeWidth:  4,
      isShowEnd:  false
    });

    function upAnim() {
      smoke
        .tune({ 
          children: { 
            fill: 'cyan'
          },
          x: chipsUp.x, 
          y: chipsUp.y, 
          degree: 0, 
          radius: { 10: 100 } 
        })
        .generate()
        .replay();
    }
    function downAnim() {
      smoke
        .tune({ 
          children: { 
            fill: 'cyan'
          },
          x: chipsDown.x, 
          y: chipsDown.y, 
          degree: 0, 
          radius: { 10: -100 } 
        })
        .generate()
        .replay();
    }
    function leftAnim() {
      smoke
        .tune({ 
          children: { 
            fill: 'cyan'
          },
          x: chipsLeft.x, 
          y: chipsLeft.y, 
          degree: 180, 
          radius: { 20: -100 } 
        })
        .generate()
        .replay();
    }
    function rightAnim() {
      smoke
        .tune({ 
          children: { 
            fill: 'cyan'
          },
          x: chipsRight.x, 
          y: chipsRight.y, 
          degree: 180, 
          radius: { 100: 0 } 
        })
        .generate()
        .replay();
    }
    function failAnim() {
      shape
        .tune({ 
          x :datChipsCenter.x - windowCenter.x,
          y :datChipsCenter.y - windowCenter.y,
        })
        .play();
    }

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

      /* For debugging purpose
      if (combination.length > 1)
        console.log("Comparaison : " + combination + ", " +  window.authCombination.substring(0, combination.length));
        */

      if (combination.length > 0 && combination + key != window.authCombination.substring(0, combination.length + 2)) {
        failAnim();
        combination = '';
      }
      else if (key === "38" && combination != "38") {
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
        // Calling unlock checking function again, for unlocking with touch events
        window.vm.unlock()
      }
    }


    /**************
     * Touch unlock
     */

    // Initializing a global var to delay between each touch inputs
    window.wait = 0;
    function resetWait() {
      console.log('wait' + wait);
      window.wait = 0;
    }

    // Initializing Hammerjs
    var mc = new Hammer(datChips);
    // let the pan gesture support all directions.
    // this will block the vertical scrolling on a touch-device while on the element
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    // listen to events...
    mc.on("panleft panright panup pandown", function(ev) {
      if (wait === 0) {
        var touchKey ="";
        window.wait = 1;
        window.setTimeout(resetWait, 400);
        switch (ev.type) {
          case "panup":
            touchKey = "38";
            break;
          case "pandown":
            touchKey = "40";
            break;
          case "panleft":
            touchKey = "37";
            break;
          case "panright":
            touchKey = "39";
            break;
          default:
            break;
        }

        addCombination(null, touchKey);
      }
    });

    /*****************************
     * Touch events on NES gamepad
     */
    // Check is NES gamepad is loaded and add event listener if not
    var btnNesA = document.getElementById('nespad-a')
    var mcNesA = new Hammer(btnNesA);
    mcNesA.on("tap", function(ev) {
      console.log('NES gamepad : A button triggered');
      addCombination(null, "65");
    });
    var btnNesB = document.getElementById('nespad-b')
    var mcNesB = new Hammer(btnNesB);
    mcNesB.on("tap", function(ev) {
      console.log('NES gamepad : B button triggered');
      addCombination(null, "66");
    });

    var dpad = document.getElementById('dpad');
    var dpadUp = document.getElementById('up');
    var dpadDown = document.getElementById('down');
    var dpadLeft = document.getElementById('left');
    var dpadRight = document.getElementById('right');

    var mcDpadUp = new Hammer(dpadUp);
    mcDpadUp .on("tap", function(ev) {
      addCombination(null, "38");
    });
    var mcDpadDown = new Hammer(dpadDown);
    mcDpadDown .on("tap", function(ev) {
      addCombination(null, "40");
    });
    var mcDpadLeft = new Hammer(dpadLeft);
    mcDpadLeft .on("tap", function(ev) {
      addCombination(null, "37");
    });
    var mcDpadRight = new Hammer(dpadRight);
    mcDpadRight .on("tap", function(ev) {
      addCombination(null, "39");
    });
  }, 
  false
);