import { elements, domStrings } from './base';

export const renderEmptyPopup = () => {
    const markup = `
        <div class="popup">
            <div class="popup__content"></div>
        </div>
    `;
    elements.body.insertAdjacentHTML('beforeend', markup);
}

const generateSingleResult = (dayObj, index, unit = 'metric', time = 'day') => {
    return `
        <div class="popup__forecast" data-identify="${index}">
            <div class="popup__upper">
                <p class="popup__date">Date: ${dayObj.date}</p>
                <p class="popup__temperature">Temperature: ${dayObj.temperature[0]} / ${dayObj.temperature[1]} &deg;${unit === 'metric' ? 'C' : 'F'}</p>
                <p class="popup__temperature-felt">Perceived Temperature: ${dayObj.perceivedTemperature[0]} / ${dayObj.perceivedTemperature[1]} &deg;${unit === 'metric' ? 'C' : 'F'}</p>
                <p class="popup__air-quality">Air Quality: ${dayObj.airQuality}</p>
            </div>

            <div class="popup__bottom">
                <div class="popup__day-btns">
                    <button class="popup__day-btn popup__day-btn--day popup__day-btn--active btn btn-secondary" data-identify="${index}">Day</button>
                    <button class="popup__day-btn popup__day-btn--night btn btn-secondary" data-identify="${index}">Night</button>
                </div>
                <img src="img/weather_icons/${dayObj[`${time}`].iconNum}.png" alt="weather icon" class="popup__weather-icon">
                <p class="popup__weather-text">${dayObj[`${time}`].text}</p>
                <p class="popup__wind">Wind: ${dayObj[`${time}`].windDirection}, at ${dayObj[`${time}`].windSpeed} ${dayObj[`${time}`].windSpeedUnit}</p>
                <p class="popup__rain-prob">Rain Probability: ${dayObj[`${time}`].rainProbability}%</p>
                <p class="popup__snow-prob">Snow Probability: ${dayObj[`${time}`].snowProbability}%</p>
            </div>
        </div>
    `;
}

export const renderSingleResult = (day, index, unit = 'metric', time = 'day') => {
    const allForecasts = document.querySelector(domStrings.popupAllForecasts);
    const markup = generateSingleResult(day, index, unit, time);

    if (index === 0) {
        allForecasts.insertAdjacentHTML('afterbegin', markup);
    } else if (index === 2) {
        allForecasts.insertAdjacentHTML('beforeend', markup);
    } else {
        document.querySelectorAll(domStrings.popupForecast)[0].insertAdjacentHTML('afterend', markup);
    }
}

export const renderFullResult = (forecast, unit = 'metric', time = 'day') => {
    const dayObjs = [forecast.day1, forecast.day2, forecast.day3];
    const forecastMarkup = dayObjs.map((cur, index) => generateSingleResult(cur, index, unit, time)).join(' ');

    const markup = `
        <div class="popup__main-btns">
            <div class="popup__unit-btns">
                <button class="popup__unit-btn popup__unit-btn--metric popup__unit-btn--active btn btn-secondary">Metric</button>
                <button class="popup__unit-btn popup__unit-btn--imperial btn btn-secondary">Imperial</button>
            </div>
            <button class="popup__delete-btn btn btn-hidden">
                <svg class="popup__delete-icon">
                    <use xlink:href="img/sprite.svg#icon-cancel-circle"></use>
                </svg>
            </button>
        </div>

        <div class="popup__header">
            <p class="popup__city-name">${forecast.cityName}</p>
            <p class="popup__state-country-name">${forecast.stateName}, ${forecast.countryName}</p>
            <p class="popup__header-text">Forecast for the next three days <span class="popup__header-dates">(${forecast.day1.date} &mdash; ${forecast.day3.date})</span></p>
        </div>

        <div class="popup__forecasts">
            ${forecastMarkup}
        </div>
    `;
    document.querySelector(domStrings.popupCard).insertAdjacentHTML('beforeend', markup);
}

export const clearPopupContent = (content) => {
    content.innerHTML = '';
}

export const clearForecastDiv = (day) => {
    day.parentElement.removeChild(day);
}

export const clearPopup = () => {
    const popup = document.querySelector(domStrings.popup);
    popup.parentElement.removeChild(popup);
}

export const controlUnitBtnColor = (unitBtns, btn) => {
    unitBtns.forEach(cur => {
        if (btn.classList.contains('popup__unit-btn--metric') && cur.classList.contains('popup__unit-btn--metric')) {
            cur.classList.add('popup__unit-btn--active');
        } else if (btn.classList.contains('popup__unit-btn--metric') && cur.classList.contains('popup__unit-btn--imperial')) {
            cur.classList.remove('popup__unit-btn--active');
        } else if (btn.classList.contains('popup__unit-btn--imperial') && cur.classList.contains('popup__unit-btn--metric')) {
            cur.classList.remove('popup__unit-btn--active');
        } else if (btn.classList.contains('popup__unit-btn--imperial') && cur.classList.contains('popup__unit-btn--imperial')) {
            cur.classList.add('popup__unit-btn--active');
        }
    });
}

export const controlDayBtnColor = (dayBtns, btn) => {
    dayBtns.forEach(cur => {
        if (btn.classList.contains('popup__day-btn--day') && cur.classList.contains('popup__day-btn--day')) {
            cur.classList.add('popup__day-btn--active');
        } else if (btn.classList.contains('popup__day-btn--day') && cur.classList.contains('popup__day-btn--night')) {
            cur.classList.remove('popup__day-btn--active');
        } else if (btn.classList.contains('popup__day-btn--night') && cur.classList.contains('popup__day-btn--day')) {
            cur.classList.remove('popup__day-btn--active');
        } else if (btn.classList.contains('popup__day-btn--night') && cur.classList.contains('popup__day-btn--night')) {
            cur.classList.add('popup__day-btn--active');
        }
    });
}

export const renderDeleteBtn = () => {
    const markup = `
        <div class="popup__main-btns">
            <button class="popup__delete-btn btn btn-hidden">
                <svg class="popup__delete-icon">
                    <use xlink:href="img/sprite.svg#icon-cancel-circle"></use>
                </svg>
            </button>
        </div>
    `;
    document.querySelector(domStrings.popupCard).insertAdjacentHTML('beforeend', markup);
}