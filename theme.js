//solarized theme
var base03 =  "#002b36";
var base02 =  "#073642";
var base01 =  "#586e75";
var base00 =  "#657b83";
var base0 =   "#839496";
var base1 =   "#93a1a1";
var base2 =   "#eee8d5";
var base3 =   "#fdf6e3";
var yellow =  "#b58900";
var orange =  "#cb4b16";
var red =     "#dc322f";
var magenta = "#d33682";
var violet =  "#6c71c4";
var blue =    "#268bd2";
var cyan =    "#2aa198";
var green =   "#859900";

var currentTheme = '';
const themes = {
  'day': {
    colors: {
      "accentcolor": base3,
      "textcolor": base01,
      "toolbar": base2,
      "toolbar_text": base00,
      "toolbar_field": base3,
      "toolbar_field_text": base01
    },
    "images": {
      "headerURL": ""
    }
  },
  'night': {
    colors: {
      "accentcolor": base02,
      "textcolor": base1,
      "toolbar": base03,
      "toolbar_text": base0,
      "toolbar_field": base02,
      "toolbar_field_text": base1
    }, 
    "images": {
      "headerURL": ""
    }
  }
};

function setTheme(theme) {
  if (currentTheme === theme) {
    // No point in changing the theme if it has already been set.
    return;
  }
  currentTheme = theme;
  browser.theme.update(themes[theme]);
}

//time method--------------------------------------------------------
function checkTime() {
  let date = new Date();
  let hours = date.getHours();
  // Will set the sun theme between 6am and 6pm.
  var hourStart = localStorage.getItem("hourStart");
  var hourEnd = localStorage.getItem("hourEnd");
  if (((hourStart > 24) || (hourStart < 0)) || (hourStart > hourEnd) || ((hourEnd > 24) || (hourEnd < 0))) {
    var hourStart = 6;
    var hourEnd = 18;
  }
  if ((hours > hourStart) && (hours < hourEnd)) {
    setTheme('day');
  } else {
    setTheme('night');
  }
}

// On start up, check the time to see what theme to show.
checkTime();
// Set up an alarm to check this regularly.
browser.alarms.onAlarm.addListener(checkTime);
browser.alarms.create('checkTime', {periodInMinutes: 5});

//click button method-----------------------------------------------
