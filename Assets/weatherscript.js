//Event listener for city search
var searchbtn = document.querySelector("#searchbutton")
var searchinput = document.querySelector("#searchinput")
var searchform = document.querySelector("#searchform")

searchform.addEventListener("submit", function(event){
    event.preventDefault()
    getcoords(searchinput.value)
    generateHistory()
})

searchbtn.addEventListener("click", function(event){
    event.preventDefault()
    getcoords(searchinput.value)
    generateHistory()
})

//Function which returns latitude and longitude for a given city name using the open weather API
var getcoords = function(cityname){
    apiurl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=3c1902a6683a6fc1079fef0612f33630`
    fetch(apiurl)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        var lat = data[0].lat
        var lon = data[0].lon
        generateWeather(lat, lon)
    })
    .catch(function(){
        console.log("bad input")
    })
}

//Function which gets and displays the weather data for the searched city, given latitude and longitude
var generateWeather = function(lat, lon){
    apiurl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=3c1902a6683a6fc1079fef0612f33630&units=metric`
    fetch(apiurl)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        // Clear previous weather input from DOM each time function is called, if any exists
        var clearWeather = document.querySelector(".weatherContainer")
        if(clearWeather !== null){
            clearWeather.remove()
        }

        var clearFiveDay = document.querySelector(".FiveDay")
        if(clearFiveDay !== null){
            clearFiveDay.remove()
        }

        var clearWeatherBig = document.querySelector(".BigWeather")
        if(clearWeatherBig !== null){
            clearWeatherBig.remove()
        }

            // Populate DOM with weather data
        //Container div for weather info
        var RHS = document.querySelector(".RHS")

        //Construct big weather card 
            //Create card divs
        var weatherCardBig = document.createElement("div")
        weatherCardBig.classList.add("card", "BigWeather")
        weatherCardBig.setAttribute("style", " margin-bottom: 2% ; margin-top: 2%")
        RHS.appendChild(weatherCardBig)

        var weatherCardBodyBig = document.createElement("div")
        weatherCardBodyBig.classList.add("card-body")
        weatherCardBodyBig.setAttribute("style", "padding-bottom: 0 ; margin-right: 0% ; width: 100%")
        weatherCardBig.appendChild(weatherCardBodyBig)

            //Date + Icon div
        var dateicon = document.createElement("div")
        dateicon.setAttribute("style", "width: 100% ; padding-bottom: 2%")
        dateicon.classList.add("align-items-center")
        weatherCardBodyBig.appendChild(dateicon)

            //Weather date element
        var weatherDate = document.createElement("h3")
        weatherDate.textContent = `${data.city.name} (${data.list[0].dt_txt.substring(8, 10)}/${data.list[0].dt_txt.substring(5, 7)}/${data.list[0].dt_txt.substring(0, 4)})`
        weatherDate.setAttribute("style", "margin: 0")
        dateicon.appendChild(weatherDate)

            //Weather icon element
        var icon = document.createElement("img")
        icon.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`)
        icon.setAttribute("style", "width: 3rem ; height: 3rem")
        icon.alt = "weather-icon"
        dateicon.appendChild(icon)


        //Weather data elements
            // Temp
        var weatherinfo = document.createElement("p")
        weatherinfo.textContent = `Temp: ${data.list[0].main.temp}°`
        weatherCardBodyBig.appendChild(weatherinfo)

            // Humidity
        var weatherinfo = document.createElement("p")
        weatherinfo.textContent = `Humidity: ${data.list[0].main.humidity}%`
        weatherCardBodyBig.appendChild(weatherinfo)

            // Wind Speed
        var weatherinfo = document.createElement("p")
        weatherinfo.textContent = `Wind speed: ${data.list[0].wind.speed}kmph`
        weatherCardBodyBig.appendChild(weatherinfo)

        //Construct 5-day forecast title
        var fivedayforecast = document.createElement("h4")
        fivedayforecast.classList.add("FiveDay")
        fivedayforecast.textContent = "5-Day Forecast:"
        RHS.appendChild(fivedayforecast)

        //Construct small weather cards under 'WeatherContainer' div
        var weatherContainer = document.createElement("div")
        weatherContainer.classList.add("weatherContainer")
        weatherContainer.setAttribute("style", "display: flex ; justify-content: space-evenly ; margin-top: 1%")
        RHS.appendChild(weatherContainer)

        for (var i=8; i<=40 ; i= i+8){ 
            if (i === 40){
                i = 39
            }
            
            //Create card divs
            var weatherCard = document.createElement("div")
            weatherCard.classList.add("card", "smallcard")
            weatherCard.setAttribute("style", "margin-right: 1.5%")
            weatherContainer.appendChild(weatherCard)

            var weatherCardBody = document.createElement("div")
            weatherCardBody.classList.add("card-body", "smallcard")
            weatherCardBody.setAttribute("style", "padding-bottom: 0 ; margin-right: 0%")
            weatherCard.appendChild(weatherCardBody)

            //Weather date element
            var weatherDate = document.createElement("h5")
            weatherDate.textContent = `${data.list[i].dt_txt.substring(8, 10)}/${data.list[i].dt_txt.substring(5, 7)}/${data.list[i].dt_txt.substring(0, 4)}`
            weatherCardBody.appendChild(weatherDate)

            //Weather icon element
            var icon = document.createElement("img")
            icon.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`)
            icon.setAttribute("style", "width: 4rem ; height: 4rem")
            icon.alt = "weather-icon"
            weatherCardBody.appendChild(icon)

            //Weather data elements
            for (prop in data.list[i].main){
                if (prop === "temp"){
                    var weatherinfo = document.createElement("p")
                    weatherinfo.textContent = `Temp: ${data.list[i].main[prop]}°`
                    weatherCardBody.appendChild(weatherinfo)
                }
                if (prop === "humidity"){
                    var weatherinfo = document.createElement("p")
                    weatherinfo.textContent = `Humidity: ${data.list[i].main[prop]}%`
                    weatherCardBody.appendChild(weatherinfo)
                }
            }
            var weatherinfo = document.createElement("p")
            weatherinfo.textContent = `Wind speed: ${data.list[i].wind.speed}kmph`
            weatherCardBody.appendChild(weatherinfo)
        
            if (i === 39){
                i = 41
            }
        }  
        saveCity(data.city.name)
        generateHistory()
    })
    .catch(function(){
        console.log("bad input")
    })
}



//Function which saves searched city to localstorage with the highest number
var saveCity = function(cityname){
    // Cities are saved to localStorage in the format 'SavedCityN', where N is a number of any length
    // This function checks for the highest value SavedCity (e.g. SavedCity999) in localStorage, so the key for the current city can be +1 of that
    
    // Iterate through localStorage
    num = 0
    for (var i = 0; i < localStorage.length; ++i) {
        // Get the i'th key from localStorage
        var key = localStorage.key(i)

        //Check if i'th key starts with 'SavedCity'
        if (key.substring(0, 9) === "SavedCity"){
        //The following lines of code will update the 'num' variable until it is equal to the highest SavedCity number in localStorage:
            // Get the corresponding number following the 'SavedCity' part of the key.
            key = key.substring(9)
            key = Number(key)

            // If the current SavedCity number exceeds the 'num' variable, update the num variable to equal the given SavedCity number
            if (key > num){
                num = key
            }
        }
        }

        //Increment the highest SavedCity number in localStorage by 1
        num = Number(num) + 1

        //Save the city to localstorage for the history
        localStorage.setItem(`SavedCity${num}`, `${cityname}`)   
}

//Function which generates search history from localstorage (maybe add 'clear history' button for flair?)
var generateHistory = function(){
    //delete existing history elements if they exist
    var historyEls = document.querySelector("#historyelements")
    if (historyEls !== null){
        historyEls.remove()
    }

    var historyEls = document.createElement("div")
    historyEls.id = "historyelements"
    historyEls.setAttribute("style", "display: flex; flex-direction: column")

    var LHS = document.querySelector(".LHS")
    LHS.appendChild(historyEls)

    //CODE WHICH GETS CITY HISTORY IN ORDER
    // Get an array of the keys in local storage that start with "SavedCity"
    var localStorageKeys = Object.keys(localStorage).filter(function(key) {
        return key.startsWith('SavedCity');
    });

    // Get an array of their key numbers
    localStorageKeyNumbers = []
    for (var i=0 ; i < localStorageKeys.length; i++){
        localStorageKeyNumbers.push(Number(localStorageKeys[i].substring(9)))
    }

    // Add the highest number (most recent) saved city to a list, for all keys - returns list of descending order
    descendingcities = []
    for (var i = 0 ; localStorageKeyNumbers.length > 0 ; i++){
        //Find the index of the highest key number using the key number list (which is in the same order as the keylist)
        maxIndex = localStorageKeyNumbers.indexOf(Math.max.apply(null, localStorageKeyNumbers))
        //push the corresponding city at that index in the keylist to the keylist to descendingcities list
        descendingcities.push(localStorageKeys[maxIndex])
        //remove the number from the key number list
        localStorageKeyNumbers.splice(maxIndex, 1)
        //remove the corresponding city from the keylist
        localStorageKeys.splice(maxIndex, 1)
    }

    //GENERATE ELEMENTS
    for (var i=0 ; i < descendingcities.length ; i++){
        console.log(localStorage[descendingcities[i]])
        var historicalEl = document.createElement("button")
        historicalEl.classList.add("btn", "btn-secondary", "bg-gradient")
        historicalEl.setAttribute("style","width: 100% ; height: auto; margin-bottom: 0.5rem")
        historicalEl.textContent = localStorage[descendingcities[i]]
        if (historicalEl.textContent === "Paris 01 Louvre"){
            historicalEl.textContent = "Palais-Royal"
        }

        historicalEl.addEventListener("click", function(event){
            event.preventDefault()
            getcoords(this.textContent)
            generateHistory()
        })

        historyEls.appendChild(historicalEl)            
    }
}

//On page load
generateHistory()