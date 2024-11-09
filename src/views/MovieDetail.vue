<!-- src/views/MovieDetail.vue -->
<template>
    <div v-if="movie">
        <h2>{{ movie.title }}</h2>
        <button @click="toggleWishlist(movie)">
            {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
        </button>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getMovies } from '../api';

export default {
    data() {
        return { movie: null };
    },
    computed: {
        ...mapState(['wishlist']),
        isInWishlist() {
            return this.wishlist.some(m => m.id === this.movie.id);
        },
    },
    methods: {
        ...mapMutations(['toggleWishlist']),
        async fetchMovie() {
            const data = await getMovies(`movie/${this.$route.params.id}`);
            this.movie = data;
        },
    },
    mounted() {
        this.fetchMovie();
    },
};
</script>
