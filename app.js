const iconElement = document.querySelector('.weather-container__icon');
const tempElement = document.querySelector('.weather-container__temperature-value p');
const feelsElement = document.querySelector('.weather-container__feels-value p');
const descElement = document.querySelector('.weather-container__temperature-descripton p');
const locationElement = document.querySelector('.weather-container__location p');
const titleElement = document.querySelector('.app-title p');
const notificationElement = document.querySelector('.notification');
const greeting = document.querySelector('.greeting');

let hours = new Date().getHours();

let weather = {};
weather.temperature = {
	unit: 'celsius'
};

const KELVIN = 273;
const key = '96f6ba150dbfde1782395bffef95d6a2';

if('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
	notificationElement.style.display = 'block';
	notificationElement.innerHTML = `<p>Browser doesn't support Geolocalization</p>`;
}

function setPosition(positions) {
	let latitude = positions.coords.latitude;
	let longitude = positions.coords.longitude;

	getWeather(latitude, longitude);
}

function showError(error) {
	notificationElement.style.display = 'block';
	notificationElement.innerHTML = `<p>${error.message}</p>`;
}

async function getWeather(latitude, longitude) {
	let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
	try {
		const response = await fetch(api);
		const data = await response.json();
		weather.temperature.value = Math.floor(data.main.temp - KELVIN);
		weather.temperature.feels = Math.floor(data.main.feels_like - KELVIN);
		weather.description = data.weather[0].description;
		weather.iconId = data.weather[0].icon;
		weather.city = data.name;
		weather.country = data.sys.country;
		displayWeather();
	} catch(err) {
		console.log(err.message);
	}
}

(function displayGreeting() {
	greeting.textContent = (hours >= 6 && hours <= 12) ? 'Good Morning Denys' : 
						   (hours >= 12 && hours <= 18) ? 'Good Afternoon Denys' : 
						   (hours >= 18 && hours <= 23) ? 'Good Evening Denys' : 
						   (hours >= 0 && hours <= 6) ? 'Good Night Denys' : 'Good Evening Denys';
}());

function displayWeather() {
	iconElement.innerHTML = `<img src="icons/${weather.iconId}.png">`;
	tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
	feelsElement.innerHTML = `Feels like ${weather.temperature.feels}°<span>C</span>`;
	descElement.innerHTML = `${weather.description}`;
	locationElement.innerHTML = `${weather.city}, ${weather.country}`;
	document.title = `Weather in ${weather.city}`;
	titleElement.textContent = `Weather in ${weather.city}`;
}
