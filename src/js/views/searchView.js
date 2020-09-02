import { elements, domStrings } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearSearchBar = () => {
    elements.searchBar.innerHTML = ''; //for the WHOLE search bar
}

const renderHeading = type => {
    let markup;
    if (type === 'fail') {
        markup = `<h3 class="search-bar__heading-failed">Could not find any city</h3>`;
    } else if (type === 'success') {
        markup = `<h3 class="search-bar__heading">Select your city</h3>`;
    }
    elements.searchBar.insertAdjacentHTML('afterbegin', markup);
}

const limitCityTitle = (title, limit = 30) => { //limit the number of characters in our title
    if (title.length > limit) {
        let newTitle = title.split('').splice(0, limit)

        //return new title with three dots behind
        return `${newTitle.join('')}...`;
    } else {
        return title;
    }
}

const renderCityList = () => {
    const markup = `
        <ul class="search-bar__results"></ul>
    `;
    elements.searchBar.insertAdjacentHTML('beforeend', markup);
}

const renderCity = city => {
    const markup = `
        <li class="search-bar__result">
            <p class="search-bar__result-name">${limitCityTitle(`${city.EnglishName}, ${city.AdministrativeArea.LocalizedName}, ${city.Country.LocalizedName}`)}</p>
            <button class="search-bar__add-btn btn btn-hidden" data-locationKey="${city.Key}">
                <svg class="search-bar__icon search-bar__icon--add">
                    <use xlink:href="img/sprite.svg#icon-plus"></use>
                </svg>
            </button>
        </li>
    `;
    document.querySelector(domStrings.searchBarList).insertAdjacentHTML('beforeend', markup);
}

//for pagination (forward or backward buttons)
const createButton = (page, type) => `
    <button class="search-bar__pagination-btn pagination-btn pagination-btn--${type} btn btn-hidden" data-goto=${type === 'backward' ? page - 1 : page + 1}>
        <svg class="pagination-btn__icon pagination-btn__icon--${type}">
            <use xlink:href="img/sprite.svg#icon-circle-${type === 'backward' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderPagination = () => {
    const markup = `
        <div class="search-bar__pagination"></div>
    `;
    elements.searchBar.insertAdjacentHTML('beforeend', markup);
}

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    const searchBarPagination = document.querySelector(domStrings.searchBarPagination);

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

    if (buttonBack) searchBarPagination.insertAdjacentHTML('afterbegin', buttonBack);
    searchBarPagination.insertAdjacentHTML('beforeend', `Page ${page}`);
    if (buttonNext) searchBarPagination.insertAdjacentHTML('beforeend', buttonNext);
}

const renderClearBtn = () => {
    const markup = `<button class="search-bar__clear-btn btn-primary btn">
        clear list
    </button>`;
    elements.searchBar.insertAdjacentHTML('beforeend', markup);
}

export const renderResult = (cities, page = 1, resPerPage = 6) => {
    if (cities.length === 0) { //when there are no search results
        //render failed heading
        renderHeading('fail');

    } else { //if there are search results
        //render successful heading
        renderHeading('success');

        //render ul element in searchBar
        renderCityList();

        // render results of current page 
        const start = (page -1) * resPerPage;
        const end = page * resPerPage;

        cities.slice(start, end).forEach(renderCity);

        // render pagination div in html before putting the buttons
        renderPagination();

        // render pagination buttons 
        renderButtons(page, cities.length, resPerPage);

        //render clear button
        renderClearBtn();
}
};