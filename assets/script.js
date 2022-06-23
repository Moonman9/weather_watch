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
        console.log(response)
    })
}

$('#search-btn').on('click', currentCity);