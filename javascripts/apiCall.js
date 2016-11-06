"use strict";
var Weather = (function(oldWeather) {
//call to local file
let apiKeys = {};
oldWeather.weatherUndergroundLocationRequest = (zip) => {
  return new Promise ((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: 'apiKeys.json'
    }).then((response) => {
      apiKeys = response;
      let authHeader = apiKeys.key_id;
      $.ajax({
        method: 'GET',
        url: `http://api.wunderground.com/api/${authHeader}/geolookup/q/${zip}.json`
      }).then((locationData)=>{
        resolve(locationData.location);
      }, (errorResponse2) => {
        reject(errorResponse2);
      });
    }, (errorResponse) =>{
      reject(errorResponse);
    });
  });
};

oldWeather.weatherUndergroundCurrentConditionsRequest = (city, state) => {
  return new Promise ((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: 'apiKeys.json'
    }).then((response) => {
      apiKeys = response;
      let authHeader = apiKeys.key_id;
      $.ajax({
        method: 'GET',
        url: `http://api.wunderground.com/api/${authHeader}/conditions/q/${state}/${city}.json`
      }).then((weatherData)=>{
        resolve(weatherData.current_observation);
        // console.log(weatherData);
      }, (errorResponse2) => {
        reject(errorResponse2);
      });
    }, (errorResponse) =>{
      reject(errorResponse);
    });
  });
};

oldWeather.weatherUnderground10DayForecastRequest = (city, state) => {
  return new Promise ((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: 'apiKeys.json'
    }).then((response) => {
      apiKeys = response;
      let authHeader = apiKeys.key_id;
      $.ajax({
        method: 'GET',
        url: `http://api.wunderground.com/api/${authHeader}/forecast10day/q/${state}/${city}.json`
      }).then((weatherData)=>{
        resolve(weatherData.forecast.simpleforecast.forecastday);
        // console.log(weatherData);
      }, (errorResponse2) => {
        reject(errorResponse2);
      });
    }, (errorResponse) =>{
      reject(errorResponse);
    });
  });
};





return oldWeather;
})(Weather || {});