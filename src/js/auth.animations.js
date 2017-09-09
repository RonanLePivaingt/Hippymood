export default {
  smoke: false,
  shape: false,
  coordinates: false,
  init: function () {
    this.setCoordinates();
    this.setSmoke();
    this.setShape();
  },
  getElementOffset: function (element) {
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset;
    var left = box.left + window.pageXOffset;
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    return { top: top, left: left, width: width, height: height };
  },
  setCoordinates: function () {
    var datChips = document.getElementById("datChips");
    var datChipsPos = this.getElementOffset(datChips);

    if (datChipsPos) {
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
      this.coordinates = {
        windowCenter: windowCenter,
        datChipsCenter: datChipsCenter,
        chipsUp: chipsUp,
        chipsDown: chipsDown,
        chipsLeft: chipsLeft,
        chipsRight: chipsRight,
        datChipsPos: datChipsPos,
        datChipsCenter: datChipsCenter,
        windowCenter: windowCenter
      }
    }
  },
  setSmoke: function () {
    // Animations 
    var DURATION = 400

    this.smoke = new mojs.Burst({
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
  },
  setShape: function () {
    if (this.coordinates) {
      this.shape = new mojs.Shape({
        shape:        'circle',
        radius:       this.coordinates.datChipsPos.width/2,
        x :0,
        y :this.coordinates.datChipsCenter.y - this.coordinates.windowCenter.y,
        duration:     200,
        easing:     'quad.out',
        fill:         'transparent',
        stroke:       '#F64040',
        strokeWidth:  4,
        isShowEnd:  false
      })
    }
  },
  failAnim: function () {
    if (this.coordinates && this.shape) {
      this.shape.play();
    }
  },
  upAnim: function () {
    if (this.coordinates) {
      this.smoke
        .tune({ 
          children: { 
            fill: 'cyan'
          },
          x: this.coordinates.chipsUp.x, 
          y: this.coordinates.chipsUp.y, 
          degree: 0, 
          radius: { 10: 100 } 
        })
        .generate()
        .replay();
    }
  },
  downAnim : function () {
    if (this.coordinates && this.smoke) {
      this.smoke
        .tune({ 
          children: { 
            fill: 'cyan'
          },
          x: this.coordinates.chipsDown.x, 
          y: this.coordinates.chipsDown.y, 
          degree: 0, 
          radius: { 10: -100 } 
        })
        .generate()
        .replay();
    }
  },
  leftAnim : function () {
    if (this.coordinates) {
      this.smoke
        .tune({ 
          children: { 
            fill: 'cyan'
          },
          x: this.coordinates.chipsLeft.x, 
          y: this.coordinates.chipsLeft.y, 
          degree: 180, 
          radius: { 20: -100 } 
        })
        .generate()
        .replay();
    }
  },
  rightAnim : function () {
    if (this.coordinates) {
      this.smoke
        .tune({ 
          children: { 
            fill: 'cyan'
          },
          x: this.coordinates.chipsRight.x, 
          y: this.coordinates.chipsRight.y, 
          degree: 180, 
          radius: { 100: 0 } 
        })
        .generate()
        .replay();
    }
  }
}
