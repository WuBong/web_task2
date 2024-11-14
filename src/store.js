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
    async fetchMovies({ commit }, { query, page = 1 }) {
      try {
        const data = await getMovies('search/movie', { query, page }); // 검색 API 호출
        commit('setMovies', data.results);
        return data; // 컴포넌트에서 사용할 수 있도록 데이터 반환
      } catch (error) {
        console.error('영화 로드 실패:', error);
        throw error;
      }
    },
  },
});
