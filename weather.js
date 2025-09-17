const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const notFoundSection= document.querySelector('.not-found');
const searchCitySection= document.querySelector('.search-city');
const weatherInfoSection= document.querySelector('.weather-info');
const countryTxt= document.querySelector('.country-txt');
const tempTxt= document.querySelector('.temp-txt');
const conditionTxt= document.querySelector('.condition-txt');
const humidityValueTxt= document.querySelector('.humidity-value-txt');
const windValueTxt= document.querySelector('.wind-value-txt');
const weatherSummaryImg= document.querySelector('.weather-summary-img');
const currentDateTxt= document.querySelector('.current-date-txt');
const forecastItemContainer= document.querySelector('.forecast-item-container');



const apiKey = '17cbf9dfbbde05d29eb01ea698d560ce';

searchBtn.addEventListener('click' , ( )  => {

        if(cityInput.value.trim() !=' '){

        updateWeatherInfo(cityInput.value )        
        cityInput.value ='';
        cityInput.blur( );
        }
})
cityInput.addEventListener('keydown' , (event) =>{
        if(event.key =='Enter' &&
                cityInput.value.trim() !=' '
        )
        {
        updateWeatherInfo(cityInput.value)        
        cityInput.value ='';
        cityInput.blur();

        }

})

async function getFetchData(endPoint, city){
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

        const  response = await fetch(apiUrl);
        return response.json();

}

function getWeatherIcon(id){
        if ( id <= 232 ) return ' thunderstorm.svg'
        if ( id <= 321 ) return 'drizzle.svg'
        if ( id <= 531 ) return 'rain.svg'
        if ( id <= 622 ) return 'snow.svg'
         if ( id <=781  ) return 'atmosphere.svg'
        if ( id <= 800 ) return 'clear.svg'
        if ( id <= 804 ) return 'clouds.svg'
        else return 'clouds.svg';
}

function getCurrentDate( ){
        const currentDate = new Date( );
        const options = {
                 weekday: 'short', 
                  day: '2-digit',
                 month: 'short',
                };
                return currentDate.toLocaleDateString('en-US', options);
}

 async function   updateWeatherInfo(city) {
const weatherData = await  getFetchData('weather' , city);

if(weatherData.cod == '404'){
        showDisplaySection(notFoundSection);
        return;
}

const{
        name: country,
        main: { temp, humidity },
        weather: [ { id, main } ],
        wind: { speed: windSpeed }
} = weatherData

countryTxt.textContent = country;
tempTxt.textContent = Math.round(temp) + ' °C ';
conditionTxt.textContent = main;
humidityValueTxt.textContent = `${humidity} %`;
windValueTxt.textContent = `${windSpeed} km/h`;

currentDateTxt.textContent = getCurrentDate();
weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

await  updateForecastInfo(city);

     showDisplaySection(weatherInfoSection);
}      

async function updateForecastInfo(city){
const forecastData = await getFetchData('forecast' , city);

const timeTiken = '12:00:00';
const todayDate =new Date( ).toISOString().split('T')[0];

forecastItemContainer.innerHTML =''

forecastData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTiken) &&
        !forecastWeather.dt_txt.includes(todayDate)){
           updateForecastItem(forecastWeather);
        } 
})

}


function   updateForecastItem(weatherData) {
const{
        dt_txt:date,
         weather: [ { id } ],
        main: { temp },
}= weatherData

const dateTaken = new Date(date);
const dateOption =  {
        month: 'short',
        day: '2-digit',

};

const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

const forecastItem =`
                <div class="forecast-item">
                        <h5 class="forecast-item-date regular2-txt">${dateResult}</h5>

                        <img class="forecast-item-img" src="assets/weather/${getWeatherIcon(id)}" alt="">
                        <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
                </div>
`

forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem);

const formattedDate = dateTaken.toLocaleDateString('en-US', dateOption);
}




function showDisplaySection(section){
        [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')
        section.style.display = 'flex';

};

 