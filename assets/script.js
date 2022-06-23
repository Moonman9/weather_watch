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
            cities = JSON.parse(localStorage.getItem('name'));
            console.log(cities);
            if(cities == null) {
                cities = [];
                cities.push(city.toUpperCase());
                localStorage.setItem('name', JSON.stringify(cities));
                saveCity(city);
            } else {
                if(find(city) > 0) {
                    cities.push(city.toUpperCase());
                    localStorage.setItem('name', JSON.stringify(cities));
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
    })
}

$('#search-btn').on('click', currentCity);