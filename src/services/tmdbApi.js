import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "pt-BR",
  },
});

export const tmdbApi = {
  getPopularMovies: (page = 1) => api.get("/movie/popular", { params: { page } }),
  searchMovies: (query, page = 1) => api.get("/search/movie", { params: { query, page } }),
  getMovieDetails: (id) => api.get(`/movie/${id}`),
  getMovieCredits: (id) => api.get(`/movie/${id}/credits`),
};

export const getImageUrl = (path) => `${IMAGE_BASE_URL}${path}`;
