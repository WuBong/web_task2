<template>
  <div class="container">
    <h1 class="text-center my-4">Popular Movies</h1>
    <div class="row movie-list">
      <!-- 영화 목록 -->
      <div
        v-for="(movie, index) in movies"
        :key="movie.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 movie-card"
        @click="selectMovie(movie)"
        style="cursor: pointer;"
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
          </div>
        </div>
      </div>

      <!-- 선택된 영화 정보와 작은 포스터 -->
      <div v-if="selectedMovie" class="selected-movie">
        <div class="movie-detail">
          <img
            :src="getMovieImageUrl(selectedMovie.poster_path)"
            class="img-fluid large-poster"
            alt="selected movie poster"
            height="400px"
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
        <!-- 좌측 상단 작은 포스터 -->
        <div class="small-poster" @click="deselectMovie">
          <img
            :src="getMovieImageUrl(selectedMovie.poster_path)"
            class="img-fluid"
            alt="small poster"
            height="100px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      selectedMovie: null, // 클릭된 영화 정보
    };
  },
  computed: {
    ...mapState(['movies']),
  },
  methods: {
    ...mapActions(['fetchMovies']),
    
    // 영화 포스터 클릭시 선택된 영화 정보 저장
    selectMovie(movie) {
      this.selectedMovie = movie;
    },

    // 선택된 영화 해제 (작은 포스터 클릭시)
    deselectMovie() {
      this.selectedMovie = null;
    },

    getMovieImageUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  mounted() {
    this.fetchMovies(); // 영화 목록 가져오기
  },
};
</script>

<style scoped>
.movie-list {
  display: flex;
  flex-wrap: wrap;
}

.movie-card {
  transition: transform 0.3s ease-in-out;
}

.movie-poster {
  transition: transform 0.3s ease-in-out;
}

.movie-card:hover .movie-poster {
  transform: scale(1.1); /* 호버 시 확대 */
}

/* 선택된 영화 정보 */
.selected-movie {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
}

.movie-detail {
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.large-poster {
  max-width: 300px;  /* 포스터의 최대 크기를 제한 */
  max-height: 450px; /* 포스터의 최대 높이를 제한 */
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

/* 좌측 상단 작은 포스터 */
.small-poster {
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  border-radius: 50%;
  background: white;
  padding: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
}

.small-poster img {
  border-radius: 50%;
}
</style>
