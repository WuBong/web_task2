<template>
    <div class="no-scroll-container">
      <h1>Popular Movies</h1>
      <div v-if="isLoading">Loading...</div>
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
                width="100"
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
        moviesPerPage: 10, // 화면 크기에 따른 영화 갯수 제한
        navHeight: 1000, // 네비게이션 바의 높이 저장
      };
    },
    computed: {
      limitedMovies() {
        return this.movies.slice(0, this.moviesPerPage);
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
          this.moviesPerPage = Math.min(10, Math.floor(availableHeight / 80)); // 큰 화면: 최대 10개
        } else if (width > 768) {
          this.moviesPerPage = Math.min(6, Math.floor(availableHeight / 80)); // 중간 화면: 최대 6개
        } else {
          this.moviesPerPage = Math.min(4, Math.floor(availableHeight / 80)); // 작은 화면: 최대 4개
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
  /* 스크롤 완전 비활성화 */
  .no-scroll-container {
    overflow: hidden; /* 스크롤 비활성화 */
    max-height: 100vh; /* 화면 높이에 맞게 제한 */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; /* 테이블 크기 고정 */
  }
  
  thead th {
    background-color: #f4f4f4;
    padding: 10px;
  }
  
  tbody td {
    padding: 10px;
    text-align: center;
    word-wrap: break-word; /* 긴 텍스트 자동 줄바꿈 */
  }
  
  img {
    border-radius: 5px;
  }
  
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
  