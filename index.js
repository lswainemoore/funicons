$(document).ready(function() {

  // SHARED

  var link = $('#fav');

  var setSVG = (s) => {
    link.attr('href', s);
  };

  var setSVGSolidColor = (c) => {
    setSVG(solidSVG(c));
  };

  var setSVGText = (text) => {
    setSVG(textSVG(text));
  };

  var SVG = (inside) => {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16">${inside}</svg>`
  };

  var solidSVG = (colorStr) => {
    return SVG(`<rect height="16" width="16" fill="${colorStr}" />`);
  };

  var textSVG = (text) => {
    return SVG(`<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${text}</text>`);
  };

  // DIVIDED

  // swap favicon color on mouseover
  // see: https://stackoverflow.com/a/43646435
  $('.split > div').each(function() {
    $(this).mouseover(function(e) {
      setSVGSolidColor($(this).attr('id'));
    });
  });

  // BOOTY

  class Point {
    constructor (x, y) {
      this.x = x;
      this.y = y;

      // scale appropriately
      var box = searchBox();
      this.cx = x * box[0].offsetWidth;
      this.cy = y * box[0].offsetHeight;
    };
  };

  var searchState = {
    found: false,
    loc: null,
    maxDistFromLoc: null,
  };


  var searchBox = () => {
    return $('.search');
  };

  var booty = () => {
    return $('.booty');
  };

  var distance = (p0, p1) => {
    return Math.sqrt(Math.pow(p0.cx - p1.cx, 2) + Math.pow(p0.cy - p1.cy, 2));
  };

  var eligibleRandom = () => {
    // we don't want the booty on the edge of the box,
    // so scale randomness down slightly.
    return .1 + .8 * Math.random();
  };

  var pickSearchLoc = () => {
    searchState.loc = new Point(eligibleRandom(), eligibleRandom());
    searchState.maxDistFromLoc = Math.max(
      distance( new Point(0, 0), searchState.loc),
      distance( new Point(1, 0), searchState.loc),
      distance( new Point(0, 1), searchState.loc),
      distance( new Point(1, 1), searchState.loc),
    );
    $('.search > .booty')
      .css('opacity', 0)
      .css('top', `${searchState.loc.cy - 35}px`)    // these hardcoded numbers are for centering based on width/height
      .css('left', `${searchState.loc.cx - 40}px`);
  };
  pickSearchLoc();

  var distanceFromLoc = (p) => {
    return distance(searchState.loc, p);
  };

  var cubic = (x) => {
    // this makes it slightly easier to find it, because it
    // makes small differences when you're closer more noticable.
    return x * x * x;
  };

  var pctToWarmth = (pct) => {
    if (pct > .5) {
      return `rgba(0, 0, 255, ${cubic(2 * (pct - .5))})`;
    }
    else {
      return `rgba(255, 0, 0, ${cubic(2 * .5 - pct)})`;
    }
  };

  searchBox()
    .mouseover(function() {
      $(this).mousemove((e) => {
        if (! searchState.found) {
          var box = $(this);
          var boxLoc = box.offset();
          var currentLoc = new Point(
            (e.pageX - boxLoc.left) / box[0].offsetWidth,
            (e.pageY - boxLoc.top) / box[0].offsetHeight
          );
          var d = distanceFromLoc(currentLoc);
          var dPct = d /searchState.maxDistFromLoc;
          setSVGSolidColor(pctToWarmth(dPct));
        }
      });
    });

  booty()
    .mouseover(() => {
      searchState.found = true;
      setSVGText('💰');
      booty().css('opacity', 1);
    });

  // BOUNCING BALL

  var ball = {
    pos: {
      x: .5,
      y: .5
    },
    vel: {
      x: 0,
      y: 0
    },
    acc: {
      x: 0,
      y: -.02
    }
  };

  const bounceFactor = .95;
  const dragFactor = .99;
  const radius = .1;
  const windowSize = 400;

  var interval;



  var drawBall = (scale) => {
    $('.ball').css('left', ball.pos.x * scale);
    $('.ball').css('bottom', ball.pos.y * scale);
  };

  var drawBallSVG = () => {
    setSVG(SVG(`<circle cx="${ball.pos.x * 16 + radius}" cy="${16 - (ball.pos.y * 16 + radius)}" r="${radius * 16}"></circle>`));
  }

  var moveBall = (delta) => {
    for (dir of ['x', 'y']) {
      ball.vel[dir] += delta * ball.acc[dir];
      ball.vel[dir] = dragFactor * ball.vel[dir];
      ball.pos[dir] += delta * ball.vel[dir];

      // collision
      if ((ball.pos[dir] + radius) > 1 || ball.pos[dir] < 0) {
        ball.pos[dir] = Math.max(Math.min(ball.pos[dir], 1), 0);
        ball.vel[dir] = -1 * bounceFactor * ball.vel[dir];
      }
    }
  };

  $('.bouncing')
    .mouseover(function() {
      var clicking = false;
      var mousedownLoc = {
        x: null,
        y: null
      };
      $(this).mouseleave(function() {
        clearInterval(interval);
        interval = undefined;
      });

      // TODO add an arrow (e.g. like an arcade putting game)
      // which goes in here.
      // $(this).mousemove((e) => {
      //   if (!clicking) {
      //     return;
      //   }
      //   var dist = Math.sqrt(Math.pow(mousedownLoc.x - e.pageX, 2) + Math.pow(mousedownLoc.y - e.pageY, 2))
      //   console.log(dist);
      // });

      $(this).mousedown(function(e) {
        clicking = true;
        mousedownLoc.x = e.pageX;
        mousedownLoc.y = e.pageY;
      });
      $(this).mouseup(function(e) {
        clicking = false;

        ball.vel.x = (mousedownLoc.x - e.pageX) / windowSize;
        ball.vel.y = (e.pageY - mousedownLoc.y) / windowSize;
      });
      if (!interval) {
        interval = setInterval(function(){
          if (!clicking) {
            moveBall(.1);
            drawBall(windowSize);
            drawBallSVG();
          }
        }, 30);
      }
    });
});

