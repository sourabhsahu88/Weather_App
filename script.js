// console.log("hello duniya!!!");
// API_key="d1845658f92b31c64bd94f06f7188c9c";



// function randerWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)}°C`;
//     document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails(){
//     try{
//         let result =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${API_key}`);
//         let data = await result.json();
//         console.log("weather data is -->",data);
//         randerWeatherInfo(data);
//     }
//     catch(e){
//         console.log(e);
//     } 
// }


const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-serachWeather]");
const userContainer = document.querySelector(".weather-container");
const serachForm = document.querySelector("[data-serachForm]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFoundContainer = document.querySelector("[city-notFound]");


//initial variables 
let currentTab = userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionsStorage();

function switchTab(clickedTab){
    if(clickedTab!==currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(! serachForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            serachForm.classList.add("active");
        }
        else{
            serachForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFoundContainer.classList.remove("active");
            getfromSessionsStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function getfromSessionsStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
      const coordinates = JSON.parse(localCoordinates);
       fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;

    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("error in API calling",err);
    }
}   

function renderWeatherInfo(weatherInfo){
     //first we have to fetch the element
     const cityName = document.querySelector("[data-cityName]");
     const countryIcon = document.querySelector("[data-countryIcon]");
     const desc = document.querySelector("[data-waetherDesc]");
     const weatherIcon = document.querySelector("[data-weatherIcon]");
     const temp = document.querySelector("[data-temp]");
     const windspeed = document.querySelector("[data-dataspeed]");
     const humidity = document.querySelector("[data-humidity]");
     const cloudiness = document.querySelector("[data-clouds]");

     //fetch value from api and put it in elements 
       
     cityName.innerText = weatherInfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText = weatherInfo?.weather?.[0]?.description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
     temp.innerText = `${weatherInfo?.main?.temp} °C`;
     windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
     humidity.innerText = `${weatherInfo?.main?.humidity}%`;
     cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){

  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    throw Error("geolocation not supported!!!");
  }

}

function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}  

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",()=>{
    getLocation();
});

const searchInput = document.querySelector("[data-serachInput]");

serachForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") 
      return ;
    else{
    searchInput.value="";
    fetchSearchWeatherInfo(cityName);
    }
});


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFoundContainer.classList.remove("active");

    try{
       let response = await 
       fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
       );
       let data = await response.json();
       if(data?.cod==='404'){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFoundContainer.classList.add("active");
       }
       else{
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       notFoundContainer.classList.remove("active");
       renderWeatherInfo(data);
       }
    }
    catch(err){
        notFoundContainer.classList.remove("active");
        console.log("error in api fetching");
        console.log(err);
    }
}