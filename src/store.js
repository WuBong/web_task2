// src/store.js
import { createStore } from 'vuex';
import { getMovies } from './api'; // 여기에서 getMovies를 가져옵니다

export default createStore({
  state: {
    movies: [],
    wishlist: [],
    isLoggedIn: false,
  },
  mutations: {
    setMovies(state, movies) {
      state.movies = movies;
    },
    toggleWishlist(state, movie) {
      const index = state.wishlist.findIndex((m) => m.id === movie.id);
      if (index === -1) {
        state.wishlist.push(movie);
      } else {
        state.wishlist.splice(index, 1);
      }
    },
    setLoginStatus(state, status) {
      state.isLoggedIn = status;
    },
  },
  actions: {
    async fetchMovies({ commit }) {
      const data = await getMovies('movie/popular'); // getMovies 함수 호출
      commit('setMovies', data.results);
    },
  },
});
