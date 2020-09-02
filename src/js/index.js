//this is the global app controller
import { elements, domStrings, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import City from './models/City';
import Forecast from './models/Forecast';
import * as searchView from './views/searchView';
import * as cityView from './views/cityView';
import * as forecastView from './views/forecastView';

/* Global state (object) of the app
    - search object: containing the query and an array of results
    - cities array: a dynamic array containing individual city objects
    - forecast object: containing forecast data for the next 5 days as a single object (though we only want 3)
*/
const state = {};

// -----------------SEARCH CONTROLLER------------------------
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();

    if (query) { //checks if query is a valid string
        // 2) new search object and add to state obj
        state.search = new Search(query);

        // 3) prepare UI for results (e.g. clearing previous results, display loading spinner)
        searchView.clearInput();
        searchView.clearSearchBar();
        renderLoader(elements.searchBar, 'searchbar');

        try {
            // 4) search for cities
            await state.search.getResults(); //await this data as it takes time to get data and this method is an async function: wraps the returned result as a promise (hence we can await it)

            // 5) render results in UI
            clearLoader();
            searchView.renderResult(state.search.result);

        } catch(error) {
            alert(error);
            clearLoader(); //make loader go away when there is an error
        }
    }
}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault(); // prevent default actions of the submit event (i.e. reloading the page)
    controlSearch();
});

// using event delegation on the whole search-bar element since buttons don't exist on load (for page buttons and clear button)
elements.searchBar.addEventListener('click', event => {
    const paginationBtn = event.target.closest(domStrings.paginationBtn);
    const clearBtn = event.target.closest(domStrings.clearSearchBar);
    const addBtn = event.target.closest(domStrings.addCityBtn);

    if (paginationBtn) { //if either pagination button was clicked
        const goToPage = parseInt(paginationBtn.dataset.goto, 10);
        searchView.clearSearchBar();
        searchView.renderResult(state.search.result, goToPage);
        
    } else if (clearBtn) { //if element clicked was the clear button (the element clicked will traverse up the DOM to find the element specified in this closest method, if not found, returns null)
        searchView.clearSearchBar();

    } else if (addBtn) { //for adding new city
        const locationKey = parseInt(addBtn.dataset.locationkey, 10);
        controlCityCard(locationKey);
    }
});

// -------------------CITY CONTROLLER-----------------------------------
const controlCityCard = async (locationKey) => {
    // 1) create new cities array if it doesn't already exist
    if (!state.cities) state.cities = [];

    // 2) create new city object
    const newCity = new City(locationKey);

    // 2a) check if this city object already exists in the state cities array, a new card won't be added
    const cityAlreadyAdded = state.cities.find(cur => cur.locationKey === locationKey);

    if (cityAlreadyAdded) {
        alert('City has already been added, please choose another city');

    } else { //to make sure that only unique cities can be added and shown in gallery
        // 3) prepare UI for results: render loader in gallery
        cityView.clearGallery();
        renderLoader(elements.gallery, 'gallery');

        // 4) get weather data for that city
        try { 
            await newCity.getData();

            // 5) add city to state object's cities array
            state.cities.unshift(newCity); 

            // 6) render UI for card
            clearLoader(); //clear loader before rendering results
            cityView.renderResult(state.cities);
            
        } catch (error) {
            alert(error);
            clearLoader();
        }
    }
    //console.log(state);  //testing
}

//general function to generate specific functions for the refresh, unit change and delete buttons
const controlCityData = async (type, btn) => {
    const targetedCityObj = state.cities.find(cur => cur.nameIdentifier === btn.dataset.identify); //finding the specific city
    const allCards = document.querySelectorAll(domStrings.card);
    const targetedCard = Array.from(allCards).find(cur => cur.dataset.identify === btn.dataset.identify); //finding the targeted card

    if (type === 'refresh') { //re-fetch weather data from API FOR THAT SPECIFIC CARD
        //determine what unit to display in on refresh
        const allUnitBtns = document.querySelectorAll(domStrings.cardUnitBtn); //nodelist of ALL unit btns
        const targetedUnitBtns = Array.from(allUnitBtns).filter(cur => cur.dataset.identify === targetedCard.dataset.identify); //filter out the 2 btns of current card
        const activeUnitBtn = targetedUnitBtns.find(cur => cur.classList.contains('card__unit-btn--active'));

        //clearing html of targeted card and rendering loader
        cityView.clearCard(targetedCard); 
        renderLoader(targetedCard, 'card');

        try {
            await targetedCityObj.getData(); //re-fetching data for THAT CITY from the API

            // re-render results FOR THAT CARD and display based on previous active unit
            clearLoader();
            cityView.renderCity(targetedCityObj, targetedCard, activeUnitBtn.classList.contains('card__unit-btn--metric') ? 'metric' : 'imperial');
        } catch(error) {
            alert(error);
            clearLoader();
        }
    } else if (type === 'unit') { //for unit buttons
        // 1) clear html of targeted card
        cityView.clearCard(targetedCard);

        // 2) re-render result (no re-fetching of API)
        cityView.renderCity(targetedCityObj, targetedCard, btn.classList.contains('card__unit-btn--metric') ? 'metric' : 'imperial');

        // 3) add/remove active class for both buttons (cannot use toggle--> what if the user clicks on the same button?)
        const allUnitBtns = document.querySelectorAll(domStrings.cardUnitBtn); //nodelist of ALL unit btns
        const targetedUnitBtns = Array.from(allUnitBtns).filter(cur => cur.dataset.identify === targetedCard.dataset.identify); //filter out the 2 btns of current card
        
        cityView.controlUnitBtnColor(targetedUnitBtns, btn);

    } else if (type === 'delete') { //for delete button: remove card from view and state cities array
        cityView.deleteCard(targetedCard);
        state.cities = state.cities.filter(cur => cur !== targetedCityObj);

        if (state.cities.length > 2) {
            const currentPage = parseInt(cityView.getCurrentPageNumber(), 10);
            cityView.clearGallery();
            cityView.renderResult(state.cities, currentPage); //re-render the CURRENT PAGE after deleting a card
        } else if (state.cities.length === 0) {
            cityView.clearGallery(); //if after deleting this card and no more results, empty the gallery completely
        } else {
            cityView.clearGallery();
            cityView.renderResult(state.cities);
        }
    }
}


//using event delegation for refresh, unit and delete buttons in the card (which doesn't exist on load) and pagination
elements.gallery.addEventListener('click', event => {
    const refreshBtn = event.target.closest(domStrings.cardRefreshBtn);
    const unitBtns = event.target.closest(domStrings.cardUnitBtns);
    const metricBtn = event.target.closest(domStrings.cardMetricBtn);
    const imperialBtn = event.target.closest(domStrings.cardImperialBtn);
    const cardDeleteBtn = event.target.closest(domStrings.cardDeleteBtn);
    const galleryDeleteBtn = event.target.closest(domStrings.galleryDeleteBtn);
    const galleryPaginationBtn = event.target.closest(domStrings.galleryPaginationBtn);
    const cardForecastBtn = event.target.closest(domStrings.forecastBtn);

    if (refreshBtn) {
        controlCityData('refresh', refreshBtn);
    } else if (unitBtns) {
        controlCityData('unit', metricBtn ? metricBtn : imperialBtn);
    } else if (cardDeleteBtn) {
        controlCityData('delete', cardDeleteBtn);
    } else if (galleryDeleteBtn) {
        cityView.clearGallery();
        state.cities = [];
    } else if (galleryPaginationBtn) { //for gallery pagination
        const goToPage = parseInt(galleryPaginationBtn.dataset.goto, 10);
        cityView.clearGallery();
        cityView.renderResult(state.cities, goToPage);
    } else if (cardForecastBtn) { //for showing forecast popup
        const targetedCityObj = state.cities.find(cur => cur.nameIdentifier === cardForecastBtn.dataset.identify);
        const locationKey = targetedCityObj.locationKey;
        const nameIdentifier = targetedCityObj.nameIdentifier.split(', ');
        controlForecast(locationKey, nameIdentifier);
    }
    // console.log(state); //testing
})

// ----------------------FORECAST CONTROLLER--------------------------------
const controlForecast = async(locationKey, nameIdentifier) => {
    // 1) create new forecast object and add to state object
    state.forecast = new Forecast(locationKey, ...nameIdentifier);

    // 2) render popup (empty) and loader (prepare UI for results)
    forecastView.renderEmptyPopup();
    renderLoader(document.querySelector(domStrings.popupCard), 'forecast');

    // 3) fetch data
    try {
        await state.forecast.getData();

        // 4) render UI
        forecastView.renderFullResult(state.forecast);
        clearLoader();
    } catch(error) {
        alert(error);
        clearLoader();
        forecastView.renderDeleteBtn(); // in case run into error, still can close popup;
    }
}

// general function to churn out specific functions based on what forecast buttons were clicked
const controlForecastData = async(type, btn) => {
    if (type === 'unit') {
        try {
            // 1) decide what unit to display
            const unitToDisplay = btn.classList.contains('popup__unit-btn--metric') ? 'metric' : 'imperial';

            // 2) clear content and render loader (preparing UI for results)
            const content = document.querySelector(domStrings.popupCard);
            forecastView.clearPopupContent(content);
            renderLoader(content, 'forecast');

            // 3) re-fetch data as the API only fetches 1 unit at a time
            await state.forecast.getData(unitToDisplay);

            // 4) clear loader and render results with right units
            clearLoader();
            forecastView.renderFullResult(state.forecast, unitToDisplay);

            // 5) change button active class
            const unitBtns = document.querySelectorAll(domStrings.popupUnitBtn);
            forecastView.controlUnitBtnColor(unitBtns, btn);
            
        } catch(error) {
            alert(error);
            clearLoader();
        }
    } else if (type === 'time') {
        const allDays = document.querySelectorAll(domStrings.popupForecast);
        const dayIndex = btn.dataset.identify;
        const dayIndexNum = parseInt(dayIndex, 10);
        const targetedDayUI = Array.from(allDays).find(cur => cur.dataset.identify === dayIndex); //finding the targeted day
        const timeToDisplay = btn.classList.contains('popup__day-btn--day') ? 'day' : 'night';
        
        // clear that 1 day's div
        forecastView.clearForecastDiv(targetedDayUI);

        // re-render result for that day with a new time
        forecastView.renderSingleResult(state.forecast[`day${dayIndexNum + 1}`], dayIndexNum, 'metric', timeToDisplay);
    
        // change button active class for that GROUP OF BUTTONS
        const allDayBtns = document.querySelectorAll(domStrings.popupDayBtnSingle);
        const targetedDayBtns = Array.from(allDayBtns).filter(cur => cur.dataset.identify === btn.dataset.identify); //filter out the 2 btns of current card

        forecastView.controlDayBtnColor(targetedDayBtns, btn);
        // console.log(state); //testing
    } else if (type === 'delete') { //closing the popup
        forecastView.clearPopup();
        delete state.forecast;
    }
}

// event listeners for popup card, no choice but have to catch the events in the body element
elements.body.addEventListener('click', event => {
    const closeBtn = event.target.closest(domStrings.popupCloseBtn);
    const unitBtns = event.target.closest(domStrings.popupUnitBtns);
    const metricBtn = event.target.closest(domStrings.popupMetricBtn);
    const imperialBtn = event.target.closest(domStrings.popupImperialBtn);
    const dayBtns = event.target.closest(domStrings.popupDayBtns);
    const dayBtn = event.target.closest(domStrings.popupDayBtn);
    const nightBtn = event.target.closest(domStrings.popupNightBtn);

    if (closeBtn) {
        controlForecastData('delete');
    } else if (unitBtns) {
        controlForecastData('unit', metricBtn ? metricBtn : imperialBtn);
    } else if (dayBtns) {
        controlForecastData('time', dayBtn ? dayBtn : nightBtn);
    }
})


// -----------------------WINDOW EVENTS FOR PERSISTENT DATA STORAGE: LOCALSTORAGE----------

window.addEventListener('unload', () => {
    // storing the final cities array in state object to localstorage before the tab closes
    const citiesArr = JSON.stringify(state.cities);
    localStorage.setItem('cities', citiesArr);
});

window.addEventListener('load', () => {
    // 1) get cities array from local storage
    const citiesArr = JSON.parse(localStorage.getItem('cities'));

    // 2) render the cities
    if (citiesArr.length !== 0) {
        cityView.renderResult(citiesArr);
        state.cities = [];
        citiesArr.forEach(async(cur) => {
            try {
                const newCity = new City(cur.locationKey);
                await newCity.getData();
                state.cities.push(newCity);
            } catch(error) {
                alert(error);
            }
        }); 
        cityView.renderResult(state.cities); //strangely, i want to refresh the data for the user's previous cities before displaying them but it doesn't work
    }
});
