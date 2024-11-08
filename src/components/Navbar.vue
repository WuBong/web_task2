<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">My App</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- Home Button -->
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <!-- Wishlist Button -->
            <li class="nav-item">
              <router-link to="/wishlist" class="nav-link">Wishlist</router-link>
            </li>

            <li class="nav-item">
              <router-link to="/popular" class="nav-link">Popular</router-link>
            </li>

            <li class="nav-item">
              <router-link to="/search" class="nav-link">Search</router-link>
            </li>

            <!-- Logout Button -->
            <li class="nav-item" v-if="isLoggedIn">
              <button class="nav-link btn btn-link" @click="handleLogout">로그아웃</button>
            </li>
            <!-- Login Button -->
            <li class="nav-item" v-else>
              <router-link to="/signin" class="nav-link">로그인</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoggedIn: false,
      };
    },
    created() {
      this.checkLoginStatus();
    },
    methods: {
      checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem("user"));
        const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
  
        // Check if a user is logged in
        if (user && user.isLoggedIn) {
          this.isLoggedIn = true;
        } else if (rememberedUser && rememberedUser.rememberMe) {
          // Automatically log in if "remember me" is true
          this.isLoggedIn = true;
        }
      },
      handleLogout() {
        // Keep the user object but update the isLoggedIn flag to false
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.isLoggedIn = false;
          localStorage.setItem("user", JSON.stringify(user));
        }
  
        // Remove remembered user from localStorage
        localStorage.removeItem("rememberedUser");
        this.isLoggedIn = false;
        this.$router.push("/signin");  // Redirect to the login page
      },
    },
  };
  </script>
  
  <style scoped>
  /* You can add additional styling for the navbar if needed */
  </style>
  