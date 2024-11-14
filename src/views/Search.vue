<template>
  <div class="container">
    <h1 class="text-center my-4">영화 검색</h1>

    <!-- 필터링 UI -->
    <div class="filters mb-4">
      <div class="row">
        <!-- 평점 필터 -->
        <div class="col-md-4">
          <label for="rating" class="form-label">평점</label>
          <select
            v-model="selectedRating"
            class="form-select"
            @change="applyFilters"
            id="rating"
          >
            <option value="">전체</option>
            <option value="7">7 이상</option>
            <option value="8">8 이상</option>
            <option value="9">9 이상</option>
          </select>
        </div>

        <!-- 정렬 필터 -->
        <div class="col-md-4">
          <label for="sort" class="form-label">정렬</label>
          <select
            v-model="selectedSort"
            class="form-select"
            @change="applyFilters"
            id="sort"
          >
            <option value="">기본</option>
            <option value="popularity.desc">인기순</option>
            <option value="release_date.desc">개봉일순</option>
            <option value="vote_average.desc">평점순</option>
          </select>
        </div>

        <!-- 필터 초기화 버튼 -->
        <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-secondary" @click="resetFilters">필터 초기화</button>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="text-center my-4">
      <span class="spinner-border text-primary" role="status"></span>
      <span>로딩 중...</span>
    </div>

    <!-- 영화 목록 -->
    <div v-if="!loading && movies.length > 0" class="row movie-list">
      <div
        v-for="(movie, index) in movies"
        :key="movie.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 movie-card"
        @click="selectMovie(movie)"
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
    </div>

    <!-- 더 이상 데이터가 없을 때 -->
    <div v-if="endOfList" class="text-center my-4">
      <span>더 이상 영화가 없습니다.</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { getMovies } from '../api'; // getMovies API 함수

export default {
  data() {
    return {
      loading: false, // 로딩 상태
      endOfList: false, // 더 이상 영화가 없을 때 표시
      page: 1, // 현재 페이지
      query: '', // 검색 쿼리
      selectedRating: '', // 선택된 평점
      selectedSort: '', // 선택된 정렬
    };
  },
  computed: {
    ...mapState(['movies']), // Vuex에서 가져온 영화 목록
  },
  methods: {
    ...mapActions(['fetchMovies']), // Vuex에서 fetchMovies 액션

    // 영화 포스터 이미지 URL
    getMovieImageUrl(path) {
      if (path) {
        return `https://image.tmdb.org/t/p/w500${path}`;
      }
      return 'https://via.placeholder.com/500x750?text=No+Image'; // 이미지가 없으면 기본 이미지 표시
    },

    // 날짜 포맷팅
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    // 영화 선택 시
    selectMovie(movie) {
      // 영화 상세보기 로직 추가 가능
    },

    // 필터링 적용
    applyFilters() {
      this.page = 1; // 필터가 변경될 때 페이지를 초기화
      this.endOfList = false;
      this.loadMoreMovies();
    },

    // 추가 영화 로드
    async loadMoreMovies() {
      this.loading = true;
      const params = {
        query: this.query,
        page: this.page,
        rating: this.selectedRating,
        sort: this.selectedSort,
      };
      try {
        const data = await this.fetchMovies(params);
        if (data.results.length === 0) {
          this.endOfList = true;
        }
      } catch (error) {
        console.error('영화 로드 실패:', error);
      } finally {
        this.loading = false;
      }
    },

    // 필터 초기화
    resetFilters() {
      this.selectedRating = '';
      this.selectedSort = '';
      this.page = 1;
      this.endOfList = false;
      this.loadMoreMovies(); // 필터 초기화 후 첫 번째 페이지 로드
    },
  },
  mounted() {
    if (this.query) {
      this.loadMoreMovies(); // 쿼리가 있을 때 영화 로드
    }
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
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
  transform: scale(1.05);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
