<!--/views/Popular.vue-->
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
              <!-- Wishlist 버튼 텍스트 -->
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
    position: relative; /* 카드에 상대 위치 설정 */
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
  
  /* 기본 버튼 스타일 */
  .wishlist-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: #007bff; /* 버튼 배경색 */
    color: white; /* 텍스트 색상 */
    border: 1px solid #007bff; /* 테두리 색상 */
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease, border 0.3s ease;
  }
  
  .wishlist-btn:hover {
    background: #0056b3; /* hover 시 버튼 색상 */
    border-color: #0056b3; /* hover 시 테두리 색상 */
  }
  
  .wishlist-btn:focus {
    outline: none; /* 포커스 시 테두리 제거 */
  }
  
  /* 추가/제거 버튼 상태 */
  .btn-add {
    background-color: #28a745; /* 추가 버튼 색상 */
    border-color: #28a745;
  }
  
  .btn-remove {
    background-color: #dc3545; /* 제거 버튼 색상 */
    border-color: #dc3545;
  }
  
  .btn-add:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
  
  .btn-remove:hover {
    background-color: #c82333;
    border-color: #bd2130;
  }
  </style>
  