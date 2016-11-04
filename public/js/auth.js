function getElementOffset(element)
{
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

const DURATION = 400

const smoke = new mojs.Burst({
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
    addClass(datChips, "shake-vertical");
    window.setTimeout(removeClass, 200, datChips, "shake-vertical");
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
    burst
        .tune({ 
            x: chipsUp.x, 
            y: chipsUp.y, 
            angle: 300  
        })
        .replay();
}
function downAnim() {
    addClass(datChips, "shake-vertical");
    window.setTimeout(removeClass, 200, datChips, "shake-vertical");
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
    burst
        .tune({ 
            x: chipsDown.x, 
            y: chipsDown.y, 
            angle: 120  
        })
        .replay();
}
function leftAnim() {
    addClass(datChips, "shake-horizontal");
    window.setTimeout(removeClass, 200, datChips, "shake-horizontal");
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
    burst
        .tune({ 
            x: chipsLeft.x, 
            y: chipsLeft.y, 
            angle: 210  
        })
        .replay();
}
function rightAnim() {
    addClass(datChips, "shake-horizontal");
    window.setTimeout(removeClass, 200, datChips, "shake-horizontal");
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
    burst
        .tune({ 
            x: chipsRight.x, 
            y: chipsRight.y, 
            angle: 30  
        })
        .replay();
}

function failAnim() {
    addClass(datChips, "fail");
    window.setTimeout(removeClass, 200, datChips, "fail");
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

    if (combination.length > 1)
        console.log("Comparaison : " + combination + ", " +  authCombination.substring(0, combination.length));

    if (combination.length > 0 && combination + key != authCombination.substring(0, combination.length + 2)) {
        failAnim();
        addClass(document.getElementById("NESbuttons"), "hide");
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
            removeClass(document.getElementById("NESbuttons"), "hide");
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
mc.on("panleft panright panup pandown", function(ev) {
    if (wait === 0) {
        var touchKey ="";
        wait = 1;
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

var myElement = document.getElementById('NESb');
var mcB = new Hammer(myElement);
mcB.add( new Hammer.Tap({ event: 'tap' }) );
mcB.on("tap", function(ev) {
    addCombination(null, "66");
});

var myElement = document.getElementById('NESa');
var mcA = new Hammer(myElement);
mcA.add( new Hammer.Tap({ event: 'tap' }) );
mcA.on("tap", function(ev) {
    addCombination(null, "65");
});