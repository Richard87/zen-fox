//theming
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

const themes = {
  'light': {
    colors: {
      "frame": base2,
      "tab_background_text": base01,
      "toolbar": base3,
      "toolbar_text": base00,
      "toolbar_field": base2,
      "toolbar_field_text": base01,
      "tab_line": magenta,
      "popup": base2,
      "popup_text": base01,
      "popup_border": magenta,
      "popup_highlight": base3,
      "popup_highlight_text": magenta,
      "tab_loading": magenta,
      "icons": base00,
      "icons_attention": magenta,
      "toolbar_field_separator": base1,
      "toolbar_vertical_separator": base1,
      "toolbar_field_highlight": magenta,
      "button_background_active": base2,
      "button_background_hover": base2,
      "ntp_background": base2,
      "ntp_text": base01,
      "sidebar": base2,
      "sidebar_border": base00,
      "sidebar_highlight": base3, 
      "sidebar_highlight_text": magenta, 
      "sidebar_text": base00,
      "toolbar_field_border_focus": magenta,
      "toolbar_top_separator": base1,
      "toolbar_bottom_separator": base1,
      "toolbar_field_border": base1,
      "tab_text": magenta
    },
  },
  'dark': {
    colors: {
      "frame": base03,
      "tab_background_text": base1,
      "toolbar": base02,
      "toolbar_text": base0,
      "toolbar_field": base03,
      "toolbar_field_text": base1,
      "tab_line": cyan,
      "popup": base03,
      "popup_text": base1,
      "popup_border": cyan,
      "popup_highlight": base02,
      "popup_highlight_text": cyan,
      "tab_loading": cyan,
      "icons": base0,
      "icons_attention": cyan,
      "toolbar_vertical_separator": base01,
      "toolbar_field_separator": base01,
      "toolbar_field_highlight": cyan,
      "button_background_active": base03,
      "button_background_hover": base03,
      "ntp_background": base02,
      "ntp_text": base1,
      "sidebar": base03,
      "sidebar_border": base01,
      "sidebar_highlight": base02, 
      "sidebar_highlight_text": cyan, 
      "sidebar_text": base0,
      "toolbar_field_border_focus": cyan,
      "toolbar_top_separator": base01,
      "toolbar_bottom_separator": base01,
      "toolbar_field_border": base01,
      "tab_text": cyan
    },
  }
};

function setTheme(theme) {
  browser.storage.local.set({'currentTheme': theme});
  browser.theme.update(themes[theme]);
  console.log('theme:' + theme + 'applied');
}

////////////////////////////////////METHODS///////////////////////////////////

async function timeMethod() {
  const date = new Date();
  const hours = date.getHours();

  console.log('time, now: '+hours)
  let hourStart = await browser.storage.local.get("hourStart");
  let hourStartProp = hourStart["hourStart"];
  let hourEnd = await browser.storage.local.get('hourEnd');
  let hourEndProp = hourEnd["hourEnd"];

  console.log('hourStart: '+hourStartProp);
  console.log('hourEnd: '+hourEndProp);

  if ((hours > hourStartProp) && (hours < hourEndProp)) {
      setTheme('light');
    } else {
      setTheme('dark');
    }

  console.log('<--- timeMethod complete');
  browser.alarms.clear('weatherMethod');
  browser.alarms.onAlarm.addListener(timeMethod);
  browser.alarms.create('timeMethod', {periodInMinutes: 5});
}

async function manualMethod() {
  const currentTheme = await browser.storage.local.get("currentTheme");
  const currentThemeProp = currentTheme["currentTheme"];

  switch (currentThemeProp) {
    case 'light': setTheme('dark'); break;
    case 'dark': setTheme('light'); break;
  }
}

function setSystemTheme() {
  let currentSystemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"
  console.log(currentSystemTheme)
  setTheme(currentSystemTheme)
}

async function systemThemeMethod() {
  console.log('system theme method started')

  //set whenever method is called
  setSystemTheme()

  //set listener for future changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setSystemTheme);


}

async function weatherMethod() {
  console.log('weather method started')

  var lat = await browser.storage.local.get("lat");
  var latProp = lat["lat"];
  console.log('lat:'+latProp);
  var long = await browser.storage.local.get("long");
  var longProp = long["long"];
  console.log('long:'+longProp);
  var apiKey = await browser.storage.local.get('apiKey');
  var apiKeyProp = apiKey["apiKey"];
  console.log(apiKeyProp);

  var URL = 'http://api.openweathermap.org/data/2.5/weather?lat='+latProp+'&lon='+longProp+'&APPID='+apiKeyProp;
  console.log("weather URL: "+ URL);

  fetch(URL)
  .then(response => response.json())
  .then(data => {
    var cloudPercent = data.clouds.all;
    console.log('cloud %: ' + cloudPercent);

    if (cloudPercent < 50) {
      setTheme('light');
    } else {
      setTheme('dark');
    }

    browser.alarms.clear('timeMethod');
    browser.alarms.onAlarm.addListener(weatherMethod);
    browser.alarms.create('weatherMethod', {periodInMinutes: 5});
    console.log('<---weather method complete');
  });
}

/////////////////////////////ACTUAL WORK/////////////////////////////////////

async function accentHandler() {
    console.log('--->accent handler called');
    //looking back this function is trash; but it works and I don't want to fix it >.<
    let accentColorLight = await browser.storage.local.get('accentColorForLight');
    let accentColorLightProp = accentColorLight["accentColorForLight"] || "#d33682";

    let accentColorDark = await browser.storage.local.get('accentColorForDark');
    let accentColorDarkProp = accentColorDark["accentColorForDark"] || "#2aa198";

    console.log('light accent: ' + accentColorLightProp);
    console.log('dark accent: ' + accentColorDarkProp);

    themes['light'].colors["tab_line"] = accentColorLightProp;
    themes['light'].colors["tab_loading"] = accentColorLightProp;
    themes['light'].colors["icons_attention"] = accentColorLightProp;
    themes['light'].colors["popup_border"] = accentColorLightProp;
    themes['light'].colors["popup_highlight_text"] = accentColorLightProp;
    themes['light'].colors["sidebar_highlight_text"] = accentColorLightProp;
    themes['light'].colors["toolbar_field_border_focus"] = accentColorLightProp;
    themes['light'].colors["tab_text"] = accentColorLightProp;
    themes['light'].colors["toolbar_field_highlight"] = accentColorLightProp;

    themes['dark'].colors["tab_line"] = accentColorDarkProp;
    themes['dark'].colors["tab_loading"] = accentColorDarkProp;
    themes['dark'].colors["icons_attention"] = accentColorDarkProp;
    themes['dark'].colors["popup_border"] = accentColorDarkProp;
    themes['dark'].colors["popup_highlight_text"] = accentColorDarkProp;
    themes['dark'].colors["sidebar_highlight_text"] = accentColorDarkProp;
    themes['dark'].colors["toolbar_field_border_focus"] = accentColorDarkProp;
    themes['dark'].colors["tab_text"] = accentColorDarkProp;
    themes['dark'].colors["toolbar_field_highlight"] = accentColorDarkProp;

    console.log('<---accents set');
}

async function openSettings() {
  let initializedCheck = await browser.storage.local.get("initialized");
  let initializedCheckProp = initializedCheck["initialized"];

  if (initializedCheckProp != "yes") {
    browser.runtime.openOptionsPage();
  }
  browser.storage.local.set({"initialized": "yes"});
  console.log('---openSettingsRun');
}

async function methodHandler() {
  console.log("--->method handler called");
  const method = await browser.storage.local.get("method");

  const methodProp = method["method"] || "manual";
  console.log('method: '+methodProp);

  if (methodProp == "manual") {
    const currentTheme = await browser.storage.local.get("currentTheme");
    const currentThemeProp = currentTheme["currentTheme"]; //repeated from above… but too annoying

    console.log("manual method selected");
    browser.browserAction.setTitle({title: "Zen Fox: Manual"});
    browser.browserAction.onClicked.removeListener(openSettings); //otherwise, it would do both
    browser.browserAction.onClicked.addListener(manualMethod);
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setSystemTheme);

    //meant for browser startup, sets last used theme:
    switch (currentThemeProp) {
      case 'light':
        setTheme('light');
        break;
      default:
      case 'dark':
        setTheme('dark');
        break;
    };
  }
  else if (methodProp == "time") {
    console.log("time method selected");
    browser.browserAction.setTitle({title: "Zen Fox: Time"});
    timeMethod();

    browser.browserAction.onClicked.removeListener(manualMethod);
    browser.browserAction.onClicked.addListener(openSettings);
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setSystemTheme)
  }
  else if (methodProp == "weather") {
    console.log("weather method selected");
    browser.browserAction.setTitle({title: "Zen Fox: Weather"});
    weatherMethod();

    browser.browserAction.onClicked.removeListener(manualMethod);
    browser.browserAction.onClicked.addListener(openSettings);
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setSystemTheme)
  }
  else if (methodProp == "systemTheme") {
    console.log("system theme method selected")
    browser.browserAction.setTitle({title: "Zen Fox: System Theme"})
    systemThemeMethod()

    browser.browserAction.onClicked.removeListener(manualMethod)
    browser.browserAction.onClicked.addListener(openSettings)
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setSystemTheme)
  }
}

function apply() {
  console.log('---started apply');
  accentHandler();
  methodHandler();
}

apply();
openSettings();
browser.runtime.onMessage.addListener(apply);