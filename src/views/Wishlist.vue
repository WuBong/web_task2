<!--/views/Wishlist.vue-->
<template>
  <div class="container">
    <h1 class="text-center my-4">Your Wishlist</h1>
    <div v-if="wishlistMovies.length === 0" class="alert alert-info text-center">
      Your wishlist is empty. Start adding some movies!
    </div>
    <div class="row movie-list">
      <!-- wishlist에 저장된 영화 목록 -->
      <div
        v-for="(movie, index) in wishlistMovies"
        :key="movie.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 movie-card"
        @click="selectMovie(movie)" 
      >
        <div class="card">
          <img
            :src="getMovieImageUrl(movie.poster_path)"
            class="card-img-top movie-poster"
            :alt="movie.title"
            height="300px"
          />
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ movie.title }}</h5>
            <p class="card-text">{{ formatDate(movie.release_date) }}</p>
            <!-- 영화 삭제 버튼 -->
            <button
              class="btn btn-danger"
              @click.stop="removeFromWishlist(movie)"
              aria-label="Remove from Wishlist"
            >
              Remove from Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 선택된 영화 정보 표시 -->
    <div v-if="selectedMovie" class="selected-movie">
      <div class="movie-detail">
        <button class="close-btn" @click="deselectMovie" aria-label="Close Movie Details">×</button>
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
export default {
  data() {
    return {
      wishlistMovies: [], // wishlist에 추가된 영화 목록
      selectedMovie: null, // 클릭된 영화 정보
    };
  },
  methods: {
    // 영화 포스터 URL 반환
    getMovieImageUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },

    // 날짜 포맷 변환
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    // wishlist에서 영화 제거
    removeFromWishlist(movie) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      wishlist = wishlist.filter(item => item.id !== movie.id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.fetchWishlist(); // 영화 목록을 갱신
      // 영화 정보가 선택되어 있으면, 해당 영화 정보 숨기기
      if (this.selectedMovie && this.selectedMovie.id === movie.id) {
        this.selectedMovie = null;
      }
    },

    // localStorage에서 wishlist 불러오기
    fetchWishlist() {
      this.wishlistMovies = JSON.parse(localStorage.getItem('wishlist')) || [];
    },

    // 영화 선택 시 정보 표시
    selectMovie(movie) {
      this.selectedMovie = movie;
    },

    // 선택된 영화 정보 해제 (닫기 버튼 클릭 시)
    deselectMovie() {
      this.selectedMovie = null;
    },
  },
  mounted() {
    this.fetchWishlist(); // 컴포넌트가 마운트될 때 wishlist 불러오기
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
  transform: scale(1.05); /* 호버 시 확대 */
}

/* Remove button 스타일 */
.btn-danger {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-danger:focus {
  outline: none;
}

/* 선택된 영화 정보 */
.selected-movie {
  display: flex;
  position: fixed; /* 고정 위치로 설정 */
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  align-items: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  max-width: 90%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.movie-detail {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
}

.large-poster {
  max-width: 300px;
  max-height: 450px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.movie-description {
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.movie-description.fade-in {
  opacity: 1;
  transform: translateY(0);
}
</style>
