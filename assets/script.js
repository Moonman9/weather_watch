var city;
var cities = [];
var APIKey = '2bb9bec8d3df15b7bf3a0736a49ddafa';


function find(city) {
    for(var i=0; i < cities.length; i++) {
        if(city.toUpperCase() === cities[i]) {
            return -1;
        }
    }
    return 1;
}

function currentCity(e) {
    e.preventDefault();
    if($('#city-search').val().trim() !== '') {
        city = $('#city-search').val().trim();
        currentWeather(city);
    }
}

function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function(response) {
        console.log(response);

        var iconType = response.weather[0].icon;
        var iconImg = "https://openweathermap.org/img/wn/" + iconType + "@2x.png";
        var date = new Date(response.dt * 1000).toLocaleDateString();
        $('#current-city').html(response.name + ' (' + date + ')' + "<img src=" + iconImg + '>');

        var temp = (response.main.temp - 273.15) * 1.80 + 32;
        $('#temperature').html((temp).toFixed(2) + ' &#8457');

        $('#humidity').html(response.main.humidity + '%');

        var wind = ((response.wind.speed) * 2.237).toFixed(2);
        $('#wind-speed').html(wind + ' MPH');

        uvIndex(response.coord.lon, response.coord.lat);
        forecastReport(response.id);
        if(response.cod == 200) {
            cities = JSON.parse(localStorage.getItem('city'));
            console.log(cities);
            if(cities == null) {
                cities = [];
                cities.push(city.toUpperCase());
                localStorage.setItem('city', JSON.stringify(cities));
                saveCity(city);
            } else {
                if(find(city) > 0) {
                    cities.push(city.toUpperCase());
                    localStorage.setItem('city', JSON.stringify(cities));
                    saveCity(city);
                }
            }
        }
    });
}

function uvIndex(lon, lat) {
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
    $.ajax({
        url: uvURL,
        method: 'GET',
    }).then(function(response) {
        $('#uv-index').html(response.value);
        console.log(response);
    });
}

function forecastReport(cityid) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
    $.ajax({
        url: forecastURL,
        method: 'GET'
    }).then(function(res) {
        for(i = 0; i < 5; i++) {
            var date = new Date((res.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var iconType = res.list[((i + 1) * 8) - 1].weather[0].icon;
            var iconImg = "https://openweathermap.org/img/wn/" + iconType + ".png";
            var temp = res.list[((i + 1) * 8) - 1].main.temp;
            var finalTemp = (((temp - 273.5) * 1.80) + 32).toFixed(2);
            var windspeed = res.list[(i + 1)].wind.speed;
            var wind = ((windspeed) * 2.237).toFixed(2);
            var humidity = res.list[((i + 1) * 8) -1].main.humidity;

            $('#forecast-date' + (i + 1)).html(date);
            $('#forecast-img' + (i + 1)).html('<img src=' + iconImg + '>');
            $('#forecast-temp' + (i + 1)).html(finalTemp + ' &#8457');
            $('#forecast-wind' + (i + 1)).html(wind + ' MPH');
            $('#forecast-humidity' + (i + 1)).html(humidity + " %");
        }
    });
}

function saveCity(city) {
    var li = $('<li>' + city.toUpperCase() + '</li>');
    $(li).attr('class', 'list-group-item');
    $(li).attr('data-value', city.toUpperCase());
    $('.list-group').append(li);
}

function quickSearch(e) {
    var cityBtn = e.target;
    if (e.target.matches('li')) {
        city = cityBtn.textContent.trim();
        currentWeather(city);
    }
}

function savedCity() {
    $('ul').empty();
    var cities = JSON.parse(localStorage.getItem('city'));
    if(cities !== null) {
        cities = JSON.parse(localStorage.getItem('city'));
        for(i = 0; i < cities.length; i++) {
            saveCity(cities[i]);
        }
        city = cities[i - 1];
        currentWeather(city);
    }
}

$('#search-btn').on('click', currentCity);
$(document).on('click', quickSearch);
$(window).on('load', savedCity);