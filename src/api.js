// src/api.js
import axios from 'axios';

const API_KEY = 'b5d15fa17676447771db0ab7d3c7faa2'; // 실제 TMDB API 키로 변경
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMovies = async (endpoint, params = {}) => {
  const response = await axios.get(`${BASE_URL}/${endpoint}`, {
    params: { ...params, api_key: API_KEY },
  });
  return response.data;
};
