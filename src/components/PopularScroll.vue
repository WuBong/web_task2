<!--/Componets/PopularScroll.vue-->
<template>
  <div class="container">
    <h1 class="text-center my-4">Popular Movies</h1>

    <!-- 로딩 중일 때 로딩 스피너 표시 -->
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

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
            height="auto"
          />
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ movie.title }}</h5>
            <p class="card-text">{{ formatDate(movie.release_date) }}</p>
            <button
              class="wishlist-btn"
              :class="wishlistContains(movie) ? 'btn-remove' : 'btn-add'"
              @click.stop="toggleWishlist(movie)"
              aria-label="Add/Remove to wishlist"
            >
              {{ wishlistContains(movie) ? 'Remove from Wishlist' : 'Add to Wishlist' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 선택된 영화 정보 (포스터 포함 및 우측 상단 닫기 버튼) -->
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

    <!-- 페이지 네비게이션 버튼 -->
    <div v-if="!isLoading" class="pagination-container">
      <button
        class="btn btn-secondary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      
      <span class="page-number">Page {{ currentPage }} of {{ totalPages }}</span>
      
      <button
        class="btn btn-secondary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>

    <!-- 페이지 맨 위로 올라가는 버튼 -->
    <button v-if="showScrollToTop" class="btn-scroll-to-top" @click="scrollToTop" aria-label="Scroll to top">
      ↑
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      selectedMovie: null, // 클릭된 영화 정보
      currentPage: 1, // 현재 페이지
      totalPages: 0, // 전체 페이지 수
      movies: [], // 영화 목록
      isLoading: false, // 로딩 상태
      isFetching: false, // 추가 데이터가 요청 중인지 확인하는 플래그
      showScrollToTop: false, // 페이지 맨 위로 올라가는 버튼 표시 여부
    };
  },
  computed: {
    ...mapState(['movies']),
  },
  methods: {
    ...mapActions(['fetchMovies']),

    // 영화 포스터 클릭 시 선택된 영화 정보 저장
    selectMovie(movie) {
      this.selectedMovie = movie;
      // 스크롤 비활성화
      document.body.style.overflow = 'hidden';
    },

    // 선택된 영화 해제 (X 버튼 클릭 시)
    deselectMovie() {
      this.selectedMovie = null;
      // 스크롤 다시 활성화
      document.body.style.overflow = '';
    },

    // 영화 포스터 URL 반환
    getMovieImageUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },

    // 날짜 포맷 변환
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    // 영화가 wishlist에 있는지 확인
    wishlistContains(movie) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      return wishlist.some(item => item.id === movie.id);
    },

    // 영화 wishlist에 추가/삭제
    toggleWishlist(movie) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

      if (this.wishlistContains(movie)) {
        // wishlist에서 영화 제거
        wishlist = wishlist.filter(item => item.id !== movie.id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.showToastMessage(`${movie.title} has been removed from your wishlist.`);
      } else {
        // wishlist에 영화 추가
        wishlist.push(movie);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.showToastMessage(`${movie.title} has been added to your wishlist.`);
      }

      // Force a re-render to reflect the changes immediately
      this.$forceUpdate();
    },

    // Toast 메시지 표시
    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },

    // 페이지 변경
    changePage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
        this.fetchMoviesData();
      }
    },

    // 영화 목록을 불러오는 함수 (30개씩)
    async fetchMoviesData() {
      if (this.isFetching) return; // 이미 데이터를 요청 중이면 요청을 방지
      this.isFetching = true;

      this.isLoading = true;

      try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
          params: {
            api_key: 'b5d15fa17676447771db0ab7d3c7faa2',  // 여기에 실제 API 키 입력
            page: this.currentPage,
          },
        });
        
        

        // 새로운 영화 목록을 기존 영화 목록 뒤에 추가
        this.movies = [...this.movies, ...response.data.results];
        this.totalPages = response.data.total_pages;
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        this.isLoading = false;
        this.isFetching = false;
      }
    },

    // 스크롤 시 페이지 변경 및 버튼 표시
    handleScroll() {
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (bottom && this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchMoviesData();
      }

      // 페이지 상단으로 스크롤하면 버튼 숨기기
      if (window.scrollY > 300) {
        this.showScrollToTop = true;
      } else {
        this.showScrollToTop = false;
      }
    },

    // 페이지 맨 위로 스크롤
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  mounted() {
    this.fetchMoviesData(); // 처음 영화 목록 가져오기
    window.addEventListener('scroll', this.handleScroll); // 스크롤 이벤트 리스너 추가
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll); // 컴포넌트 파괴 시 리스너 제거
  },
};
</script>

<style scoped>
.movie-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.movie-card {
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.movie-poster {
  transition: transform 0.3s ease-in-out;
  width: 100%; /* 기본적으로 100% 너비로 설정 */
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-card:hover .movie-poster {
  transform: scale(1.1);
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.wishlist-btn {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 25px;
  width: 100%;
  transition: background-color 0.3s, transform 0.3s ease;
}

.wishlist-btn:hover {
  transform: scale(1.05);
}

.wishlist-btn:focus {
  outline: none;
}

.btn-add {
  background-color: #28a745;
  color: white;
  border: 1px solid #28a745;
}

.btn-add:hover {
  background-color: #218838;
}

.btn-remove {
  background-color: #dc3545;
  color: white;
  border: 1px solid #dc3545;
}

.btn-remove:hover {
  background-color: #c82333;
}

.selected-movie {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 999;
  padding: 20px;
  overflow: auto;
}

.movie-detail {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
}

.large-poster {
  width: 100%;
  height: auto;
}

.movie-description {
  margin-top: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 8px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.page-number {
  margin: 0 20px;
}

/* 페이지 맨 위로 가는 버튼 */
.btn-scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-scroll-to-top:hover {
  background-color: #0056b3;
}
</style>
