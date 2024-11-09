<!-- src/views/MovieDetail.vue -->
<template>
    <div class="container my-5">
      <!-- 로딩 중인 상태 -->
      <div v-if="loading" class="text-center">
        <p>Loading...</p>
      </div>
  
      <!-- 영화 데이터가 로드된 후에만 표시 -->
      <div v-else-if="movie" class="row">
        <div class="col-12 col-md-4">
          <img
            :src="getMovieImageUrl(movie.poster_path)"
            class="img-fluid"
            alt="movie.title"
          />
        </div>
        <div class="col-12 col-md-8">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">{{ movie.title }}</h3>
              <p><strong>Release Date:</strong> {{ formatDate(movie.release_date) }}</p>
              <p><strong>Rating:</strong> {{ movie.vote_average }} / 10</p>
              <p><strong>Overview:</strong> {{ movie.overview }}</p>
              <p><strong>Genres:</strong></p>
              <ul>
                <li v-for="genre in movie.genres" :key="genre.id">{{ genre.name }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 영화 데이터가 없을 때 -->
      <div v-else class="text-center">
        <p>No movie details available.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { getMovies } from '../api'; // api에서 getMovies를 import
  
  export default {
    data() {
      return {
        movie: null,
        loading: true,
      };
    },
    methods: {
      async fetchMovie() {
        try {
          const data = await getMovies(`movie/${this.$route.params.id}`);
          this.movie = data;
        } catch (error) {
          console.error("Error fetching movie details:", error);
          this.movie = null; // 오류가 발생하면 movie를 null로 설정
        } finally {
          this.loading = false; // 데이터 로딩이 끝났음을 표시
        }
      },
      getMovieImageUrl(path) {
        return path ? `https://image.tmdb.org/t/p/w500${path}` : '';
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
    },
    mounted() {
      this.fetchMovie();
    },
  };
  </script>
  
  <style scoped>
  .card-title {
    font-size: 1.5rem;
  }
  </style>
  