$(document).ready(function() {
  var link = $('#fav');

  $('.split > div').each(function() {
    $(this).mouseover(function() {
      console.log(solidSVG($(this).attr('id')));
      link.attr('href', solidSVG($(this).attr('id')));
    });
  });

  var solidSVG = (colorStr) => {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"><rect height="16" width="16" fill="${colorStr}" /></svg>`
  };
});

