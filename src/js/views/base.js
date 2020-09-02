export const APIkey = 'U1HakV7FFrT72CNt7sLDLrYf4Z03Infb';

export const elements = { //selecting dom elements that exist on load
    'searchForm': document.querySelector('.header__search'),
    'searchInput': document.querySelector('.header__city-query'),
    'searchBar': document.querySelector('.search-bar'),
    'gallery': document.querySelector('.gallery'),
    'body': document.querySelector('body')
}

export const domStrings = { //for dom elements that don't exist on load
    'loader': '.loading-icon',
    'searchBarList': '.search-bar__results',
    'searchBarPagination': '.search-bar__pagination',
    'paginationBtn': '.pagination-btn',
    'clearSearchBar': '.search-bar__clear-btn',
    'addCityBtn': '.search-bar__add-btn',
    'card': '.card',
    'cardRefreshBtn': '.card__refresh-btn',
    'cardDeleteBtn': '.card__delete-btn',
    'cardUnitBtns': '.card__unit-btns',
    'cardUnitBtn': '.card__unit-btn',
    'cardMetricBtn': '.card__unit-btn--metric',
    'cardImperialBtn': '.card__unit-btn--imperial',
    'galleryDeleteBtn': '.gallery__delete-btn',
    'galleryPagination': '.gallery__pagination',
    'galleryPaginationBtn': '.gallery__pagination-btn',
    'galleryPaginationText': '.gallery__pagination-text',
    'forecastBtn': '.card__forecast-btn',
    'popup': '.popup',
    'popupCard': '.popup__content',
    'popupAllForecasts': '.popup__forecasts',
    'popupForecast': '.popup__forecast',
    'popupCloseBtn': '.popup__delete-btn',
    'popupUnitBtns': '.popup__unit-btns',
    'popupUnitBtn': '.popup__unit-btn',
    'popupMetricBtn': '.popup__unit-btn--metric',
    'popupImperialBtn': '.popup__unit-btn--imperial',
    'popupDayBtns': '.popup__day-btns',
    'popupDayBtnSingle': '.popup__day-btn',
    'popupDayBtn': '.popup__day-btn--day',
    'popupNightBtn': '.popup__day-btn--night'
}

export const renderLoader = (parent, location) => {
    const loader = `
        <svg class="loading-icon loading-icon--${location}">
            <use xlink:href="img/sprite.svg#icon-spinner9"></use>
        </svg>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(domStrings.loader);
    if (loader) loader.parentElement.removeChild(loader);
};