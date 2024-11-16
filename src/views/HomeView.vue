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
          <p v-if="selectedMovie.genres"><strong>Genres:</strong></p>
          <ul v-if="selectedMovie.genres">
            <li v-for="genre in selectedMovie.genres" :key="genre.id">{{ genre.name }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMovies } from "../api";

export default {
  data() {
    return {
      topRatedMovies: [], // Top Rated 영화 목록
      wishlistMovies: [], // Wishlist 영화 목록
      selectedMovie: null, // 선택된 영화 정보
    };
  },
  methods: {
    getMovieImageUrl(path) {
      return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : "https://via.placeholder.com/500x750?text=No+Image";
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async selectMovie(movie) {
      try {
        const details = await getMovies(`movie/${movie.id}`);
        this.selectedMovie = details; // 선택된 영화의 세부 정보 업데이트
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    },
    deselectMovie() {
      this.selectedMovie = null; // 영화 세부 정보 닫기
    },
    isInWishlist(movie) {
      return this.wishlistMovies.some((m) => m.id === movie.id);
    },
    addToWishlist(movie) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlist.push(movie);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      this.fetchWishlist(); // 업데이트된 Wishlist를 로드
    },
    removeFromWishlist(movie) {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlist = wishlist.filter((m) => m.id !== movie.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      this.fetchWishlist(); // 업데이트된 Wishlist를 로드
    },
    fetchWishlist() {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      this.wishlistMovies = wishlist;
    },
    async fetchMovies() {
      try {
        const topRated = await getMovies("movie/top_rated");
        this.topRatedMovies = topRated.results;
        this.fetchWishlist(); // Wishlist 데이터를 불러오기
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
  },
  mounted() {
    this.fetchMovies(); // 영화 데이터를 컴포넌트 마운트 시 가져오기
  },
};
</script>

<style scoped>
/* 기존 스타일 유지 */
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

/* 선택된 영화 정보 팝업 스타일 */
.selected-movie {
  display: flex;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.9);
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
  color: #000; /* 글자 색상을 검정색으로 설정 */
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
