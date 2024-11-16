<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Search</h1>

    <!-- 필터링 옵션 -->
    <div class="filter-controls">
      <!-- 평점 필터 -->
      <select v-model="selectedRating" @change="filterMovies">
        <option value="">All Ratings</option>
        <option value="7">7+</option>
        <option value="8">8+</option>
        <option value="9">9+</option>
      </select>

      <!-- 개봉년도 필터 -->
      <select v-model="selectedReleaseYear" @change="filterMovies">
        <option value="">All Years</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>

      <!-- 장르 필터 -->
      <select v-model="selectedGenre" @change="filterMovies">
        <option value="">All Genres</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">
          {{ genre.name }}
        </option>
      </select>

      <!-- 정렬 옵션 -->
      <select v-model="selectedSort" @change="filterMovies">
        <option value="popularity.desc">Popularity (High to Low)</option>
        <option value="popularity.asc">Popularity (Low to High)</option>
        <option value="vote_average.desc">Rating (High to Low)</option>
        <option value="vote_average.asc">Rating (Low to High)</option>
      </select>

      <!-- 필터 초기화 버튼 -->
      <button @click="resetFilters" class="btn btn-secondary">Reset Filters</button>
    </div>

    <!-- 영화 목록 -->
    <div class="row">
      <div v-for="movie in filteredMovies" :key="movie.id" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card">
          <!-- 포스터 클릭 시 상세 정보 표시 -->
          <img 
            :src="getMovieImageUrl(movie.poster_path)" 
            class="card-img-top movie-poster" 
            :alt="movie.title" 
            @click="selectMovie(movie)" 
          />
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ movie.title }}</h5>
            <p class="card-text text-muted">{{ formatDate(movie.release_date) }}</p>
            <!-- 버튼 클릭 시 위시리스트 토글 -->
            <button
              class="btn"
              :class="isInWishlist(movie) ? 'btn-danger' : 'btn-primary'"
              @click.stop="toggleWishlist(movie)"
            >
              {{ isInWishlist(movie) ? 'Remove from Wishlist' : 'Add to Wishlist' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 선택된 영화의 상세 정보 -->
    <div v-if="selectedMovie" class="selected-movie">
      <div class="movie-detail">
        <button class="close-btn" @click="deselectMovie">×</button>
        <img :src="getMovieImageUrl(selectedMovie.poster_path)" class="img-fluid large-poster" alt="selected movie poster" />
        <div class="movie-description">
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

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="text-center mt-4">
      <span>Loading...</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      movies: [],
      filteredMovies: [],
      genres: [], // 장르 목록
      isLoading: false,
      currentPage: 1,
      totalPages: 1,
      selectedRating: '', 
      selectedReleaseYear: '', 
      selectedSort: 'popularity.desc',
      selectedGenre: '', // 선택된 장르
      wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
      selectedMovie: null,
    };
  },
  methods: {
    // 영화 이미지 URL 반환
    getMovieImageUrl(path) {
      return path ? `https://image.tmdb.org/t/p/w500${path}` : "https://via.placeholder.com/500x750?text=No+Image";
    },

    // 날짜 포맷팅
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    // 영화 위시리스트 토글
    toggleWishlist(movie) {
      const index = this.wishlist.findIndex((m) => m.id === movie.id);
      if (index !== -1) {
        this.wishlist.splice(index, 1);
      } else {
        this.wishlist.push(movie);
      }
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    },

    // 위시리스트에 영화가 있는지 확인
    isInWishlist(movie) {
      return this.wishlist.some((m) => m.id === movie.id);
    },

    // 영화 선택 시 상세 정보 표시
    selectMovie(movie) {
      this.selectedMovie = movie;
    },

    // 영화 선택 해제
    deselectMovie() {
      this.selectedMovie = null;
    },

    // 필터링 함수
    filterMovies() {
      this.filteredMovies = this.movies
        .filter((movie) => {
          // 평점 필터링
          if (this.selectedRating && movie.vote_average < this.selectedRating) {
            return false;
          }
          // 개봉년도 필터링
          if (this.selectedReleaseYear && movie.release_date.slice(0, 4) !== this.selectedReleaseYear) {
            return false;
          }
          // 장르 필터링
          if (this.selectedGenre && !movie.genre_ids.includes(Number(this.selectedGenre))) {
            return false;
          }
          return true;
        })
        .sort((a, b) => {
          // 정렬
          if (this.selectedSort === 'popularity.desc') {
            return b.popularity - a.popularity;
          } else if (this.selectedSort === 'popularity.asc') {
            return a.popularity - b.popularity;
          } else if (this.selectedSort === 'vote_average.desc') {
            return b.vote_average - a.vote_average;
          } else if (this.selectedSort === 'vote_average.asc') {
            return a.vote_average - b.vote_average;
          }
          return 0;
        });
    },

    // 영화 데이터 가져오기
    async fetchMovies() {
      this.isLoading = true;
      try {
        const apiKey = 'b5d15fa17676447771db0ab7d3c7faa2'; // TMDB API Key
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
          params: { api_key: apiKey, page: this.currentPage },
        });
        // 기존 데이터에 새로운 영화 추가
        this.movies = [...this.movies, ...response.data.results];
        this.totalPages = response.data.total_pages;

        // 필터링 적용
        this.filterMovies();
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // 장르 목록 가져오기
    async fetchGenres() {
      try {
        const apiKey = 'b5d15fa17676447771db0ab7d3c7faa2'; // TMDB API Key
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: { api_key: apiKey },
        });
        this.genres = response.data.genres;
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    },

    // 스크롤 이벤트 처리
    handleScroll() {
      const bottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (bottom && !this.isLoading && this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchMovies(); // 새로운 데이터를 로드하고 필터링을 다시 적용
      }
    },

    // 필터 초기화 함수
    resetFilters() {
      this.selectedRating = '';
      this.selectedReleaseYear = '';
      this.selectedSort = 'popularity.desc';
      this.selectedGenre = '';
      this.filterMovies(); // 초기화 후 필터링 적용
    },
  },
  mounted() {
    this.fetchMovies(); // 처음 영화 목록 가져오기
    this.fetchGenres(); // 장르 목록 가져오기
    window.addEventListener('scroll', this.handleScroll); // 스크롤 이벤트 리스너 등록
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll); // 스크롤 이벤트 리스너 해제
  },
};
</script>

<style>
.movie-poster {
  cursor: pointer;
  transition: transform 0.3s ease;
}
.movie-poster:hover {
  transform: scale(1.05);
}
.selected-movie {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 1000;
}
.movie-detail {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  gap: 20px;
}
.large-poster {
  max-height: 400px;
  border-radius: 10px;
}
.movie-description {
  flex-grow: 1;
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}
</style>
