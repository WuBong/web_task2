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
              <!-- Wishlist 버튼 -->
              <button
                class="btn btn-success btn-sm wishlist-btn"
                @click.stop="addToWishlist(movie)"
              >
                Add to Wishlist
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
  
      // 영화 포스터 클릭 시 선택된 영화 정보 저장
      selectMovie(movie) {
        this.selectedMovie = movie;
      },
  
      // 선택된 영화 해제 (X 버튼 클릭 시)
      deselectMovie() {
        this.selectedMovie = null;
      },
  
      // 영화 포스터 URL 반환
      getMovieImageUrl(path) {
        return `https://image.tmdb.org/t/p/w500${path}`;
      },
  
      // 날짜 포맷 변환
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
  
      // 영화 'wishlist'에 추가
      addToWishlist(movie) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // 이미 'wishlist'에 추가된 영화가 있는지 체크
        if (!wishlist.some(item => item.id === movie.id)) {
          wishlist.push(movie);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
          this.showToastMessage(`${movie.title} has been added to your wishlist.`);
        } else {
          this.showToastMessage(`${movie.title} is already in your wishlist.`);
        }
      },
  
      // Toast 메시지 표시
      showToastMessage(message) {
        this.toastMessage = message;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
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
    transform: scale(1.05); /* 호버 시 확대 */
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
  
  /* Wishlist 버튼 스타일 */
  .wishlist-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  </style>
  