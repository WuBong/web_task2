<template>
  <div class="container">
    <div class="movie-section">
      <h2 class="text-center my-4">Now Playing</h2>
      <div class="row movie-list">
        <div
          v-for="(movie, index) in nowPlayingMovies"
          :key="movie.id"
          class="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 movie-card"
          @click="selectMovie(movie)"
          style="cursor: pointer;"
        >
          <div class="card">
            <img
              :src="getMovieImageUrl(movie.poster_path)"
              class="card-img-top movie-poster"
              :alt="movie.title"
              height="200px"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="movie-section">
      <h2 class="text-center my-4">Upcoming Movies</h2>
      <div class="row movie-list">
        <div
          v-for="(movie, index) in upcomingMovies"
          :key="movie.id"
          class="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 movie-card"
          @click="selectMovie(movie)"
          style="cursor: pointer;"
        >
          <div class="card">
            <img
              :src="getMovieImageUrl(movie.poster_path)"
              class="card-img-top movie-poster"
              :alt="movie.title"
              height="200px"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="movie-section">
      <h2 class="text-center my-4">Top Rated Movies</h2>
      <div class="row movie-list">
        <div
          v-for="(movie, index) in topRatedMovies"
          :key="movie.id"
          class="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 movie-card"
          @click="selectMovie(movie)"
          style="cursor: pointer;"
        >
          <div class="card">
            <img
              :src="getMovieImageUrl(movie.poster_path)"
              class="card-img-top movie-poster"
              :alt="movie.title"
              height="200px"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 선택된 영화 정보 -->
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
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      selectedMovie: null, // 클릭된 영화 정보
    };
  },
  computed: {
    ...mapState(['nowPlayingMovies', 'upcomingMovies', 'topRatedMovies']),
  },
  methods: {
    ...mapActions(['fetchNowPlayingMovies', 'fetchUpcomingMovies', 'fetchTopRatedMovies']),

    // 영화 포스터 클릭 시 선택된 영화 정보 저장
    selectMovie(movie) {
      this.selectedMovie = movie;
      this.$nextTick(() => {
        const movieDescription = document.querySelector('.movie-description');
        if (movieDescription) {
          movieDescription.classList.add('fade-in');
        }
      });
    },

    // 선택된 영화 해제 (X 버튼 클릭 시)
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
    this.fetchNowPlayingMovies(); // 현재 상영 중인 영화 목록 가져오기
    this.fetchUpcomingMovies();   // 개봉 예정 영화 목록 가져오기
    this.fetchTopRatedMovies();    // 높은 평점 영화 목록 가져오기
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
  position: fixed; /* 고정 위치로 설정 */
  top: 50px; /* 화면 상단에서의 거리 조정 */
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  align-items: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
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
</style>
