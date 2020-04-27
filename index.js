$(document).ready(function() {
  var link = $('#fav');

  // swap favicon color on mouseover
  // see: https://stackoverflow.com/a/43646435
  $('.split > div').each(function() {
    $(this).mouseover(function() {
      link.attr('href', solidSVG($(this).attr('id')));
    });
  });

  var solidSVG = (colorStr) => {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"><rect height="16" width="16" fill="${colorStr}" /></svg>`
  };
});

