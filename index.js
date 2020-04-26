var toggleFav = () => {
  var link = $('#fav');
  console.log('swap!');
  if (link.attr('href').search('black') == -1) {
    link.attr('href', solidSVG('black'));
  } else {
    link.attr('href', solidSVG('blue'));
  }
  setTimeout(toggleFav, 500);
};

var solidSVG = (colorStr) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"><rect height="16" width="16" fill="${colorStr}" /></svg>`
};

toggleFav();