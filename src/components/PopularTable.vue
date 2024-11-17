<template>
    <div class="no-scroll-container">
      <h1>Popular Movies</h1>
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
        Loading...
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Release Date</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in limitedMovies" :key="movie.id">
            <td>
              <img
                :src="getPosterUrl(movie.poster_path)"
                alt="Movie Poster"
                class="poster-img"
              />
            </td>
            <td>{{ movie.title }}</td>
            <td>{{ movie.release_date }}</td>
            <td>{{ movie.vote_average }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(-1)">
          Previous
        </button>
        <span>Page {{ currentPage }}</span>
        <button :disabled="currentPage === totalPages" @click="changePage(1)">
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        movies: [],
        isLoading: false,
        currentPage: 1,
        totalPages: 1,
        API_KEY: "b5d15fa17676447771db0ab7d3c7faa2", // 자신의 TMDB API 키
        moviesPerPage: 4, // 영화 갯수를 4개로 제한
        navHeight: 1000, // 네비게이션 바의 높이 저장
      };
    },
    computed: {
      limitedMovies() {
        return this.movies.slice(0, this.moviesPerPage); // moviesPerPage에 맞게 슬라이스
      },
    },
    methods: {
      async fetchMoviesData() {
        this.isLoading = true;
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular`,
            {
              params: {
                api_key: this.API_KEY,
                page: this.currentPage,
              },
            }
          );
          this.movies = response.data.results;
          this.totalPages = response.data.total_pages;
          this.adjustMoviesPerPage();
        } catch (error) {
          console.error("Error fetching movies:", error);
          alert("Failed to fetch movies. Please check your API key or network.");
        } finally {
          this.isLoading = false;
        }
      },
      adjustMoviesPerPage() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const availableHeight = height - this.navHeight - 150; // 화면 높이에서 NavBar와 여유 공간 차감
  
        if (width > 1200) {
          this.moviesPerPage = Math.min(4, Math.floor(availableHeight / 80)); // 최대 4개로 제한
        } else if (width > 768) {
          this.moviesPerPage = Math.min(4, Math.floor(availableHeight / 80)); // 최대 4개로 제한
        } else {
          this.moviesPerPage = Math.min(4, Math.floor(availableHeight / 80)); // 최대 4개로 제한
        }
      },
      changePage(direction) {
        this.currentPage += direction;
        this.fetchMoviesData();
      },
      getPosterUrl(path) {
        return `https://image.tmdb.org/t/p/w200${path}`;
      },
      handleResize() {
        this.adjustMoviesPerPage();
      },
      calculateNavHeight() {
        const navBar = document.querySelector("nav"); // 네비게이션 바 요소 선택
        if (navBar) {
          this.navHeight = navBar.offsetHeight; // 네비게이션 바의 높이 저장
        }
      },
    },
    mounted() {
      this.calculateNavHeight(); // 네비게이션 바 높이 계산
      this.fetchMoviesData();
      window.addEventListener("resize", this.handleResize);
    },
    beforeUnmount() {
      window.removeEventListener("resize", this.handleResize);
    },
  };
  </script>
  
  <style>
  /* 전체 스크롤을 비활성화 */
  .no-scroll-container {
    overflow-x: hidden; /* 가로 스크롤 비활성화 */
    overflow-y: auto; /* 세로 스크롤 활성화 */
    max-height: 100vh; /* 화면 높이에 맞게 제한 */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  /* Loading Overlay 스타일 */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 1.5em;
    z-index: 1000;
  }
  
  /* Spinner 스타일 */
  .spinner {
    border: 8px solid #f3f3f3; /* Light grey background */
    border-top: 8px solid #3498db; /* Blue color for the spinner */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }
  
  /* 스피너 회전 애니메이션 */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* 테이블 스타일 */
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; /* 테이블 크기 고정 */
    word-wrap: break-word; /* 긴 텍스트 자동 줄바꿈 */
  }
  
  /* 테이블 헤더 스타일 */
  thead th {
    background-color: #f4f4f4;
    padding: 10px;
    text-align: left;
  }
  
  /* 테이블 본문 스타일 */
  tbody td {
    padding: 10px;
    text-align: center;
  }
  
  /* 영화 포스터 이미지 스타일 */
  img.poster-img {
    max-width: 100px; /* 이미지 크기 제한 */
    height: auto;
    border-radius: 5px;
  }
  
  /* 페이지네이션 스타일 */
  .pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  