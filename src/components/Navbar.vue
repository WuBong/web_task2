<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary" ref="navbar">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">MyNeflix</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/wishlist" class="nav-link">Wishlist</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/popular" class="nav-link">Popular</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/search" class="nav-link">Search</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <button class="nav-link btn btn-link" @click="handleLogout">Logout</button>
          </li>
          <li class="nav-item" v-else>
            <router-link to="/signin" class="nav-link">Login</router-link>
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
      if (user && user.isLoggedIn) {
        this.isLoggedIn = true;
      } else if (rememberedUser && rememberedUser.rememberMe) {
        this.isLoggedIn = true;
      }
    },
    handleLogout() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.isLoggedIn = false;
        localStorage.setItem("user", JSON.stringify(user));
      }
      localStorage.removeItem("rememberedUser");
      this.isLoggedIn = false;
      this.$router.push("/signin");
    },
    // 네비게이션 바의 높이를 부모 컴포넌트로 전달
    calculateNavbarHeight() {
      const navbar = this.$refs.navbar;
      if (navbar) {
        this.$emit("navbar-height", navbar.offsetHeight);
      }
    },
  },
  mounted() {
    this.calculateNavbarHeight();
    window.addEventListener("resize", this.calculateNavbarHeight);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateNavbarHeight);
  },
};
</script>

<style scoped>
.navbar {
  background-color: #007bff !important; /* 푸른색으로 변경 */
}
.navbar-dark .navbar-brand,
.navbar-dark .nav-link {
  color: #ffffff !important; /* 텍스트 색상 흰색 */
}
.navbar-dark .nav-link:hover {
  color: #d1ecf1 !important; /* 호버 시 연한 색 */
}
</style>
