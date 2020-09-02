import { elements, domStrings } from './base';

const renderBlankCard = () => {
    const markup = `<div class="card"></div>`;
    elements.gallery.insertAdjacentHTML('beforeend', markup);
}

export const renderCity = (city, card = false, unit = 'metric') => {
    const markup = `
        <img src="img/weather_icons/${city.weatherIconNum}.png" alt="weather icon" class="card__weather-icon">

        <button class="card__delete-btn btn btn-hidden" data-identify="${city.name}, ${city.stateName}, ${city.countryName}">
            <svg class="card__delete-icon">
                <use xlink:href="img/sprite.svg#icon-bin"></use>
            </svg>
        </button>
        
        <div class="card__collection-btn">
            <div class="card__unit-btns">
                <button class="${unit === 'metric' ? 'card__unit-btn card__unit-btn--active': 'card__unit-btn'} card__unit-btn--metric  btn btn-secondary" data-identify="${city.name}, ${city.stateName}, ${city.countryName}">Metric</button>
                <button class="${unit !== 'metric' ? 'card__unit-btn card__unit-btn--active': 'card__unit-btn'} card__unit-btn--imperial btn btn-secondary" data-identify="${city.name}, ${city.stateName}, ${city.countryName}">Imperial</button>
            </div>

            <button class="card__refresh-btn btn btn-secondary" data-identify="${city.name}, ${city.stateName}, ${city.countryName}">
                <svg class="card__refresh-icon">
                    <use xlink:href="img/sprite.svg#icon-spinner11"></use>
                </svg>
                <p class="card__refresh-btn-text">Refresh</p>
            </button>
        </div>

        <div class="card__header">
            <div class="card__city-name">${city.name}</div>
            <div class="card__title">${city.stateName}, ${city.countryName}</div>
            <div class="card__weather-text">${city.weatherText}</div>
            <div class="card__time">Local Time: ${city.time}</div>
        </div>

        <div class="card__body">
            <p class="card__temperature">Temperature: ${unit === 'metric' ? city.temperatureMetric : city.temperatureImperial} &deg;${unit === 'metric' ? 'C' : 'F'}</p>
            <p class="card__humidity">Humidity: ${city.humidity}%</p>
            <p class="card__wind">Wind: ${city.windDirection}, at ${unit === 'metric' ? city.windSpeedMetric : city.windSpeedImperial} ${unit === 'metric' ? city.windSpeedMetricUnit : city.windSpeedImperialUnit}</p>

            <button class="card__forecast-btn btn-primary btn" data-identify="${city.name}, ${city.stateName}, ${city.countryName}">view forecast</button>
        </div>
    `;

    if (!card) { //if card arg was not provided i.e. add a NEW CARD to UI
        const newCard = document.querySelector(`.gallery ${domStrings.card}:last-child`);
        newCard.setAttribute('data-identify', `${city.name}, ${city.stateName}, ${city.countryName}`);
        newCard.insertAdjacentHTML('beforeend', markup);
    } else { //update UI of the given CARD DOM ELEMENT
        card.insertAdjacentHTML('beforeend', markup);
    }
}

export const clearCard = (card) => {
    card.innerHTML = "";
}

export const controlUnitBtnColor = (targetedUnitBtns, btn) => {
    targetedUnitBtns.forEach(cur => {
        if (btn.classList.contains('card__unit-btn--metric') && cur.classList.contains('card__unit-btn--metric')) {
            cur.classList.add('card__unit-btn--active');
        } else if (btn.classList.contains('card__unit-btn--metric') && cur.classList.contains('card__unit-btn--imperial')) {
            cur.classList.remove('card__unit-btn--active');
        } else if (btn.classList.contains('card__unit-btn--imperial') && cur.classList.contains('card__unit-btn--metric')) {
            cur.classList.remove('card__unit-btn--active');
        } else if (btn.classList.contains('card__unit-btn--imperial') && cur.classList.contains('card__unit-btn--imperial')) {
            cur.classList.add('card__unit-btn--active');
        }
    });
}

export const deleteCard = (card) => {
    card.parentElement.removeChild(card);
}

export const clearGallery = () => {
    elements.gallery.innerHTML = '';
}

const renderPagination = () => {
    const markup = `
        <div class="gallery__pagination"></div>
    `;
    elements.gallery.insertAdjacentHTML('afterbegin', markup);
}

// for pagination buttons
const createButton = (page, type) => `
    <button class="gallery__pagination-btn pagination-btn pagination-btn--${type} btn btn-hidden" data-goto=${type === 'backward' ? page - 1 : page + 1}>
        <svg class="pagination-btn__icon pagination-btn__icon--${type}">
            <use xlink:href="img/sprite.svg#icon-circle-${type === 'backward' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderPaginationButtons = (page, numCities, resPerPage) => {
    const pages = Math.ceil(numCities / resPerPage);
    const galleryPagination = document.querySelector(domStrings.galleryPagination);

    let buttonBack, buttonNext;
    if (page === 1 && pages > 1) {
        //1 button to go to next page
        buttonNext = createButton(page, 'forward');
    } else if (page < pages) {
        // 2 buttons to go forward and backward
        buttonBack = createButton(page, 'backward');
        buttonNext = createButton(page, 'forward')
    } else if (page === pages && pages > 1) { // i.e. if page number is last page (i.e. total number of pages)
        // 1 button to go to prev page
        buttonBack = createButton(page, 'backward');
    }

    if (buttonBack) galleryPagination.insertAdjacentHTML('afterbegin', buttonBack);
    galleryPagination.insertAdjacentHTML('beforeend', `<p class="gallery__pagination-text">Page ${page}</p>`);
    if (buttonNext) galleryPagination.insertAdjacentHTML('beforeend', buttonNext);
}

const renderClearBtn = () => {
    const markup = `<button class="gallery__delete-btn btn btn-hidden">
        <svg class="gallery__delete-icon">
            <use xlink:href="img/sprite.svg#icon-bin"></use>
        </svg>
        <p class="gallery__delete-text">Delete all cards</p>
    </button>`;
    elements.gallery.insertAdjacentHTML('afterbegin', markup);
}

export const renderResult = (cities, page = 1, resPerPage = 2) => {
    if (cities.length >= 3) {
        renderPagination();

        // render pagination buttons 
        renderPaginationButtons(page, cities.length, resPerPage);
    }

    // render gallery clear btn
    renderClearBtn();

    //determining the indices of the 2 cities to display
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    cities.slice(start, end).forEach(cur => {
        renderBlankCard();
        renderCity(cur);
    });
}

export const getCurrentPageNumber = () => {
    const pageText = document.querySelector(domStrings.galleryPaginationText).textContent;
    const pageTextArr = pageText.split(' ');
    return pageTextArr[1]; //returns the page number as a string
}