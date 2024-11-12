<!-- src/views/HomeView.vue -->
<template>
    <div class="container">
      <h1 class="text-center my-4">Explore Movies</h1>
  
      <!-- Top Rated Movies Section -->
      <div v-if="topRatedMovies.length" class="movie-section">
        <h2>Top Rated Movies</h2>
        <div class="row movie-list">
          <div
            v-for="movie in topRatedMovies"
            :key="movie.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 movie-card"
          >
            <div class="card">
              <img
                :src="getMovieImageUrl(movie.poster_path)"
                class="card-img-top movie-poster"
                :alt="movie.title"
                height="300px"
                @click="selectMovie(movie)"
              />
              <div class="card-body">
                <h5 class="card-title text-truncate">{{ movie.title }}</h5>
                <p class="card-text">{{ formatDate(movie.release_date) }}</p>
                <button
                  v-if="!isInWishlist(movie)"
                  class="btn btn-primary"
                  @click.stop="addToWishlist(movie)"
                >
                  Add to Wishlist
                </button>
                <button
                  v-else
                  class="btn btn-danger"
                  @click.stop="removeFromWishlist(movie)"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Upcoming Movies Section -->
      <div v-if="upcomingMovies.length" class="movie-section">
        <h2>Upcoming Movies</h2>
        <div class="row movie-list">
          <div
            v-for="movie in upcomingMovies"
            :key="movie.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 movie-card"
          >
            <div class="card">
              <img
                :src="getMovieImageUrl(movie.poster_path)"
                class="card-img-top movie-poster"
                :alt="movie.title"
                height="300px"
                @click="selectMovie(movie)"
              />
              <div class="card-body">
                <h5 class="card-title text-truncate">{{ movie.title }}</h5>
                <p class="card-text">{{ formatDate(movie.release_date) }}</p>
                <button
                  v-if="!isInWishlist(movie)"
                  class="btn btn-primary"
                  @click.stop="addToWishlist(movie)"
                >
                  Add to Wishlist
                </button>
                <button
                  v-else
                  class="btn btn-danger"
                  @click.stop="removeFromWishlist(movie)"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Now Playing Movies Section -->
      <div v-if="nowPlayingMovies.length" class="movie-section">
        <h2>Now Playing Movies</h2>
        <div class="row movie-list">
          <div
            v-for="movie in nowPlayingMovies"
            :key="movie.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 movie-card"
          >
            <div class="card">
              <img
                :src="getMovieImageUrl(movie.poster_path)"
                class="card-img-top movie-poster"
                :alt="movie.title"
                height="300px"
                @click="selectMovie(movie)"
              />
              <div class="card-body">
                <h5 class="card-title text-truncate">{{ movie.title }}</h5>
                <p class="card-text">{{ formatDate(movie.release_date) }}</p>
                <button
                  v-if="!isInWishlist(movie)"
                  class="btn btn-primary"
                  @click.stop="addToWishlist(movie)"
                >
                  Add to Wishlist
                </button>
                <button
                  v-else
                  class="btn btn-danger"
                  @click.stop="removeFromWishlist(movie)"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 선택된 영화 정보 표시 -->
      <div v-if="selectedMovie" class="selected-movie">
        <div class="movie-detail">
          <button class="close-btn" @click="deselectMovie">×</button>
          <img
            :src="getMovieImageUrl(selectedMovie.poster_path)"
            class="img-fluid large-poster"
            alt="selected movie poster"
          />
          <div class="movie-description fade-in">
            <h3>{{ selectedMovie.title }}</h3>
            <p><strong>Release Date:</strong> {{ formatDate(selectedMovie.release_date) }}</p>
            <p><strong>Rating:</strong> {{ selectedMovie.vote_average }} / 10</p>
            <p><strong>Overview:</strong> {{ selectedMovie.overview }}</p>
            <p><strong>Genres:</strong></p>
            <ul>
              <li v-for="genre in selectedMovie.genres" :key="genre.id">{{ genre.name }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getMovies } from '../api';
  
  export default {
    data() {
      return {
        topRatedMovies: [], // Top Rated 영화
        upcomingMovies: [], // Upcoming 영화
        nowPlayingMovies: [], // Now Playing 영화
        wishlistMovies: [], // 로컬 스토리지에서 불러온 wishlist 영화 목록
        selectedMovie: null, // 선택된 영화 정보
      };
    },
    methods: {
      getMovieImageUrl(path) {
        return `https://image.tmdb.org/t/p/w500${path}`;
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
      selectMovie(movie) {
        this.selectedMovie = movie; // 영화 선택 시 해당 영화의 정보 표시
      },
  
      deselectMovie() {
        this.selectedMovie = null; // 영화 정보 닫기
      },
  
      // 영화가 wishlist에 포함되어 있는지 확인
      isInWishlist(movie) {
        return this.wishlistMovies.some((m) => m.id === movie.id);
      },
  
      // 영화 wishlist에 추가
      addToWishlist(movie) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.push(movie);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.fetchWishlist(); // wishlist 갱신
      },
  
      // 영화 wishlist에서 제거
      removeFromWishlist(movie) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter((m) => m.id !== movie.id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.fetchWishlist(); // wishlist 갱신
      },
  
      // 로컬스토리지에서 wishlist 영화 목록 불러오기
      fetchWishlist() {
        const wishlistData = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.wishlistMovies = wishlistData;
      },
  
      // 여러 카테고리의 영화 목록 불러오기
      async fetchMovies() {
        try {
          const topRated = await getMovies('movie/top_rated');
          const upcoming = await getMovies('movie/upcoming');
          const nowPlaying = await getMovies('movie/now_playing');
          
          this.topRatedMovies = topRated.results;
          this.upcomingMovies = upcoming.results;
          this.nowPlayingMovies = nowPlaying.results;
          
          this.fetchWishlist(); // wishlist 목록도 불러오기
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      },
    },
  
    mounted() {
      this.fetchMovies(); // 컴포넌트가 마운트될 때 여러 카테고리 영화 목록과 wishlist 가져오기
    },
  };
  </script>
  
  <style scoped>
  .movie-list {
    display: flex;
    flex-wrap: wrap;
  }
  
  .movie-card {
    position: relative;
    transition: transform 0.3s ease-in-out;
  }
  
  .movie-poster {
    transition: transform 0.3s ease-in-out;
  }
  
  .movie-card:hover .movie-poster {
    transform: scale(1.05); /* 확대 */
  }
  
  .movie-section {
    margin-bottom: 40px;
  }
  
  h2 {
    margin-bottom: 20px;
  }
  
  .btn-primary,
  .btn-danger {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
  
  .selected-movie {
    display: flex;
    position: fixed; /* 고정 위치로 설정 */
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
    align-items: center;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 10px;
  }
  
  .selected-movie .movie-detail {
    max-width: 800px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .selected-movie .movie-description {
    padding: 20px;
  }
  
  .selected-movie .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
  }
  
  .selected-movie .large-poster {
    max-width: 300px;
    margin-bottom: 20px;
  }
  </style>
  