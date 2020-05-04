$(document).ready(function() {
  var link = $('#fav');

  var state = {
    mousePos: {
      x: null,
      y: null,
    },
  };

  var setSolidSVGColor = (c) => {
    link.attr('href', solidSVG(c));
  };

  // swap favicon color on mouseover
  // see: https://stackoverflow.com/a/43646435
  $('.split > div').each(function() {
    $(this).mouseover(function(e) {
      setSolidSVGColor($(this).attr('id'));
    });
  });

  var solidSVG = (colorStr) => {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"><rect height="16" width="16" fill="${colorStr}" /></svg>`
  };

  class Point {
    constructor (x, y) {
      this.x = x;
      this.y = y;
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

  var distance = (p0, p1) => {
    return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
  };

  var pickSearchLoc = () => {
    searchState.loc = new Point(Math.random(), Math.random());
    searchState.maxDistFromLoc = Math.max(
      distance( new Point(0, 0), searchState.loc),
      distance( new Point(1, 0), searchState.loc),
      distance( new Point(0, 1), searchState.loc),
      distance( new Point(1, 1), searchState.loc),
    );
    var box = searchBox();
    $('.search > .goal')
      .css('display', 'none')
      .css('top', `${searchState.loc.y * box[0].offsetHeight}px`)
      .css('left', `${searchState.loc.x * box[0].offsetWidth}px`);
  };
  pickSearchLoc();

  var distanceFromLoc = (p) => {
    return distance(searchState.loc, p);
  };

  var pctToWarmth = (pct) => {
    if (pct > .5) {
      return `rgba(255, 0, 0, ${2 * (pct - .5)})`;
    }
    else {
      return `rgba(0, 0, 255, ${2 * .5 - pct})`;
    }
  };

  searchBox()
    .mouseover(function() {
      $(this).mousemove(function(e) {
        if (! searchState.found) {
          var box = $(this);
          var boxLoc = box.offset();
          var currentLoc = new Point(
            (e.pageX - boxLoc.left) / box[0].offsetWidth,
            (e.pageY - boxLoc.top) / box[0].offsetHeight
          );
          var d = distanceFromLoc(currentLoc);
          var dPct = d /searchState.maxDistFromLoc;
          setSolidSVGColor(pctToWarmth(dPct));
          if (dPct < .05) {
            console.log('found it!');
            searchState.found = true;
            $(this).find('.goal')
              .css('display', 'block');
            setSolidSVGColor('yellow');
          }
        }
      });
    });

});

