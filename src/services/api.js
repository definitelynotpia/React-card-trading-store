import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

const api = axios.create({
  baseURL: 'https://api.pokemontcg.io/v2',
  headers: {
    'X-Api-Key': API_KEY
  }
});

export default api;