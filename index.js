$(document).ready(function() {
  var link = $('#fav');

  var state = {
    mousePos: {
      x: null,
      y: null,
    },
  };

  var setSVG = (s) => {
    link.attr('href', s);
  };

  var setSVGSolidColor = (c) => {
    setSVG(solidSVG(c));
  };

  var setSVGText = (text) => {
    setSVG(textSVG(text));
  };

  // swap favicon color on mouseover
  // see: https://stackoverflow.com/a/43646435
  $('.split > div').each(function() {
    $(this).mouseover(function(e) {
      setSVGSolidColor($(this).attr('id'));
    });
  });

  var SVG = (inside) => {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16">${inside}</svg>`
  };

  var solidSVG = (colorStr) => {
    return SVG(`<rect height="16" width="16" fill="${colorStr}" />`);
  };

  var textSVG = (text) => {
    return SVG(`<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${text}</text>`);
  };

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
      return `rgba(255, 0, 0, ${cubic(2 * (pct - .5))})`;
    }
    else {
      return `rgba(0, 0, 255, ${cubic(2 * .5 - pct)})`;
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

});

