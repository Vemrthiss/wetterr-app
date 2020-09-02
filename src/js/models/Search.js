import axios from 'axios';
import { APIkey } from '../views/base';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${APIkey}&q=${this.query}`);
            this.result = res.data; //an array of objects each representing a city
        } catch (error) {
            alert('Maximum number of requests from API could have been reached for the day');
        }
    }
}