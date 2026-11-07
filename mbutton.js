document.write('<img src="img/menubutton.gif" width=148 height=42 border="0" alt="Menu">');

(function () {
  var settings = [
    { label: 'Klasyczna (1024)', width: '1024px' },
    { label: 'Nowoczesna (1440)', width: '1440px' },
    { label: 'Pełna szerokość', width: 'none' }
  ];
  var key = 'dispel-site-width';
  var selected = 1;
  try {
    var saved = localStorage.getItem(key);
    if (saved !== null && /^[0-2]$/.test(saved)) selected = Number(saved);
  } catch (error) {
    // The width selector still works for this page if storage is unavailable.
  }
  // Some browsers isolate storage for each file URL. Carry the selection through
  // local page links so the setting also follows navigation when opened offline.
  var parameter = 'site-width';
  if (location.protocol === 'file:') {
    var fromLink = new URLSearchParams(location.search).get(parameter);
    if (fromLink !== null && /^[0-2]$/.test(fromLink)) selected = Number(fromLink);
  }
  var menu = document.currentScript.parentNode;
  var button;

  function updateOfflineLinks() {
    if (location.protocol !== 'file:') return;
    var directory = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
    document.querySelectorAll('a[href]').forEach(function (link) {
      var url;
      try { url = new URL(link.getAttribute('href'), location.href); } catch (error) { return; }
      if (url.protocol !== 'file:' || !url.pathname.startsWith(directory) || !/\.html?$/i.test(url.pathname)) return;
      url.searchParams.set(parameter, String(selected));
      link.href = url.href;
    });
  }

  function applyWidth() {
    document.body.style.maxWidth = settings[selected].width;
    document.body.style.marginLeft = 'auto';
    document.body.style.marginRight = 'auto';
    if (button) {
      button.textContent = 'Szerokość: ' + settings[selected].label;
      button.title = 'Zmień szerokość strony';
      updateOfflineLinks();
    }
  }

  applyWidth();
  document.addEventListener('DOMContentLoaded', function () {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'width-button';
    button.addEventListener('click', function () {
      selected = (selected + 1) % settings.length;
      try { localStorage.setItem(key, String(selected)); } catch (error) {}
      applyWidth();
    });
    menu.appendChild(button);
    applyWidth();
  });
}());
