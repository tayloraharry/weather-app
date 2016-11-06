"use strict";
let apiKeys = {};
let uid = {};

$(document).ready(()=> {
  $("#weather-search-btn").on('click', currentConditions);
  $("#weather-current-btn").on('click', currentConditions);
  $("#weather-3-day-btn").on('click', forecastThreeDay);
  $("#weather-7-day-btn").on('click', forecastSevenDay);
  $("#user-zip").keypress(function(e) {
    if(e.which == 13) {
      currentConditions();
    }
  });
 function currentConditions() {
    $("#weather-location").removeClass("hidden");
    $("#weather-output").removeClass("hidden");
    $("#weather-output").html('');
    let zip = $("#user-zip").val();
    Weather.weatherUndergroundLocationRequest(zip).then((locationData)=> {
    Weather.weatherUndergroundCurrentConditionsRequest(locationData.city, locationData.state).then((weatherData)=>{
      $("#weather-location").html(weatherData.display_location.full);
      $("#weather-output").append(`<h2>${weatherData.temp_f}°F</h2>`);
      $("#weather-output").append(`<h3>${weatherData.weather}</h3>`);
      $("#weather-output").append(`<img src=${weatherData.icon_url}>`);
      $("#weather-output").append(`<h4>Pressure</h4>`);
      $("#weather-output").append(`<h5>${weatherData.pressure_in}in.</h5>`);
      $("#weather-output").append(`<h4>Wind</h4>`);
      $("#weather-output").append(`<h5>${weatherData.wind_dir} ${weatherData.wind_mph}mph</h5>`);
      });
    })
  };

   function forecastThreeDay() {
    $("#weather-output").removeClass("hidden");
    $("#weather-output").html('');
    let zip = $("#user-zip").val();
    Weather.weatherUndergroundLocationRequest(zip).then((locationData)=> {
    Weather.weatherUnderground10DayForecastRequest(locationData.city, locationData.state).then((weatherData)=>{
        let dayForecast = "";
        for (var i = 1; i < 4; i++) {
          dayForecast += '<div class="col-md-4 weather-card">';
          dayForecast += '<h6>'+ weatherData[i].date.weekday +'</h6>'
          dayForecast += '<h6>' + weatherData[i].date.month + '-' + weatherData[i].date.day + '-' + weatherData[i].date.year + '</h6>'
          dayForecast += '<h3>High: ' + weatherData[i].high.fahrenheit + '°F</h3>'
          dayForecast += '<h3>Low: ' + weatherData[i].low.fahrenheit + '°F</h3>'
          dayForecast += '<img src=' + weatherData[i].icon_url + '>';
          dayForecast += '<h5>Wind: ' + weatherData[i].avewind.dir + " " + weatherData[i].avewind.mph + 'mph</h5></div>'
        }
        $("#weather-output").html(dayForecast);
      });
    })
  };

   function forecastSevenDay() {
    $("#weather-output").removeClass("hidden");
    $("#weather-output").html('');
    let zip = $("#user-zip").val();
    Weather.weatherUndergroundLocationRequest(zip).then((locationData)=> {
    Weather.weatherUnderground10DayForecastRequest(locationData.city, locationData.state).then((weatherData)=>{
        let dayForecast = "";
        for (var i = 1; i < 8; i++) {
          dayForecast += '<div class="col-md-4 weather-card">';
          dayForecast += '<h6>'+ weatherData[i].date.weekday_short +'</h6>'
          dayForecast += '<h6>' + weatherData[i].date.month + '-' + weatherData[i].date.day + '-' + weatherData[i].date.year + '</h6>'
          dayForecast += '<h3>H: ' + weatherData[i].high.fahrenheit + '°F</h3>'
          dayForecast += '<h3>L: ' + weatherData[i].low.fahrenheit + '°F</h3>'
          dayForecast += '<img src=' + weatherData[i].icon_url + '>';
          dayForecast += '<h5>W: ' + weatherData[i].avewind.dir + " " + weatherData[i].avewind.mph + 'mph</h5></div>'
        }
        $("#weather-output").html(dayForecast);
      });
    })
  };

  FbAPI.firebaseCredentials().then(function(keys){
    console.log("keys", keys);
    apiKeys = keys;
      firebase.initializeApp(apiKeys);
  });

$("#registerButton").on('click', function(){
  let userName = $("#inputUsername").val();
  let user = {
    email: $("#inputEmail").val(),
    password: $("#inputPassword").val()
  };
  FbAPI.registerUser(user).then(function(registerResponse){
    console.log("register response", registerResponse);
    let newUser = {
      "username" : userName,
      "uid" : registerResponse.uid
    };
    return FbAPI.addUser(apiKeys, newUser);
  }).then(function(addUserResponse){


    return FbAPI.loginUser(user);
  }).then(function(loginResponse){
    uid = loginResponse.uid;
    createLogoutButton();
    $("#login-container").addClass("hidden");
    $("#main-app").removeClass("hidden");
  });
});

$("#loginButton").on('click', function(){
  let user = {
    email: $("#inputEmail").val(),
    password: $("#inputPassword").val()
  };
  FbAPI.loginUser(user).then(function(loginResponse){
    uid = loginResponse.uid;
    createLogoutButton();
    // putTodoInDOM();
    $("#login-container").addClass("hidden");
    $("#main-app").removeClass("hidden");

  });
});

function createLogoutButton() {
  FbAPI.getUser(apiKeys, uid).then(function(userResponse){
    $("#logout-container").html("");
    $("#logout-container").removeClass("hidden");
    console.log(userResponse);
    let currentUserName = userResponse.username;
    let logoutButton = `<button class="btn btn-danger" id="logout-button">LOGOUT ${currentUserName}</button>`;
    $("#logout-container").append(logoutButton);
  });
}

$("#logout-container").on('click','#logout-button', function(){
  FbAPI.logoutUser();
  uid = "";
  $("#main-app").addClass("hidden");
  $("#logout-container").addClass("hidden");
  $("#login-container").removeClass("hidden");
  $("#user-input").val("");
  $("#inputUsername").val("");
  $("#inputPassword").val("");
  $("#inputEmail").val("");
  $("#incomplete").html("");
  $("#done-items").html("");
  $("#inputEmail").focus();

});



});