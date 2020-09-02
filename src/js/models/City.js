import axios from 'axios';
import { APIkey } from '../views/base';

export default class City {
    constructor(locationKey) {
        this.locationKey = locationKey;
    }

    async getData() {
        try {
            //is it efficient to do 2 API calls at once just to get the name? It seems to be tough to extract and store that information in the serch obj--> since the search obj is an ARRAY of ALL CITY OBJECTS            
            const nominalData = await axios(`https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com/locations/v1/${this.locationKey}?apikey=${APIkey}`);
            this.name = nominalData.data.EnglishName;
            this.stateName = nominalData.data.AdministrativeArea.LocalizedName;
            this.countryName = nominalData.data.Country.LocalizedName;
            this.nameIdentifier = `${this.name}, ${this.stateName}, ${this.countryName}`;

            const data = await axios(`https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com/currentconditions/v1/${this.locationKey}?apikey=${APIkey}&details=true`);
            const weatherData = data.data[0];
            this.weatherIconNum = weatherData.WeatherIcon; //number
            this.weatherText = weatherData.WeatherText;
            const timeString = weatherData.LocalObservationDateTime;
            this.time = timeString.substring(timeString.lastIndexOf('T') + 1, timeString.lastIndexOf('T') + 6);
            this.temperatureMetric = weatherData.Temperature.Metric.Value;
            this.temperatureImperial = weatherData.Temperature.Imperial.Value;
            this.humidity = weatherData.RelativeHumidity;
            this.windDirection = weatherData.Wind.Direction.English;
            this.windSpeedMetric = weatherData.Wind.Speed.Metric.Value;
            this.windSpeedMetricUnit = weatherData.Wind.Speed.Metric.Unit;
            this.windSpeedImperial = weatherData.Wind.Speed.Imperial.Value;
            this.windSpeedImperialUnit = weatherData.Wind.Speed.Imperial.Unit;
        } catch(error) {
            alert(error);
            alert('maximum number of api requests for the day could have been reached');
        }
    }
}