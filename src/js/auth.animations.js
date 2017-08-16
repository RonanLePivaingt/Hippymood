window.chipslock = {};
window.chipslock.setCoordinates = function () {
  /************
   * Animations
   */

  function getElementOffset(element) {
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset;
    var left = box.left + window.pageXOffset;
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
    y: datChipsPos.top + (datChipsPos.height / 2) - 60,
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
    x :0,
    y :datChipsCenter.y - windowCenter.y,
    duration:     200,
    easing:     'quad.out',
    fill:         'transparent',
    stroke:       '#F64040',
    strokeWidth:  4,
    isShowEnd:  false
  });

  window.chipslock.upAnim = function () {
    if (window.chipslock.animate) {
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
  }
  window.chipslock.downAnim = function () {
    if (window.chipslock.animate) {
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
  }
  window.chipslock.leftAnim = function () {
    if (window.chipslock.animate) {
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
  }
  window.chipslock.rightAnim = function () {
    if (window.chipslock.animate) {
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
  }
  window.chipslock.failAnim = function () {
    if (window.chipslock.animate) {
      shape.play(); 
    }
  }
}
