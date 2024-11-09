<!-- src/views/HomeView.vue -->
<template>
  <div class="container">
    <h1 class="text-center my-4">Popular Movies</h1>
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="movie in movies" :key="movie.id">
        <div class="card h-100" @click="goToMovieDetail(movie.id)" style="cursor: pointer;">
          <img
            :src="getMovieImageUrl(movie.poster_path)"
            class="card-img-top"
            :alt="movie.title"
          />
          <div class="card-body">
            <h5 class="card-title text-truncate">{{ movie.title }}</h5>
            <p class="card-text">{{ formatDate(movie.release_date) }}</p>
          </div>
          <div class="card-footer d-flex justify-content-end">
            <button
              class="btn btn-outline-danger btn-sm"
              @click.stop="toggleWishlist(movie)"
            >
              <i :class="isInWishlist(movie) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['movies', 'wishlist']),
  },
  methods: {
    ...mapActions(['fetchMovies']),
    ...mapMutations(['toggleWishlist']),
    
    goToMovieDetail(id) {
      this.$router.push({ name: 'MovieDetail', params: { id } });
    },
    
    getMovieImageUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },
    
    isInWishlist(movie) {
      return this.wishlist.some((m) => m.id === movie.id);
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  mounted() {
    this.fetchMovies();
  },
};
</script>

<style scoped>
.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
