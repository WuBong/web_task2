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
                @click="removeFromWishlist(movie)"
                aria-label="Remove from Wishlist"
              >
                Remove from Wishlist
              </button>
            </div>
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
      },
  
      // localStorage에서 wishlist 불러오기
      fetchWishlist() {
        this.wishlistMovies = JSON.parse(localStorage.getItem('wishlist')) || [];
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
  
  /* 빈 wishlist 메시지 스타일 */
  .alert {
    font-size: 18px;
    margin-top: 20px;
  }
  </style>
  