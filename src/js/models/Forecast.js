import axios from 'axios';
import { APIkey } from '../views/base';

export default class Forecast {
    constructor (locationKey, cityName, stateName, countryName) {
        this.locationKey = locationKey;
        this.cityName = cityName;
        this.stateName = stateName;
        this.countryName = countryName;
    }

    async getData(type = 'metric') {
        try {
            const forecastData = await axios(`https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com/forecasts/v1/daily/5day/${this.locationKey}?apikey=${APIkey}&details=true${type === 'metric' ? '&metric=true' : ''}`);

            //getting our day objects
            const day1 = forecastData.data.DailyForecasts[1];
            const day2 = forecastData.data.DailyForecasts[2];
            const day3 = forecastData.data.DailyForecasts[3];
            this.day1 = {};
            this.day2 = {};
            this.day3 = {};

            const taskObjects = new Map();
            taskObjects.set(this.day1, day1);
            taskObjects.set(this.day2, day2);
            taskObjects.set(this.day3, day3);

            taskObjects.forEach((value, key) => {
                const fullDateAndTime = value.Date;
                const dateOnly = fullDateAndTime.substring(0, fullDateAndTime.lastIndexOf('T'));
                key.date = dateOnly.split('-').reverse().join('/');
                key.temperature = [value.Temperature.Minimum.Value, value.Temperature.Maximum.Value];
                key.perceivedTemperature = [value.RealFeelTemperature.Minimum.Value, value.RealFeelTemperature.Maximum.Value];
                key.airQuality = value.AirAndPollen.find(cur => cur.Name === 'AirQuality').Category;

                key.day = {};
                key.night = {};

                key.day.iconNum = value.Day.Icon;
                key.day.text = value.Day.IconPhrase;
                key.day.rainProbability = value.Day.RainProbability;
                key.day.snowProbability = value.Day.SnowProbability;
                key.day.windDirection = value.Day.Wind.Direction.English;
                key.day.windSpeed = value.Day.Wind.Speed.Value;
                key.day.windSpeedUnit = value.Day.Wind.Speed.Unit;

                key.night.iconNum = value.Night.Icon;
                key.night.text = value.Night.IconPhrase;
                key.night.rainProbability = value.Night.RainProbability;
                key.night.snowProbability = value.Night.SnowProbability;
                key.night.windDirection = value.Night.Wind.Direction.English;
                key.night.windSpeed = value.Night.Wind.Speed.Value;
                key.night.windSpeedUnit = value.Night.Wind.Speed.Unit;
            });

        } catch(error) {
            alert(error);
            alert('maximum number of api requests for the day could have been reached');
        }
    }
}