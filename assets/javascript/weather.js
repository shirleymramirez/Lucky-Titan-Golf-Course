window.onload = function() {

    // individual api key from openweathermap site
    var apiKey = "329e51714e606b5e94d875af875cd4a4";

    // zipcode for the City of Gilbert where the Golf Course is located
    var zipCode = 85234;

    // icon for each weather description from open weather site
    var skyConditionURLImageMap = {
        "clear sky": "<img src=http://openweathermap.org/img/w/01d.png>",
        "few clouds": "<img src=http://openweathermap.org/img/w/02d.png>",
        "scattered clouds": "<img src=http://openweathermap.org/img/w/03d.png>",
        "broken clouds": "<img src=http://openweathermap.org/img/w/04d.png>",
        "overcast clouds": "<img src=http://openweathermap.org/img/w/04d.png>",
        "shower rain": "<img src=http://openweathermap.org/img/w/09d.png>",
        "rain": "<img src=http://openweathermap.org/img/w/10d.png>",
        "light rain": "<img src=http://openweathermap.org/img/w/10d.png>",
        "thunderstorm": "<img src=http://openweathermap.org/img/w/11d.png>",
        "snow": "<img src=http://openweathermap.org/img/w/13d.png>",
        "mist": "<img src=http://openweathermap.org/img/w/50d.png>",
    };

    // ---------------------- get current weather forecast for the day ---------------------------------------------------------------
    function getCurrentWeatherData(zipCode) {
        // call json to access openweathermap current weather data using city zipcode and api key
        $.getJSON(
            "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode +
            ",us" + "&APPID=" + apiKey,
            function(data) {
                var dayForeCast = getDayForecast(data);

                // get icon from skyConditionURLImageMap object
                var icon = skyConditionURLImageMap[dayForeCast.skyCondition];

                // update weather element in html
                $("#cityName").text("Weather Forecast for " + data.name + " AZ");

                // clear parent container in HTML
                $(".weatherContainer").empty();

                // update html weather container
                $(".weatherContainer").append('<div id="weatherTemp">' + "Current Temp: " + dayForeCast.temperature + "℉" + "</div>");
                $(".weatherContainer").append('<div id="skyCondition">' + icon + " " + dayForeCast.skyCondition + "</div>");
                $(".weatherContainer").append('<div id="windSpeed">' + " Wind: " + dayForeCast.windSpeed + " mph " + "</div>");
            }
        )
    }

    // ---------------------- get five days weather forecast function ---------------------------------------------------------------
    function getFiveDayWeatherForecast(zipCode) {

        // call json to access openweathermap using city zipcode and api key for 5 day/ 3 hour forecast
        $.getJSON(
            "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode +
            ",us" + "&APPID=" + apiKey,
            function(data) {

                // clear parent container in HTML
                $(".fiveDayForecast").empty();

                // since it's a 5 day/3 hours forecast, we will 
                // loop through data list every 8 indeces to get the data for
                // each day for 5 days
                // for (var i = 0; i < data.list.length; i += 8) {
                for (var i = 0; i <= 16; i += 8) {
                    var dayForeCast = getDayForecast(data.list[i]);
                    console.log("DayForCast: ", data.list[i]);

                    // checks sky condition to get icon url
                    var icon = skyConditionURLImageMap[dayForeCast.skyCondition];

                    // update html elements for the five day forecast
                    $(".fiveDayForecast").append(
                        "<tr>" +
                        "<td>" + dayForeCast.dayOfTheWeek + "</td>" +
                        "<td>" + dayForeCast.temperature + "℉" + "</td>" +
                        "<td>" + icon + " " + dayForeCast.skyCondition + "</td>" +
                        "<td>" + dayForeCast.windSpeed + " mph" + " " + dayForeCast.windDirection + "</td>" +
                        "</tr>");
                }
            }
        );
    }
    getCurrentWeatherData(zipCode);
    getFiveDayWeatherForecast(zipCode);

    // function update every hr
    setInterval(function() {
        getCurrentWeatherData(zipCode);
    }, 3600000);

};
// ---------------------- get a day weather forecast function ---------------------------------------------------------------
function getDayForecast(data) {
    // get the day of the week through moment() and change the format to Monday to Friday string
    var dayOfTheWeek = moment().format("dddd");
    if (data.dt_txt) {
        dayOfTheWeek = moment(data.dt_txt).format("dddd");
    }

    // temperature conversion 
    var tempInF = (data.main.temp - 273.15) * 1.8 + 32;

    // data return
    return {
        dayOfTheWeek,
        temperature: Math.round(tempInF),
        windDirection: getWindDirection(data.wind.deg),
        windSpeed: data.wind.speed,
        skyCondition: data.weather[0].description,
    };
}
// ---------------------- get wind direction function ---------------------------------------------------------------
function getWindDirection(windDegree) {
    // checks the degree of the wind and determines the direction
    var windDirection;
    if (windDegree > 337.5) {
        windDirection = "N";
    } else if (windDegree > 292.5) {
        windDirection = "NW";
    } else if (windDegree > 247.5) {
        windDirection = "W";
    } else if (windDegree > 202.5) {
        windDirection = "SW";
    } else if (windDegree > 157.5) {
        windDirection = "S";
    } else if (windDegree > 122.5) {
        windDirection = "SE";
    } else if (windDegree > 67.5) {
        windDirection = "E";
    } else if (windDegree > 22.5) {
        windDirection = "NE";
    } else {
        windDirection = "N";
    }
    return windDirection;
}