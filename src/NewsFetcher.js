import axios from 'axios'

const baseUrl = 'http://localhost:5000/';
function get(url, params) {
    url = baseUrl + url;
    return axios.get(url, {params: params})
        .then(function (response) {
            return response.data;
        });
}

const NewsFetcher = { get };
export default NewsFetcher;